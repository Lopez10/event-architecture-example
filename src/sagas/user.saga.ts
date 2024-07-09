import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ofType, Saga } from '@nestjs/cqrs';
import { CreateAuthCommand } from '@modules/auth/application/create-auth/create-auth.command';
import { UserCreatedEvent } from '../modules/user/application/events/user-created';

@Injectable()
export class UserSagas {
	@Saga()
	userCreated = (
		events$: Observable<unknown>,
	): Observable<CreateAuthCommand> => {
		return events$.pipe(
			ofType(UserCreatedEvent),
			map((event) => new CreateAuthCommand(event.payload)),
		);
	};
}
