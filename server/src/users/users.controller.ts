import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Req, Res, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { LoginUserDTO } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt"
import { Response, Request } from "express";

@Controller("api")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) { }

  @Post("register")
  async createUser(@Body(ValidationPipe) user: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    const isUsernameTaken = await this.usersService.isUsernameTaken(user.username);
    if (isUsernameTaken) {
      throw new ConflictException('이미 존재하는 사용자명입니다.');
    }
    console.log(user.nickname)
    const userObj = await this.usersService.create({
      username: user.username,
      password: hashedPassword,
      email: user.email,
      ...(user.nickname ? { nickname: user.nickname } : {})
    });
    console.log("sex2", userObj);
    console.log("sex", {
      username: user.username,
      password: hashedPassword,
      email: user.email,
      ...(user.nickname ? { nickname: user.nickname } : {})
    });

    delete userObj.password;

    return userObj;
  }

  @Post("login")
  async login(@Body(ValidationPipe) user: LoginUserDTO, @Res({ passthrough: true }) response: Response) {
    const userObj = await this.usersService.findOne({ username: user.username });
    if (!userObj) {
      throw new BadRequestException('invalid credentials');
    }
    if (!await bcrypt.compare(user.password, userObj.password)) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: userObj.id });

    return {
      message: 'success',
      accessToken: jwt,
      userObj
    };
  }

  @Get("user")
  async user(@Req() request: Request) {
    try {
      const cookie = request.headers.authorization;
      const token = cookie.split(" ")
      console.log(token[1])
      const data = await this.jwtService.verifyAsync(token[1]);
      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.usersService.findOne({ id: data["id"] });

      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }

  // @Delete(":username")
  // removeOne(@Param("username") username: string): Promise<void> {
  //   return this.usersService.remove(username)
  // }

  // @Patch(":username")
  // updateOne(@Param("username") username: string, @Body(ValidationPipe) user: UpdateUserDTO) {
  //   return this.usersService.update(username, user)
  // }
}
