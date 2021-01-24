import { ActionEvent } from './types/ActionEvent';
import { PatchEvent } from './types/PatchEvent';
import { Subscription } from './utils/Subscription';

export class Controller<T> extends Subscription<ActionEvent | PatchEvent> {
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

	replaceState(state: T) {
		this.replacing = true;
		Object.assign(this.store, state);
		this.replacing = false;
	}
}
