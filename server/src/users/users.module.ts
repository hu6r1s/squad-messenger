import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // JwtModule.register({
    //   secret: 'secret',
    //   signOptions: { expiresIn: '1d' }
    // }),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService, UsersModule]
})
export class UsersModule { }
