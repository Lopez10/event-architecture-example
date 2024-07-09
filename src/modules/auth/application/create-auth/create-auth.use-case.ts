import { Either, Id } from '@lib';
import { Inject, Injectable } from '@nestjs/common';
import { AuthEntityUnknownException } from '../../domain/auth.entity.exception';
import { CreateAuthDto, CreateAuthMapper } from './create-auth.mapper';
import {
	AuthRepositoryPort,
	AuthRepositoryPortSymbol,
} from '../../domain/auth.repository.port';

@Injectable()
export class CreateAuthUseCase {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepositoryPort: AuthRepositoryPort,
	) {}
	async run(
		createAuthDto: CreateAuthDto,
	): Promise<Either<AuthEntityUnknownException, void>> {
		const userId = new Id(createAuthDto.userId);
		const authFound = await this.authRepositoryPort.findByUserId(userId);

		if (authFound) {
			return Either.left(new AuthEntityUnknownException());
		}

		const auth = CreateAuthMapper.toDomain(createAuthDto);

		await this.authRepositoryPort.insert(auth);

		return Either.right(undefined);
	}
}
