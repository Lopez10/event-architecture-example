import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '../domain/user.repository.port';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './user.register.mapper';
import { CreateUser } from '../application/create-user/create-user.use-case';
import { CreateUserDto } from '../application/create-user/create-user.mapper';

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
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		const createUser = new CreateUser(this.userRepository);
		const createUserDto: CreateUserDto = {
			email: registerDto.email,
			name: registerDto.name,
		};

		const userCreated = await createUser.run(createUserDto);

		if (userCreated.isLeft()) {
			throw userCreated.getLeft();
		}

		return;
	}
}
