import { ComputedRef, Ref } from '@vue/reactivity';
import { Action, Subscription } from './utils';
import { Mutation } from './utils';

let context: Context = null;

export class Context {
	private _subscribe = new Subscription<Mutation>();
	private _subscribeAction = new Subscription<Action>();

	public replace = false;
	public mutation = false;
	public instance = {};

	public refs = new Map<string, Ref>();
	public getters = new Map<string, ComputedRef>();
	public mutations = new Map<string, Function>();

	constructor(
		public name: string,
	) {
	}

	get state() {
		return this.instance;
	}

	replaceState(state: any) {
		this.replace = true;
		Object.entries(state)
			.forEach(([key, value]) => {
				this.refs.get(key).value = value;
			});
		this.replace = false;
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

	static clear() {
		context = null;
	}

	static init(name: string) {
        context = new Context(name);
        return context;
	}

	static get() {
		if (!context) {
			throw new Error('Store initialization outside setup');
		}
		return context;
	}
}