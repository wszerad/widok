import { ComputedRef, Ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { Context } from './Context';

export function action(fuu: Function);
export function action(type: string, fuu: Function);
export function action(...args) {
	const context = Context.get();
	const [type, fuu] = args.length > 1
		? args
		: [args[0].name, args[0]];

	function action(payload) {
		const ret = fuu(payload);
		context.sendAction({type, payload});
		return ret;
	}

	return action;
}

export function mutation(type: string, fuu: Function) {
	const context = Context.get();

	function mutation(payload) {
		const silent = context.mutate;

		context.mutate = true;
		const ret = fuu(payload);

		if (!silent) {
			context.sendMutation({type, payload});
			context.mutate = false;
		}

		return ret;
	}

	context.mutations.set(type, mutation);
	return mutation;
}

export function getter(type: string, fuu: ComputedRef) {
	Context.get().getters.set(type, fuu);
	return fuu;
}

export function watchRef(key: string, ref: Ref) {
	const context = Context.get();

	context.refs.set(key, ref);
	Object.defineProperty(context.state, key, {
		enumerable: true,
		get() {
			return ref.value;
		}
	});

	const teardown = watch(() => ref.value, (now) => {
		if (!context.mutate && !context.replacing) {
			context.sendMutation({
				type: key,
				payload: now
			});
		}
	}, {deep: true, flush: 'sync'});
	context.teardown.push(teardown);

	return  ref;
}