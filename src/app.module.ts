import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SagasModule } from '@sagas';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		SagasModule,
		UserModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
