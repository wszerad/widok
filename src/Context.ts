import { ComputedRef, Ref } from 'vue'
import { rootStore } from './devtools'
import { Action, Mutation, Subscription } from './utils'

let context: Context = null
export const ContextSymbol = Symbol.for('ContextSymbol')
export const contexts = new Map<string, Context>()

export class Context {
	private _subscribe = new Subscription<Mutation>()
	private _subscribeAction = new Subscription<Action>()

	public replacing = false
	public mutate = false

	public instance = null
	public state = {}

	public refs = new Map<string, Ref>()
	public getters = new Map<string, ComputedRef>()
	public mutations = new Map<string, Function>()
	public teardown = []

	constructor(
		public name: string,
	) {
	}

	destroy() {
		this.teardown.forEach(action => action())
		contexts.delete(this.name)

		if (rootStore) {
			rootStore.unregisterModule(this)
		}

		// stop getters??
	}

	replaceState(state: any) {
		this.replacing = true
		Object.entries(state)
			.forEach(([key, value]) => {
				this.refs.get(key).value = value
			})
		this.replacing = false
	}

	sendAction(action: Action) {
		this._subscribeAction.next(action)
	}

	subscribeAction(cb) {
		this._subscribeAction.subscribe(cb)
	}

	sendMutation(mutation: Mutation) {
		this._subscribe.next(mutation)
	}

	subscribe(cb) {
		this._subscribe.subscribe(cb)
	}

	static init(name: string) {
		context = new Context(name)
		return context
	}

	static setup(res: object) {
		context.instance = res
		context = null
	}

	static get() {
		if (!context) {
			throw new Error('Store context access outside setup')
		}
		return context
	}
}
