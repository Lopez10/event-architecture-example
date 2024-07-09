import { Either, UnexpectedError, Id } from '@lib';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Auth } from '../../domain/auth.entity';
import { AuthNotFoundException } from '../../domain/auth.entity.exception';
import { AuthRepositoryPort } from '../../domain/auth.repository.port';
import { AuthMapper as AuthPersistenceMapper } from './auth.repository.mapper';
import type { Auth as AuthPrisma } from '@prisma/client';

@Injectable()
export class AuthPrismaRepository implements AuthRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async insert(auth: Auth): Promise<Either<UnexpectedError, void>> {
		const authPrisma: AuthPrisma = AuthPersistenceMapper.toPersistence(auth);

		await this.prisma.auth.create({
			data: authPrisma,
		});

		return Either.right(undefined);
	}

	async findByUserId(
		userId: Id,
	): Promise<Either<UnexpectedError | AuthNotFoundException, Auth>> {
		const authPersistence: AuthPrisma = await this.prisma.auth.findUnique({
			where: { userId: userId.value },
		});

		if (!authPersistence) {
			return Either.left(new AuthNotFoundException());
		}

		const auth = AuthPersistenceMapper.persistanceToDomain(authPersistence);

		return Either.right(auth);
	}
}
