import { Controller } from '../Controller';

export class CreateControllerEvent {
	constructor(
		public controller: Controller<any>
	) {
	}
}
