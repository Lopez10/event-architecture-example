import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import rabbitMqConfig from './config/rabbit-mq.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXAMPLE_SERVICE } from './config/rabbit-mq.services';
import { EventBusPortSymbol } from '@lib';
import { RabbitMqEventBus } from '@config/rabbit-mq.event-bus';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			// envFilePath: `.env.${process.env.NODE_ENV}`,
			isGlobal: true,
			load: [
				() => ({
					rabbitmq: {
						url:
							process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
						queue: process.env.RABBITMQ_QUEUE || 'notifications_queue',
					},
				}),
			],
		}),
		ClientsModule.registerAsync([
			{
				name: EXAMPLE_SERVICE,
				imports: [ConfigModule],
				useFactory: (configService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get('RABBITMQ_URL')],
						queue: configService.get('RABBITMQ_QUEUE'),
						queueOptions: {
							durable: false,
						},
					},
				}),
				inject: [ConfigService],
			},
		]),

		UserModule,
		AuthModule,
	],
	controllers: [],
	providers: [
		{
			provide: EventBusPortSymbol,
			useClass: RabbitMqEventBus,
		},
	],
	exports: [EventBusPortSymbol],
})
export class AppModule {}
