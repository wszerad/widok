import { StoreEvent } from './types/StoreEvent';
import { Subscription } from './utils/Subscription';

export class Controller<T> extends Subscription<StoreEvent> {
	mutating = false;
	replacing = false;
	store: T;

	constructor(
		public name: string
	) {
		super();
	}

	setup(store: T) {
		this.store = store;
	}
}
