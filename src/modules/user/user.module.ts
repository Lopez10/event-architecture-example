import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { UserRepositoryPortSymbol } from './domain/user.repository.port';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { CreateUserUseCase } from './application/use-case/create-user/create-user.use-case';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
	imports: [PrismaModule, ConfigModule, CqrsModule],
	controllers: [UserController],
	providers: [
		CreateUserUseCase,
		{
			provide: UserRepositoryPortSymbol,
			useClass: UserPrismaRepository,
		},
	],
})
export class UserModule {}
