export class UserCreationFailed {
	constructor(
		public readonly email: string,
		public readonly reason: string,
	) {}
}
