import { computed } from 'vue';
import { $Action } from '../decorators/Action';
import { Controller } from '../Controller';
import { $Patch } from '../decorators/Patch';
import { ActionEvent } from '../types/ActionEvent';
import { PatchEvent } from '../types/PatchEvent';

export function prototypeOverwrite(proto: object, target: object, controller: Controller<any>) {
	Object.getOwnPropertyNames(proto)
		.forEach((key) => {
			const descriptor = Object.getOwnPropertyDescriptor(proto, key);

			if (!descriptor || key === 'constructor') {
				return;
			} else if (descriptor.set) {
				throw new Error('Setters are not allowed');
			} else if (typeof descriptor.value === 'function') {
				const action = Reflect.getMetadata($Action, proto, key);
				if (action !== undefined) {
					Object.defineProperty(target, key, {
						value(...payload) {
							const ret = descriptor.value.call(this, ...payload);
							const event = new ActionEvent(action || key, payload)
							controller.next(event);

							if (ret instanceof Promise) {
								ret.finally(() => {
									controller.next(event.end());
								});
							}

							return ret;
						}
					});
					return;
				}

				const mutation = Reflect.getMetadata($Patch, proto, key);
				Object.defineProperty(target, key, {
					value(...payload) {
						const silent = controller.mutating;
						controller.mutating = true;
						const ret = descriptor.value.call(this, ...payload);

						if (!silent) {
							controller.next(new PatchEvent(mutation || key, payload));
							controller.mutating = false;
						}

						return ret;
					}
				});
			} else if (descriptor.get) {
				let get;
				Object.defineProperty(target, key, {
					get() {
						if (!get) {
							get = computed(() => descriptor.get.call(this));
						}
						return (get).value;
					}
				})
			}
		});

	const parentPrototype = Object.getPrototypeOf(proto);
	if (parentPrototype !== Object.prototype) {
		prototypeOverwrite(parentPrototype, target, controller);
	}
}
