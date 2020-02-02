import { ComputedRef, isRef, Ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useStoreDevtools } from './devtools';
import { Context } from './Context';
import { action, getter, metaType, MetaTypes, mutation } from './wrappers';

export interface StateFactory {
	[key: string]: Ref | ComputedRef | Function;
}

export interface ManagementFactory {
	[key: string]: Function;
}

export function store<T extends StateFactory, R extends ManagementFactory>(name: string, stateFactory: (name: string) => T, managementFactory: (state: T, name: string) => R = () => ({} as R)): T & R {
	const context = Context.init(name);
	const instance = setupWrapper(stateFactory(name));
	const management = managementWrapper(managementFactory(instance, name));
	useStoreDevtools(context);
	Context.clear();

	return Object.assign({}, instance, management);
}

function managementWrapper<T>(exp: T): T {
	return Object
		.entries(exp)
		.reduce((store, [key, field]) => {
			if (typeof field === 'function') {
				if (field[metaType] !== MetaTypes.Action) {
					field = action(field.name || key, field);
				}
				// else ignore manual actions
			} else {
				throw new Error(`Field ${key} of ${Context.get().name} store have to be Function`);
			}

			store[key] = field;
			return store;
		}, {}) as any;
}

function setupWrapper<T>(exp: T): T {
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
				if (field[metaType] !== MetaTypes.Mutation) {
					field = mutation(field.name || key, field);
				}
				// else ignore manual mutation
			} else {
				throw new Error(`Field ${key} of ${Context.get().name} store have to be one of type(Ref, ComputedRef, Function)`);
			}

			store[key] = field;
			return store;
		}, {}) as any;
}

function watchRef(key: string, ref: Ref<any>) {
	const context = Context.get();

	watch(() => ref.value, (now) => {
		if (!context.mutation && !context.replace) {
			context.sendMutation({
				type: key,
				payload: now
			});
		}
	}, {deep: true, flush: 'sync'});

	context.refs.set(key, ref);
	Object.defineProperty(context.instance, key, {
		enumerable: true,
		get() {
			return ref.value;
		}
	})
}