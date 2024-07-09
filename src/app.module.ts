import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitMqConfig from './config/rabbit-mq.config';
import { EventBusPortSymbol } from '@lib';
import { RabbitMqModule, RabbitMqEventBus } from '@config';
import { CqrsModule } from '@nestjs/cqrs';
import { SagasModule } from './sagas/sagas.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			// envFilePath: `.env.${process.env.NODE_ENV}`,
			isGlobal: true,
			load: [rabbitMqConfig],
		}),
		SagasModule,
		RabbitMqModule,
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
})
export class AppModule {}
