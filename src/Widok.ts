import { ComputedRef, Ref } from 'vue';
import { EventBus } from './EventBus';
import { Context, contexts } from './Context';
import { managementWrapper, setupWrapper } from './contructors';
import { useStoreDevtools } from './devtools';

export interface StateFactory {
	[key: string]: Ref | ComputedRef | Function;
}

export interface ManagementFactory {
	[key: string]: Function;
}

type WidokInstance<S extends StateFactory = StateFactory, M extends ManagementFactory
	= ManagementFactory> = S & M & {destroy: Function};

const config = {
	dev: true
};

const eventBus = new EventBus();

export class Widok {
	static config(options: Partial<typeof config>) {
		Object.assign(config, options);
	}

	static defineStore<T extends StateFactory, R extends ManagementFactory>(
		name: string,
		stateFactory: () => T,
		managementFactory: (state: T) => R = () => ({} as R)
	): () => WidokInstance<T, R> {
		return useStore<WidokInstance<T, R>>(name, stateFactory, managementFactory);
	}

	static emit = eventBus.emit.bind(eventBus);
	static on = eventBus.on.bind(eventBus);
	static once = eventBus.off.bind(eventBus);
}

function useStore<T>(name: string, s: Function, m: Function): () => T {
	return () => {
		let context = contexts.get(name);

		if (!context) {
			const context = Context.init(name);

			const teardown = (...cb: Function[]) => context.teardown.push(...cb);
			const destroy = () => {
				context.destroy();
			};

			const state = setupWrapper(s());
			const management = managementWrapper(m(state, teardown));
			const instance = Object.assign({}, state, management, {destroy});

			contexts.set(name, context);
			config.dev && useStoreDevtools(context);
			Context.setup(instance);

			return instance;
		}

		return context.instance;
	}
}