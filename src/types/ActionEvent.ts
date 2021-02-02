import { StoreEvent } from './StoreEvent';

export class ActionEvent<T = any> extends StoreEvent<T> {
	finished = false;
	type = 'Action'

	end() {
		this.finished = true;
		return this;
	}
}
