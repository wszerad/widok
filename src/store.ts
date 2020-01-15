import { computed, ComputedGetter, ComputedRef, effect, reactive, Ref, ref, toRefs, UnwrapRef } from '@vue/reactivity';
import { getContext, setContext } from './context';
import { useStoreDevtools } from './devtools';

export function store<T>(name: string, setup: (name: string) => T) {
	const context = setContext(name);
	const instance = setup(name);
	useStoreDevtools(context);
	return instance;
}

export function cargo<T>(map: T): UnwrapRef<T> {
	const context = getContext();
	const state: Ref<T> = ref(map);

	context.instance = state;
	watcher(state);
	return state.value;
}

export function watcher(state: Ref) {
	const context = getContext();

	effect(() => state.value, {

	})
	Object
		.entries(toRefs(state))
		.forEach(([key, ref]) => {
			const runner = effect(() => ref.value, {
				computed: true,
				lazy: false,
				scheduler(c) {
					if (!context.mutation) {
						context.sendMutation({
							type: key,
							payload: runner()
						});
					}
				}
			});
		});
}

export function action<T extends Function>(map: T): T {
	const context = getContext();
	const type = map.name;

	function action(payload) {
		const ret = map(payload);
		context.sendAction({type, payload});
		return ret;
	}

	return action as any;
}

export function mutation<T extends Function>(map: T): T {
	const context = getContext();
	const type = map.name;

	function mutation(payload) {
		context.mutation = true;
		const ret = map(payload);
		context.sendMutation({type, payload});
		context.mutation = false;
		return ret;
	}

	context.mutations.set(type, mutation);
	return mutation as any;
}

export function getter<T>(map: ComputedGetter<T>): ComputedRef<T> {
	const context = getContext();
	const getter = computed(map);

	context.getters.set(map.name, getter);

	return getter;
}

