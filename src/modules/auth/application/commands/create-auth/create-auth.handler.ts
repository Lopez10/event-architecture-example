import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAuthCommand } from './create-auth.command';
import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { Inject } from '@nestjs/common';
import { AuthEntityUnknownException } from '@modules/auth/domain/auth.entity.exception';
import { Either, Id, UnexpectedError } from '@lib';
import { CreateAuthMapper } from './create-auth.mapper';
import { AuthCreationFailed } from '../../events/auth-creation-failed';
import { AUTH_FAILED } from '@sagas';

@CommandHandler(CreateAuthCommand)
export class CreateAuthHandler implements ICommandHandler<CreateAuthCommand> {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepositoryPort: AuthRepositoryPort,
		private readonly eventBus: EventBus,
	) {}
	async execute({
		createAuthDto,
	}: CreateAuthCommand): Promise<
		Either<AuthEntityUnknownException | UnexpectedError, void>
	> {
		const userId = new Id(createAuthDto.userId);
		const authFound = await this.authRepositoryPort.findByUserId(userId);

		if (!authFound) {
			return Either.left(new AuthEntityUnknownException());
		}

		const auth = CreateAuthMapper.toDomain(createAuthDto);

		const authInserted = await this.authRepositoryPort.insert(auth);

		if (!authInserted) {
			return Either.left(new AuthEntityUnknownException());
		}

		if (authInserted.isLeft()) {
			const event = new AuthCreationFailed(AUTH_FAILED, {
				userId: userId.value,
				reason: authInserted.getLeft().message,
			});

			this.eventBus.publish(event);

			return Either.left(authInserted.getLeft());
		}

		return Either.right(undefined);
	}
}
