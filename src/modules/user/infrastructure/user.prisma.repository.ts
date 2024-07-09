import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../domain/user.repository.port';
import { PrismaService } from 'src/prisma/prisma.service';
import { Either, Email, Id, UnexpectedError } from '@lib';
import type { User, UserPrimitives } from '../domain/user.entity';
import type { User as UserPrisma } from '@prisma/client';
import { UserNotFoundException } from '../domain/user.exception';
import { UserMapper as UserRepositoryMapper } from './user.repository.mapper';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(
		email: Email,
	): Promise<Either<UserNotFoundException, User>> {
		const userPersistence: UserPrisma = await this.prisma.user.findUnique({
			where: {
				email: email.value,
			},
		});

		if (!userPersistence) {
			return Either.left(new UserNotFoundException());
		}

		const user = UserRepositoryMapper.toDomain(userPersistence).get();

		return Either.right(user);
	}

	async insert(user: User): Promise<Either<UnexpectedError, void>> {
		const userPrisma: UserPrimitives = UserRepositoryMapper.toDto(user);

		await this.prisma.user.create({
			data: userPrisma,
		});

		return Either.right(undefined);
	}
}
