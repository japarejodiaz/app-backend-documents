import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserUseCase } from '../../../Domain/users/create-user.usecase';
import { GetUserByIdUseCase } from '../../../Domain/users/get-user-by-id.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsuariosController {

  private readonly logger = new Logger('UsuariosController');
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea un usuario' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async crearUsuario(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUser.execute(dto);

    this.logger.log(`Usuario creado: ${user.id}`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario por ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async obtenerUsuario(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserById.execute(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
