import { Event } from '@lib';

export type UserCreationFailedPayload = {
	email: string;
	reason: string;
};

export class UserCreationFailed implements Event {
	constructor(
		public readonly name: string,
		public readonly payload: UserCreationFailedPayload,
	) {}
}
