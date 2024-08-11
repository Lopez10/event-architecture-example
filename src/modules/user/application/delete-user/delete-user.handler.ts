import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { Inject } from '@nestjs/common';
import {
	UserRepositoryPort,
	UserRepositoryPortSymbol,
} from '@modules/user/domain/user.repository.port';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
	constructor(
		@Inject(UserRepositoryPortSymbol)
		private readonly userRepositoryPort: UserRepositoryPort,
	) {}

	async execute(command: DeleteUserCommand): Promise<void> {
		console.log('Delete user command received', command);
	}
}
