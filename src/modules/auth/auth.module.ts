import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { CreateAuthUseCase } from './application/create-auth/create-auth.use-case';
import { AuthRepositoryPortSymbol } from './domain/auth.repository.port';
import { AuthPrismaRepository } from './infrastructure/repository/auth.prisma.repository';
import { AuthHandler } from './infrastructure/handler/auth.handler';

@Module({
	imports: [PrismaModule],
	controllers: [AuthHandler],
	providers: [
		CreateAuthUseCase,
		{
			provide: AuthRepositoryPortSymbol,
			useClass: AuthPrismaRepository,
		},
	],
})
export class AuthModule {}
