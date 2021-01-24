type EventHandler<E> = (event: E) => void;

export class Subscription<E> {
	private subscribers: Set<EventHandler<E>> = new Set();

	next(event: E) {
		this.subscribers.forEach((subscription) => {
			subscription(event);
		});
	}

	subscribe(cb: EventHandler<E>) {
		this.subscribers.add(cb);
		return this.unsubscribe(cb);
	}

	destroy() {
		this.subscribers.clear();
	}

	private unsubscribe(cb: EventHandler<E>) {
		return () => this.subscribers.delete(cb);
	}
}
