import { Event } from '@lib';

export type AuthCreationFailedPayload = {
	userId: string;
	reason: string;
};

export class AuthCreationFailed implements Event {
	constructor(
		public readonly name: string,
		public readonly payload: AuthCreationFailedPayload,
	) {}
}
