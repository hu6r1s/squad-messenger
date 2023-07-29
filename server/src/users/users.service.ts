import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async findOne(condition: Partial<User>): Promise<User> {
    return this.usersRepository.findOne({ where: condition });
  }

  async create(data: any): Promise<User> {
    return this.usersRepository.save(data);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const isUsernameTaken = await this.usersRepository.findOne({ where: { username } });
    return !!isUsernameTaken;
  }

  // async update(username: string, user: UpdateUserDTO) {
  //   try {
  //     const prevUser = await this.usersRepository.findOne({ where: { username } })
  //     let userToUpdate = { ...prevUser, ...user }
  //     await this.usersRepository.save(userToUpdate)
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY') {
  //       throw new ConflictException('이미 존재한 계정입니다.');
  //     }
  //     throw error;
  //   }
  // }

  // async remove(username: string): Promise<void> {
  //   try {
  //     await this.usersRepository.delete({ username })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}
