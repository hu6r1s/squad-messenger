import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagesService } from "./messages.service";
import { AuthGuard } from "@nestjs/passport";
import { MessageDTO } from "./dto/messages.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { Message } from "./entities/messages.entity";
import { User } from "src/users/entities/users.entity";
import { Request } from "express"

@Controller('api')
export class MessagesController {
  constructor(private messagesService: MessagesService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("/send")
  async sendMessage(
    @Body(ValidationPipe) messageDTO: MessageDTO,
    @GetUser() sender: User,
    @Req() request: Request
  ): Promise<Message> {
    console.log(request.headers)
    return this.messagesService.sendMessage(sender.username, messageDTO);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/inbox")
  async getInbox(@GetUser() receiver: User): Promise<Message[]> {
    return this.messagesService.getMessageByReceiver(receiver.username);
  }
}
