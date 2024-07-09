import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { USER_CREATED } from '@modules/events';
import { Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

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
