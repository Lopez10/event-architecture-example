import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitMqConfig from './config/rabbit-mq.config';
import { SagasModule } from './sagas/sagas.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
			load: [rabbitMqConfig],
		}),
		SagasModule,
		UserModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
