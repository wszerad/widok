
export class PatchEvent<T = any> {
	constructor(
		public name: string,
		public payload: T,
		public type = 'Patch',
	) {}
}
