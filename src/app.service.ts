import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'bson';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async createUser(data: any) {
    try {
      //   const alreadyExist = await this.userModel.findOne({email:data.email})
      //   if(alreadyExist){
      //     return {status:false,message:'Email already exists',data:null}
      //   }
      //   const salt = await genSalt(12);
      //   const password = await hash(data.password, salt);
      // await this.userModel.create({
      //   name:data.name,
      //   email:data.email,
      //   password,
      //   type:'User'
      // })
      console.log('data', data);
      return { status: true, message: 'user created', data };
    } catch (error) {
      return { status: false, message: 'Internal server error', data: error };
    }
  }

  async login(data: any) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      return { status: false, message: 'Email does not exists', data: null };
    }
    if (!compareSync(data.password, user.password)) {
      return {
        status: false,
        message: 'Email or password is incorrect',
        data: null,
      };
    }
    let temp: any = { ...user };

    temp = { ...temp._doc };

    delete temp.password;
    delete temp.password;
    const token = this.generateToken(user);
    return { status: true, message: 'login successfully', data: token };
  }

  async getMe(data: string) {
    const user = await this.userModel.findOne({
      _id: new ObjectId(data),
    });
    if (!user) {
      return { stauts: false, message: 'user not found', data: null };
    }

    return { stauts: true, message: 'user found', data: user };
  }

  async getHello(data) {
    console.log(data);
  }

  private generateToken(payload: any) {
    // return this.jwtService.sign({ email: payload.email });
    return this.jwtService.sign({
      email: payload.email,
      userId: payload._id,
      userType: payload.type,
      verified: payload.verified,
    });
  }
}
