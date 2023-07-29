import { IsString, IsOptional, Matches, IsNotEmpty } from "class-validator";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/

export class CreateUserDTO {
  @IsString()
  @Matches(USER_REGEX, {
    message: "4자 이상 23자 이하로 입력해주세요!"
  })
  username: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: "비밀번호 양식에 맞게 입력해주세요!"
  })
  password: string;

  @IsString()
  @Matches(EMAIL_REGEX, {
    message: "이메일 양식에 맞게 입력해주세요!"
  })
  email: string;

  @IsOptional()
  nickname: string;
}