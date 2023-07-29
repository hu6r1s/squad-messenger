import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from '../users/users.service';

interface JwtPayload {
  id: number; // 사용자 ID
  iat?: number; // 토큰 발급 시간 (optional)
  exp?: number; // 토큰 만료 시간 (optional)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: "secret",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id: userId } = payload;
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}