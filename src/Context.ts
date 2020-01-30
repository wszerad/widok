import { ComputedRef, Ref } from '@vue/reactivity';
import { Action, Subscription } from './utils';
import { Mutation } from './utils';

let context: Context = null;

export class Context {
	private _subscribe = new Subscription<Mutation>();
	private _subscribeAction = new Subscription<Action>();

	public mutation = false;
	public instance: Ref = null;
	public getters = new Map<string, ComputedRef>();
	public mutations = new Map<string, Function>();

	constructor(
		public name: string,
	) {
	}

	get state() {
		return this.instance.value;
	}

	replaceState(state: any) {
		// TODO check state traveling (unconverting ref)
		console.log(state);
	}

	sendAction(action: Action) {
		this._subscribeAction.next(action);
	}

	subscribeAction(cb) {
		this._subscribeAction.subscribe(cb);
	}

	sendMutation(mutation: Mutation) {
		this._subscribe.next(mutation);
	}

	subscribe(cb) {
		this._subscribe.subscribe(cb);
	}

	static init(name: string) {
        context = new Context(name);
        return context;
	}

	static get() {
		return context;
	}
}