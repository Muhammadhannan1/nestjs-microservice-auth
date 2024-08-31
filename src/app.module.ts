// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { User, UserSchema } from './user.schema';
// import { MongooseModule } from '@nestjs/mongoose';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
//     MongooseModule.forRoot('mongodb://localhost:27017/microservice_user'),
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//     JwtModule.registerAsync({
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { GenericExceptionFilter } from './exception/generic-exception.fliter';
import { APP_FILTER } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forRoot('mongodb://localhost:27017/microservice'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth_exchange', // Name of the exchange
          type: 'topic', // Type of exchange
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672', // RabbitMQ server URI
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: GenericExceptionFilter,
    },
  ],
})
export class AppModule {}
