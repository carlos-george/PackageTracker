FROM node:14-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn

COPY . .

CMD ["yarn", "start:dev"]