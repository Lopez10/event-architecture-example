import { AggregateRoot } from '../aggregate-root.base';
import { Id } from '../value-object';
import { DomainEvent } from './domain-event';

export class DomainEvents {
	private static handlersMap: Record<string, ((event: DomainEvent) => void)[]> =
		{};
	private static markedAggregates: Map<string, AggregateRoot<unknown>> =
		new Map();

	public static markAggregateForDispatch<T>(aggregate: AggregateRoot<T>): void {
		if (!DomainEvents.markedAggregates.has(aggregate.id.toString())) {
			DomainEvents.markedAggregates.set(aggregate.id.toString(), aggregate);
		}
	}

	private static dispatchAggregateEvents<T>(aggregate: AggregateRoot<T>): void {
		aggregate.domainEvents.forEach((event) => DomainEvents.dispatch(event));
	}

	private static removeAggregateFromMarkedDispatchList<T>(
		aggregate: AggregateRoot<T>,
	): void {
		DomainEvents.markedAggregates.delete(aggregate.id.toString());
	}

	public static dispatchEventsForAggregate(id: Id): void {
		const aggregate = DomainEvents.markedAggregates.get(id.toString());

		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(
		callback: (event: DomainEvent) => void,
		eventClassName: string,
	): void {
		if (!DomainEvents.handlersMap[eventClassName]) {
			DomainEvents.handlersMap[eventClassName] = [];
		}
		DomainEvents.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers(): void {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates(): void {
		DomainEvents.markedAggregates.clear();
	}

	private static dispatch(event: DomainEvent): void {
		const eventClassName = event.constructor.name;
		const handlers = DomainEvents.handlersMap[eventClassName] || [];
		handlers.forEach((handler) => handler(event));
	}
}
