import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { UserRepositoryPortSymbol } from './domain/user.repository.port';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { EventBusPortSymbol } from '@lib';
import { RabbitMqEventBus } from '@config/rabbit-mq.event-bus';
import { CreateUserUseCase } from './application/use-case/create-user/create-user.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXAMPLE_SERVICE } from '@config';

@Module({
	imports: [
		PrismaModule,
		ConfigModule,
		ClientsModule.registerAsync([
			{
				name: EXAMPLE_SERVICE,
				imports: [ConfigModule],
				useFactory: async (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>('RABBITMQ_URL')],
						queue: configService.get<string>('RABBIMTQ_QUEUE'),
						queueOptions: {
							durable: false,
						},
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
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
