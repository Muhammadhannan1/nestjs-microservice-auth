import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RabbitSubscribe, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RabbitRPC({
    exchange: 'auth_exchange',
    routingKey: 'auth.signUp',
    queue: 'auth_signUp_queue',
    queueOptions: {
      messageTtl: 10000,
      maxLength: 10,
    },
  })
  handleSignUp(data: any) {
    console.log('Received sign-up data:', data);
    return this.appService.createUser(data);
  }

  @RabbitRPC({
    exchange: 'auth_exchange',
    routingKey: 'auth.login',
    queue: 'auth_login_queue',
    queueOptions: {
      messageTtl: 10000,
      maxLength: 10,
    },
  })
  handleUserLogin(data) {
    return this.appService.login(data);
  }

  @MessagePattern('getMe')
  handleUserGetMe(data) {
    return this.appService.getMe(data);
  }

  @EventPattern('getHello')
  handleGetHello(data) {
    return this.appService.getHello(data);
  }
}
