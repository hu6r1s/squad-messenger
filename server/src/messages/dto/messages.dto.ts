import { IsString, IsNotEmpty } from "class-validator";

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  receiver: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}