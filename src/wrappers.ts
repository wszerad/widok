import { Context } from './Context';
import {ComputedRef} from '@vue/reactivity';

export const metaType = Symbol('metaType');
export enum MetaTypes {
	Mutation,
	Action
}

export function action(fuu: Function);
export function action(type: string, fuu: Function);
export function action(...args) {
	const context = Context.get();
	const [type, fuu] = args.length > 1
		? args
		: [args[0].name, args[0]];

	if (!type) {
		throw new Error('');
	}

	function action(payload) {
		const ret = fuu(payload);
		context.sendAction({type, payload});
		return ret;
	}
	action[metaType] = MetaTypes.Action;

	return action;
}

export function mutation(type: string, fuu: Function) {
	const context = Context.get();

	function mutation(payload) {
		const silent = context.mutation;

		context.mutation = true;
		const ret = fuu(payload);

		if (!silent) {
			context.sendMutation({type, payload});
			context.mutation = false;
		}

		return ret;
	}
	mutation[metaType] = MetaTypes.Mutation;

	context.mutations.set(type, mutation);
	return mutation;
}

export function getter(type: string, fuu: ComputedRef) {
	Context.get().getters.set(type, fuu);
	return fuu;
}