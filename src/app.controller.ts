import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @MessagePattern('signUp')
  // handleUserCreated(data) {
  //   return this.appService.createUser(data);
  // }

  @RabbitSubscribe({
    exchange: 'auth_exchange',
    routingKey: 'auth.signUp',
    queue: 'auth_signUp_queue',
  })
  handleSignUp(data: any) {
    console.log('Received sign-up data:', data);
    return this.appService.createUser(data);
  }

  @MessagePattern('login')
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
