import { Controller } from './Controller';
import { CreateControllerEvent } from './types/CreateControllerEvent';
import { DestroyControllerEvent } from './types/DestroyControllerEvent';
import { Subscription } from './utils/Subscription';

export class ControllerCollector extends Subscription<CreateControllerEvent | DestroyControllerEvent> {
	controllers = new Map<string, Controller<any>>();

	constructor() {
		super();
		this.subscribe(event => {
			if (event instanceof CreateControllerEvent) {
				const name = event.controller.name;
				if (this.controllers.has(name)) {
					throw new Error(`Widok with name ${name} already exist`);
				}

				return this.controllers.set(name, event.controller);
			}
			if (event instanceof DestroyControllerEvent) {
				return this.controllers.delete(event.controller.name);
			}
		})
	}
}
