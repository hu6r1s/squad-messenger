import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageDTO } from "./dto/messages.dto";
import { Message } from "./entities/messages.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  async sendMessage(sender: string, messageDTO: MessageDTO): Promise<Message> {
    const { receiver, content } = messageDTO;
    const message = this.messageRepository.create({ sender, receiver, content })
    return this.messageRepository.save(message)
  }

  async getMessageByReceiver(receiver: string): Promise<Message[]> {
    return this.messageRepository.find({ where: { receiver }, order: { sentAt: "ASC" } })
  }
}
