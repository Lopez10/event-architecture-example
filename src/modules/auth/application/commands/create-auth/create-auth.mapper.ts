import { Id, Password } from '@lib';
import { Auth } from '@modules/auth/domain/auth.entity';

export type CreateAuthDto = {
	userId: string;
	password: string;
};

export class CreateAuthMapper {
	static toDto(auth: Auth): CreateAuthDto {
		return {
			userId: auth.userId.value,
			password: auth.password.value,
		};
	}

	static toDomain(createAuthDto: CreateAuthDto): Auth {
		return Auth.create({
			userId: new Id(createAuthDto.userId),
			password: Password.create(createAuthDto.password).get(),
		}).get();
	}
}
