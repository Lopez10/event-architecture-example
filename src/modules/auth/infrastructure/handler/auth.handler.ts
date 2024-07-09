import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { EXAMPLE_SERVICE, USER_CREATED } from '@config';

export class AuthHandler {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepository: AuthRepositoryPort,
	) {}

	@EventPattern(USER_CREATED)
	async handle() {
		// Handle event
	}
}
