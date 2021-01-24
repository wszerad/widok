import { Controller } from '../Controller';

export class ReplaceControllerEvent {
	constructor(
		public controller: Controller<any>
	) {
	}
}
