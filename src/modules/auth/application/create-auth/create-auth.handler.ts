import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAuthCommand } from './create-auth.command';
import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { Inject } from '@nestjs/common';
import { AuthEntityUnknownException } from '@modules/auth/domain/auth.entity.exception';
import { Either, Id } from '@lib';
import { CreateAuthMapper } from './create-auth.mapper';

@CommandHandler(CreateAuthCommand)
export class CreateAuthHandler implements ICommandHandler<CreateAuthCommand> {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepositoryPort: AuthRepositoryPort,
	) {}
	async execute({
		createAuthDto,
	}: CreateAuthCommand): Promise<Either<AuthEntityUnknownException, void>> {
		const userId = new Id(createAuthDto.userId);
		const authFound = await this.authRepositoryPort.findByUserId(userId);

		if (!authFound) {
			return Either.left(new AuthEntityUnknownException());
		}

		const auth = CreateAuthMapper.toDomain(createAuthDto);

		await this.authRepositoryPort.insert(auth);

		return Either.right(undefined);
	}
}
