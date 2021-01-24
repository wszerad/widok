
export class ActionEvent<T = any> {
	constructor(
		public name: string,
		public payload: T,
		public type = 'Action',
	) {}
}
