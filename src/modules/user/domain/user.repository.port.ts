import type { Either, Email, UnexpectedError } from '@lib';
import type { User } from './user.entity';
import { UserNotFoundException } from './user.exception';

export interface UserRepositoryPort {
	findByEmail(email: Email): Promise<Either<UserNotFoundException, User>>;
	insert(user: User): Promise<Either<UnexpectedError, User>>;
}

export const UserRepositoryPortSymbol = Symbol('UserRepositoryPort');
