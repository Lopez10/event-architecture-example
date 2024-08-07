import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '../domain/user.repository.port';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './user.register.mapper';
import { CreateUserUseCase } from '../application/use-case/create-user/create-user.use-case';
import { CreateUserDto } from '../application/use-case/create-user/create-user.mapper';
import { EventBusPort, EventBusPortSymbol } from '@lib';
import { UserCreated } from '../application/events/user-created';
import { USER_CREATED } from '@config';

@ApiTags('User')
@Controller('User')
export class UserController {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepository: UserRepositoryPort,
		@Inject(EventBusPortSymbol)
		private readonly eventBus: EventBusPort,
	) {}

	@Post('register')
	@ApiResponse({
		status: 201,
		description: 'User created',
	})
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		const createUser = new CreateUserUseCase(this.userRepository);
		const createUserDto: CreateUserDto = {
			email: registerDto.email,
			name: registerDto.name,
		};

		const userCreated = await createUser.run(createUserDto);

		if (userCreated.isLeft()) {
			throw userCreated.getLeft();
		}

		const user = userCreated.get();

		const event = new UserCreated(USER_CREATED, {
			userId: user.id.value,
			password: registerDto.password,
		});

		this.eventBus.publish(event);

		return;
	}
}
