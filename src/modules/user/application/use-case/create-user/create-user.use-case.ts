import {
	Either,
	Email,
	EventBusPort,
	EventBusPortSymbol,
	InvalidEmailFormatException,
} from '@lib';
import { User } from '@modules/user/domain/user.entity';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '@modules/user/domain/user.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from './create-user.exception';
import { CreateUserDto } from './create-user.mapper';
import { UserCreated } from '../../events/user-created';
import { UserCreationFailed } from '../../events/user-creation-failed';
import { USER_CREATED } from '@modules/events';

@Injectable()
export class CreateUser {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepository: UserRepositoryPort,
		@Inject(EventBusPortSymbol)
		private readonly eventBus: EventBusPort,
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

		const userCreated = newUser.get();

		try {
			await this.userRepository.insert(userCreated);

			const event = new UserCreated(USER_CREATED, {
				id: userCreated.id.value,
				email: userCreated.email.value,
				name: userCreated.name,
			});

			this.eventBus.publish(event);

			return Either.right(undefined);
		} catch (error) {
			const failureEvent = new UserCreationFailed('user-creation-failed', {
				email: userCreated.email.value,
				reason: error.message,
			});

			this.eventBus.publish(failureEvent);

			return Either.left(error);
		}
	}
}
