import {
	Either,
	Email,
	EventBusPort,
	EventBusPortSymbol,
	InvalidEmailFormatException,
	UnexpectedError,
} from '@lib';
import { User } from '@modules/user/domain/user.entity';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '@modules/user/domain/user.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from './create-user.exception';
import { CreateUserDto } from './create-user.mapper';

@Injectable()
export class CreateUserUseCase {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepository: UserRepositoryPort,
	) {}

	async run(
		createUserDto: CreateUserDto,
	): Promise<
		Either<
			| InvalidEmailFormatException
			| UserAlreadyExistsException
			| UnexpectedError,
			User
		>
	> {
		const emailVo = Email.create(createUserDto.email);
		if (emailVo.isLeft()) {
			return Either.left(new InvalidEmailFormatException());
		}

		const userFound = await this.userRepository.findByEmail(emailVo.get());

		if (userFound.isRight()) {
			return Either.left(new UserAlreadyExistsException());
		}

		const newUser = User.create({
			email: emailVo.get(),
			name: createUserDto.name,
		});

		const user = await this.userRepository.insert(newUser.get());

		if (user.isLeft()) {
			return Either.left(new UnexpectedError());
		}

		return Either.right(user.get());
	}
}
