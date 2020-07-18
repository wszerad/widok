import { Context, ContextSymbol } from './src/Context'
import { useStore} from './src/store'
import { configureWidok } from './src/config'
import { ComputedRef, Ref } from 'vue'

export interface StateFactory {
	[key: string]: Ref | ComputedRef | Function;
}

export interface ManagementFactory {
	[key: string]: Function;
}

export type WidokInstance<S extends StateFactory = StateFactory, M extends ManagementFactory
	= ManagementFactory> = S & M & { [ContextSymbol]: Context };

export {
	configureWidok
}

export function defineWidok<T extends StateFactory, R extends ManagementFactory>(
	name: string,
	stateFactory: () => T,
	managementFactory: (state: T) => R = () => ({} as R)
): () => WidokInstance<T, R> {
	return useStore<WidokInstance<T, R>>(name, stateFactory, managementFactory)
}

export function destroyWidok(widok: WidokInstance<any, any>) {
	if (!isWidok(widok)) {
		throw new Error('Cannot destroy Widok instance, call destroyWidok at right instance')
	}

	widok[ContextSymbol].destroy()
}

export function onDestroyWidok(teardown: () => any) {
	Context.get().teardown.push(teardown)
}

export function isWidok(ref: any) {
	return Reflect.has(ref, ContextSymbol)
}
