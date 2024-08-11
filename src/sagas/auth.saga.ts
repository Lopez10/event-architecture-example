import { AuthCreationFailed } from '@modules/auth/application/events/auth-creation-failed';
import { DeleteUserCommand } from '@modules/user/application/delete-user/delete-user.command';
import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthSagas {
	@Saga()
	authFailed = (events$: Observable<unknown>): Observable<unknown> => {
		return events$.pipe(
			ofType(AuthCreationFailed),
			map((event) => {
				new DeleteUserCommand(event.payload.userId);
			}),
		);
	};
}
