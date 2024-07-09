import { Either, Email, Id } from '@lib';
import { User, type UserPrimitives } from '../../domain/user.entity';
import { UserEntityUnknownException } from '../../domain/user.exception';

export class UserMapper {
	static toDomain(
		userDto: UserPrimitives,
	): Either<UserEntityUnknownException, User> {
		return User.create(
			{
				email: Email.create(userDto.email).get(),
				name: userDto.name,
			},
			new Id(userDto.id),
		);
	}

	static toDto(user: User): UserPrimitives {
		return {
			id: user.id.value,
			email: user.email.value,
			name: user.name,
		};
	}
}
