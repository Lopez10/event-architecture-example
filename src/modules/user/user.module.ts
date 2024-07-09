import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { UserRepositoryPortSymbol } from './domain/user.repository.port';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { EventBusPortSymbol } from '@lib';
import { RabbitMqEventBus, RabbitMqModule } from '@config';
import { CreateUserUseCase } from './application/use-case/create-user/create-user.use-case';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [PrismaModule, ConfigModule, RabbitMqModule],
	controllers: [UserController],
	providers: [
		CreateUserUseCase,
		{
			provide: UserRepositoryPortSymbol,
			useClass: UserPrismaRepository,
		},
		{
			provide: EventBusPortSymbol,
			useClass: RabbitMqEventBus,
		},
	],
})
export class UserModule {}
