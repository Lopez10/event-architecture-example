import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSagas } from './user.saga';

@Module({
	imports: [CqrsModule],
	providers: [UserSagas],
})
export class SagasModule {}
