import { StoreEvent } from './StoreEvent';

export class PatchEvent<T = any> extends StoreEvent<T> {
	type = 'Patch';
}
