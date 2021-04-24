import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { uuid } from 'uuidv4';

import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, RouteDocument } from './entities/route.entity';


@Injectable()
export class RoutesService {

  constructor(@InjectModel(Route.name) private routeModel: Model<RouteDocument>) { }

  create(createRouteDto: CreateRouteDto) {

    if (!createRouteDto._id) createRouteDto._id = uuid();

    const dtoNew = new this.routeModel(createRouteDto);

    return dtoNew.save();
  }

  findAll(): Promise<RouteDocument[]> {
    return this.routeModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
