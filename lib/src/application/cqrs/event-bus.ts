export interface Event {
	readonly name: string;
	readonly payload: unknown;
}

export interface EventBusPort {
	publish(event: Event): void;
}

export const EventBusPortSymbol = Symbol('EventBusPort');
