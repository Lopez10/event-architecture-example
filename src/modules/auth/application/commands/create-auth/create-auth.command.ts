import { CreateAuthDto } from './create-auth.mapper';

export class CreateAuthCommand {
	constructor(public readonly createAuthDto: CreateAuthDto) {}
}
