import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '../domain/user.repository.port';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './user.register.mapper';

@ApiTags('User')
@Controller('User')
export class UserController {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepository: UserRepositoryPort,
	) {}

	@Post('register')
	@ApiResponse({
		status: 201,
		description: 'User created',
	})
	async register(@Body() registerDto: RegisterDto): Promise<void> {}
}
