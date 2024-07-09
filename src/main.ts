import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const nestPort = configService.get<number>('NEST_PORT');

	app.setGlobalPrefix('api');

	const config = new DocumentBuilder()
		.setTitle('API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-doc', app, document);

	await app.startAllMicroservices();
	await app.listen(nestPort);
}
bootstrap();
