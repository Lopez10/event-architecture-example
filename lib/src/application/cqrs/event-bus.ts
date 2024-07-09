export interface Event {
	readonly name: string;
	readonly payload: unknown;
}

export interface EventBusPort {
	publish(event: Event): void;
	subscribe(eventName: string, handler: (event: Event) => void): void;
}

export const EventBusPortSymbol = Symbol('EventBusPort');
