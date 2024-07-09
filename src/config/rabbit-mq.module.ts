import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EXAMPLE_SERVICE } from './rabbit-mq.services';

@Global()
@Module({
	imports: [
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
	],
	exports: [ClientsModule],
})
export class RabbitMqModule {}
