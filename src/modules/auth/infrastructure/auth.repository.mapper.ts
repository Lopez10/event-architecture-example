import { Id, Password } from '@lib';
import { Auth, AuthPrimitives } from '../domain/auth.entity';

export class AuthMapper {
	static toDomain(authDto: AuthPrimitives): Auth {
		return Auth.create(
			{
				userId: new Id(authDto.userId),
				password: Password.create(authDto.password).get(),
			},
			new Id(authDto.id),
		).get();
	}

	static persistanceToDomain(authDto: AuthPrimitives): Auth {
		return Auth.create(
			{
				userId: new Id(authDto.userId),
				password: Password.rehydrate(authDto.password),
			},
			new Id(authDto.id),
		).get();
	}
}
