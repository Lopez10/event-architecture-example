import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
	const rabbitMqQueue = configService.get<string>('RABBITMQ_QUEUE');
	const nestPort = configService.get<number>('NEST_PORT');

	const microserviceOptions: MicroserviceOptions = {
		transport: Transport.RMQ,
		options: {
			urls: [rabbitMqUrl],
			queue: rabbitMqQueue,
			queueOptions: {
				durable: false,
			},
		},
	};

	app.connectMicroservice(microserviceOptions);
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
