import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { CreateAuthUseCase } from './application/create-auth/create-auth.use-case';
import { AuthRepositoryPortSymbol } from './domain/auth.repository.port';
import { AuthPrismaRepository } from './infrastructure/repository/auth.prisma.repository';

@Module({
	imports: [PrismaModule],
	controllers: [],
	providers: [
		CreateAuthUseCase,
		{
			provide: AuthRepositoryPortSymbol,
			useClass: AuthPrismaRepository,
		},
	],
})
export class AuthModule {}
