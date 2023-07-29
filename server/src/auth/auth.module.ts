import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),

  ],
  providers: [JwtStrategy, AuthService],
  exports: [PassportModule, JwtModule, AuthModule],
})
export class AuthModule { }