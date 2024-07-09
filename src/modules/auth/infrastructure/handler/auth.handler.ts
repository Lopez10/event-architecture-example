import {
	AuthRepositoryPortSymbol,
	AuthRepositoryPort,
} from '@modules/auth/domain/auth.repository.port';
import { Inject } from '@nestjs/common';

export class AuthHandler {
	constructor(
		@Inject(AuthRepositoryPortSymbol)
		private readonly authRepository: AuthRepositoryPort,
	) {}
}
