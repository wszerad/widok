import { effect, isRef, Ref } from '@vue/reactivity';
import { useStoreDevtools } from './devtools';
import { Context } from './Context';
import { getter, metaType, mutation } from './wrappers';

export function store<T>(name: string, setup: (name: string) => T): T {
	const context = Context.init(name);
	const instance = setupWrapper(setup(name));
	useStoreDevtools(context);
	return instance;
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
				if (isNaN(field[metaType])) {
					field = mutation(key, field);
				}
				// else ignore manual mutation and action
			} else {
				throw new Error(`Field ${key} of ${Context.get().name} store have to be one of type(Ref, ComputedRef, Function)`);
			}

			store[key] = field;
			return store;
		}, {}) as any;
}

function watchRef(key: string, ref: Ref<any>) {
	const context = Context.get();
	const runner = effect(() => ref.value, {
		computed: true,
		lazy: false,
		scheduler(c) {
			const value = runner();
			if (!context.mutation && !context.replace) {
				context.sendMutation({
					type: key,
					payload: value
				});
			}
		}
	});

	context.refs[key] = ref;
	Object.defineProperty(context.instance, key, {
		enumerable: true,
		get() {
			return ref.value;
		}
	})
}