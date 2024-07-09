import { Event, EventBusPort } from '@lib/application/cqrs/event-bus';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQEventBus implements EventBusPort, OnModuleInit {
	private connection: Connection;
	private channel: Channel;

	async onModuleInit(): Promise<void> {
		this.connection = await connect('amqp://localhost');
		this.channel = await this.connection.createChannel();
		this.channel.assertExchange('events', 'topic', { durable: false });
	}

	async subscribe(
		eventName: string,
		handler: (event: Event) => void,
	): Promise<void> {
		const queue = await this.channel.assertQueue('', { exclusive: true });
		this.channel.bindQueue(queue.queue, 'events', eventName);

		this.channel.consume(queue.queue, (msg: ConsumeMessage | null) => {
			if (msg !== null) {
				const event: Event = {
					name: msg.fields.routingKey,
					payload: JSON.parse(msg.content.toString()),
				};
				handler(event);
				this.channel.ack(msg);
			}
		});
	}

	async publish(event: Event): Promise<void> {
		this.channel.publish(
			'events',
			event.name,
			Buffer.from(JSON.stringify(event.payload)),
		);
	}
}
