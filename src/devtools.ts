import {Context} from "./context";

const target: any =
	typeof window !== 'undefined'
		? window
		: typeof global !== 'undefined'
			? global
			: { __VUE_DEVTOOLS_GLOBAL_HOOK__: undefined };

const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

let rootStore;

export function useStoreDevtools(context: Context) {
	if (!devtoolHook) return;

	if (!rootStore) {
		rootStore = {
			_devtoolHook: devtoolHook,
			_vm: { $options: { computed: {} } },
			_mutations: {},
			_modulesNamespaceMap: {},
			_modules: {
				get(name: string) {
					return name in rootStore._modulesNamespaceMap;
				},
			},
			state: {},
			replaceState: () => {},
			registerModule: () => {},
			unregisterModule: () => {},
		};
		devtoolHook.emit('vuex:init', rootStore)
	}

	rootStore.state[context.name] = context.instance;

	// tell the devtools we added a module
	rootStore.registerModule(context.name, context);

	Object.defineProperty(rootStore.state, context.name, {
		get() {
			return context.instance.state;
		},
		set(state) {
			context.replaceState(state);
        }
	});

	rootStore._modulesNamespaceMap[context.name + '/'] = true;

	devtoolHook.on('vuex:travel-to-state', targetState => {
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