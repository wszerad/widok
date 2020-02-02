import { isRef } from '@vue/reactivity';
import { Context } from './Context';
import { action, getter, mutation, watchRef } from './wrappers';

export function managementWrapper<T>(exp: T): T {
	return Object
		.entries(exp)
		.reduce((store, [key, field]) => {
			if (typeof field === 'function') {
				field = action(field.name || key, field);
			} else {
				throw new Error(`Field ${key} of ${Context.get().name} store have to be Function`);
			}

			store[key] = field;
			return store;
		}, {}) as any;
}

export function setupWrapper<T>(exp: T): T {
	return Object
		.entries(exp)
		.reduce((store, [key, field]) => {
			if (isRef(field)) {
				if (Reflect.has(field, 'effect')) {
					getter(key, field as any);
				} else {
					watchRef(key, field);
				}
			} else if (typeof field === 'function') {
				field = mutation(field.name || key, field);
			} else {
				throw new Error(`Field ${key} of ${Context.get().name} store have to be one of type(Ref, ComputedRef, Function)`);
			}

			store[key] = field;
			return store;
		}, {}) as any;
}
