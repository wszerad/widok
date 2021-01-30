
export class SetEvent<T = any> {
	constructor(
		public name: string,
		public payload: T,
		public type = 'Set',
	) {}
}
