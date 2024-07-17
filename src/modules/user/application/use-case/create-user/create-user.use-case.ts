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
import {
	UserEntityUnknownException,
	UserNotFoundException,
} from '@modules/user/domain/user.exception';

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
			| UnexpectedError
			| UserNotFoundException
			| UserEntityUnknownException,
			User
		>
	> {
		const emailVo = Email.create(createUserDto.email);
		if (emailVo.isLeft()) {
			return Either.left(emailVo.getLeft());
		}

		const userFound = await this.userRepository.findByEmail(emailVo.get());

		if (userFound.isRight()) {
			return Either.left(userFound.getLeft());
		}

		const newUser = User.create({
			email: emailVo.get(),
			name: createUserDto.name,
		});

		if (newUser.isLeft()) {
			return Either.left(newUser.getLeft());
		}

		const user = await this.userRepository.insert(newUser.get());

		if (user.isLeft()) {
			return Either.left(user.getLeft());
		}

		return Either.right(user.get());
	}
}
