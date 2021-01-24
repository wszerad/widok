import { Controller } from '../Controller';

export class DestroyControllerEvent {
	constructor(
		public controller: Controller<any>
	) {
	}
}
