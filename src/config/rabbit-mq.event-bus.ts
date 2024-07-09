import { Event, EventBusPort } from '@lib';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EXAMPLE_SERVICE } from './rabbit-mq.services';

@Injectable()
export class RabbitMqEventBus implements EventBusPort {
	constructor(@Inject(EXAMPLE_SERVICE) private readonly client: ClientProxy) {}

	publish(event: Event): void {
		this.client.emit(event.name, event.payload);
	}
}
