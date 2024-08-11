import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { AuthRepositoryPortSymbol } from './domain/auth.repository.port';
import { AuthPrismaRepository } from './infrastructure/repository/auth.prisma.repository';
import { CreateAuthHandler } from './application/commands/create-auth/create-auth.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
	imports: [PrismaModule, CqrsModule],
	controllers: [],
	providers: [
		CreateAuthHandler,

		{
			provide: AuthRepositoryPortSymbol,
			useClass: AuthPrismaRepository,
		},
	],
})
export class AuthModule {}
