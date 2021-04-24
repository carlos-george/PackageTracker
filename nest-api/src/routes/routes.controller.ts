import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Payload, MessagePattern } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RoutesGateway } from './routes.gateway';

@Controller('routes')
export class RoutesController implements OnModuleInit {

  private kafkaProducer: Producer;

  constructor(
    private readonly routesService: RoutesService,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
    private routesGateway: RoutesGateway
  ) { }

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    console.log('Route: ', createRouteDto);
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @Get(':id/start')
  startRoute(@Param('id') id: string) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId: id, clientId: '' })
        },
      ]
    });
    console.log('ID: ', id);
  }

  @MessagePattern('route.new-position')
  consumeNewPosition(@Payload() message: {
    value: {
      routeId: string;
      clientId: string;
      position: [number, number];
      finished: boolean
    }
  }) {
    this.routesGateway.sendPosition({
      ...message.value,
      position: [message.value.position[1], message.value.position[0]],
    });

  }
}
