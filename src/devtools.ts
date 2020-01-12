import {Context} from "./context";

const target: any =
	typeof window !== 'undefined'
		? window
		: typeof global !== 'undefined'
			? global
			: { __VUE_DEVTOOLS_GLOBAL_HOOK__: undefined };

const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

let rootStore;

class RootStore {
	_devtoolHook = devtoolHook;
	_vm = { $options: { computed: {} } };
	_mutations = {};
	_modules = {
		get(name: string) {
			console.log('get module', name);
			return name.slice(0, -1) in this.modules;
		}
	};
	state;
	modules = {};

	constructor() {
		const self = this;
		this.state = new Proxy({}, {
			get(target, p) {
				if (p in this.modules) {
					return self.modules[p];
				}
				return target[p];
			}
		});
	}

	replaceState() {}
	registerModule(...args: any[]) {}
	unregisterModule() {}
}

export function useStoreDevtools(context: Context) {
	if (!devtoolHook) return;

	if (!rootStore) {
		rootStore = new RootStore();
		devtoolHook.emit('vuex:init', rootStore);
	}

	rootStore.modules[context.name] = context;
	rootStore.registerModule(context.name, context);

	devtoolHook.on('vuex:travel-to-state', targetState => {
		console.log('replace state', targetState);
        context.replaceState(targetState[context.name]);
	});

    context.subscribe((mutation, state) => {
		devtoolHook.emit(
			'vuex:mutation',
			{
				...mutation,
				type: `[${context.name}] ${mutation.type}`,
			},
			rootStore.state
		)
	})
}