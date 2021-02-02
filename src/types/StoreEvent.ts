let uuid = 0;

export abstract class StoreEvent<T = any> {
	constructor(
		public name: string,
		public payload: T,
		public uid: number = uuid++
	) {}

	abstract type: string;
}
