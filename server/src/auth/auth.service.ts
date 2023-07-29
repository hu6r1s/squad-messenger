import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string): Promise<any> {
    console.log('AuthService');

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user) {
      const { password, ...result } = user;

      const accessToken = await this.jwtService.sign(result);

      result['token'] = accessToken;

      return result;
    }
    return null;
  }
}