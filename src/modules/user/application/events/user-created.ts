import { Event } from '@lib';
import { CreateAuthDto } from '@modules/auth/application/create-auth/create-auth.mapper';

export class UserCreated implements Event {
	constructor(
		public readonly name: string,
		public readonly payload: CreateAuthDto,
	) {}
}
