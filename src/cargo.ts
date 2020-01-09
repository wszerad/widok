import { computed, ComputedGetter, ComputedRef, effect, reactive, toRefs } from '@vue/reactivity';
import { getContext, setContext } from './context';

function cargo<T>(name: string, setup: (name: string) => T) {
	setContext(name);
	return setup(name);
}

function state<T>(map: T): T {
	const state = reactive(map as any);
	watcher(state);
	return state;
}

function watcher(state) {
	const context = getContext();

	Object
		.entries(toRefs(state))
		.forEach(([key, ref]) => {
			const runner = effect(() => ref.value, {
				computed: true,
				lazy: false,
				scheduler(c) {
					if (!context.mutation) {
						console.log(runner());
					}
				}
			});
		});
}

function action<T extends Function>(map: T): T {
	const context = getContext();

	return ((...args) => {
		const ret = map(...args);
		console.log('action', map.name);
		return ret;
	}) as any;
}

function mutation<T extends Function>(map: T): T {
	const context = getContext();

	return ((...args) => {
		context.mutation = true;
		const ret = map(...args);
		// emit commit
		console.log('mutation', map.name);
		context.mutation = false;
		return ret;
	}) as any;
}

function getter<T extends Function>(map: ComputedGetter<T>): ComputedRef<T> {
	const context = getContext();

	return computed(map);
}

function store(name: string) {
	const s = state({
		tt: '5'
	});

	const send = action(() => {
		s.tt = '6';
	});

	const edit = mutation(() => {
		s.tt = '7';
	});

	return {
		state: s,
		send, edit
	};
}

const c = cargo('kk', store);
c.state.tt = '4';
c.send();
c.edit();