import { AuthService } from '../../../Application/auth/services/auth.service';
import { Body, Controller, HttpCode, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../../Application/auth/dtos/login.dto';
import { CreateUserUseCase } from '../../../Application/users/use-cases/create-user.usecase';
import { CreateUserDto } from '../usuarios/dto/create-user.dto';
import type { Response } from 'express';
import type { Request } from 'express';


@Controller('auth')
export class AuthController {

  private readonly logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService,
              private readonly createUserUseCase: CreateUserUseCase,) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {

    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password
    );

    // refreshToken va SOLO en cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // el body solo devuelve accessToken
    return { accessToken };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { accessToken, newRefreshToken } = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return { accessToken };
  }

}
