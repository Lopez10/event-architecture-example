import { Either, Entity, Id, Password } from '@lib';
import { AuthEntityUnknownException } from './auth.entity.exception';

export type AuthProps = {
	userId: Id;
	password: Password;
};

export type AuthPrimitives = {
	id: string;
	userId: string;
	password: string;
};

export class Auth extends Entity<AuthProps> {
	get password() {
		return this.props.password;
	}

	private constructor(props: AuthProps, id?: Id) {
		super(props, id);
	}

	public static create(
		props: AuthProps,
		id?: Id,
	): Either<AuthEntityUnknownException, Auth> {
		const auth = new Auth(props, id);

		return Either.right(auth);
	}
}
