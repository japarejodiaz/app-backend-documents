import { AuthService } from '../../../Application/auth/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../../Application/auth/dtos/login.dto';
import { CreateUserUseCase } from '../../../Application/users/use-cases/create-user.usecase';
import { CreateUserDto } from '../../controllers/usuarios/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly createUserUseCase: CreateUserUseCase,) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
