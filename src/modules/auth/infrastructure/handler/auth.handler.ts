import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { Controller, Inject, Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { USER_CREATED } from '@config';
import { CreateAuthUseCase } from '@modules/auth/application/create-auth/create-auth.use-case';
import { CreateAuthDto } from '@modules/auth/application/create-auth/create-auth.mapper';

@Injectable()
@Controller()
export class AuthHandler {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepository: AuthRepositoryPort,
	) {}

	@EventPattern(USER_CREATED)
	async handle(@Payload() data: CreateAuthDto) {
		const createAuth = new CreateAuthUseCase(this.authRepository);

		await createAuth.run(data);
	}
}
