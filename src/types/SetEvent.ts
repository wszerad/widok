import { StoreEvent } from './StoreEvent';

export class SetEvent<T = any> extends StoreEvent<T> {
	type = 'Set';
}
