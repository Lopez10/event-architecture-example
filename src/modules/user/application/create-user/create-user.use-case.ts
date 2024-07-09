import { Either, Email, InvalidEmailFormatException } from '@lib';
import { User } from '@modules/user/domain/user.entity';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '@modules/user/domain/user.repository.port';
import { Inject } from '@nestjs/common';
import { UserAlreadyExistsException } from './create-user.exception';
import { CreateUserDto } from './create-user.mapper';

export class CreateUser {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepository: UserRepositoryPort,
	) {}

	async run(
		createUserDto: CreateUserDto,
	): Promise<
		Either<InvalidEmailFormatException | UserAlreadyExistsException, void>
	> {
		const emailVo = Email.create(createUserDto.email);
		if (emailVo.isLeft()) {
			return Either.left(new InvalidEmailFormatException());
		}

		const user = await this.userRepository.findByEmail(emailVo.get());

		if (user.isRight()) {
			return Either.left(new UserAlreadyExistsException());
		}

		const newUser = User.create({
			email: emailVo.get(),
			name: createUserDto.name,
		});

		await this.userRepository.insert(newUser.get());

		return Either.right(undefined);
	}
}
