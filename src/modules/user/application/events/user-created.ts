import { Event } from '@lib';
import { CreateAuthDto } from '@modules/auth/application/commands/create-auth/create-auth.mapper';

export class UserCreatedEvent implements Event {
	constructor(
		public readonly name: string,
		public readonly payload: CreateAuthDto,
	) {}
}
