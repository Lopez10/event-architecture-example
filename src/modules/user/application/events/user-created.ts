import { Event } from '@lib';
import { UserPrimitives } from '@modules/user/domain/user.entity';

export class UserCreated implements Event {
	constructor(
		public readonly name: string,
		public readonly payload: UserPrimitives,
	) {}
}
