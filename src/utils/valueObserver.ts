import { watch } from 'vue';
import { Controller } from '../Controller';
import { SetEvent } from '../types/SetEvent';

export function valueObserver(obj: object, controller: Controller<any>) {
	Object
		.getOwnPropertyNames(obj)
		.map(key => {
			return watch(() => obj[key], (now: any, old: any) => {
				if (!controller.mutating && !controller.replacing) {
					controller.next(new SetEvent(key, now));
				}
			}, { flush: 'sync', deep: true });
		});
}
