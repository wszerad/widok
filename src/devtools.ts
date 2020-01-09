const target: any =
	typeof window !== 'undefined'
		? window
		: typeof global !== 'undefined'
			? global
			: { __VUE_DEVTOOLS_GLOBAL_HOOK__: undefined };

const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

let rootStore;

export function useStoreDevtools(store) {
	if (!devtoolHook) return;

	if (!rootStore) {
		rootStore = {
			_devtoolHook: devtoolHook,
			_vm: { $options: { computed: {} } },
			_mutations: {},
			_modulesNamespaceMap: {},
			_modules: {
				get(name: string) {
					return name in rootStore._modulesNamespaceMap
				},
			},
			state: {},
			replaceState: () => {},
			registerModule: () => {},
			unregisterModule: () => {},
		};
		devtoolHook.emit('vuex:init', rootStore)
	}

	rootStore.state[store.name] = store.state;

	// tell the devtools we added a module
	rootStore.registerModule(store.name, store);

	Object.defineProperty(rootStore.state, store.name, {
		get: () => store.state,
		set: state => (store.state = state),
	});

	rootStore._modulesNamespaceMap[store.name + '/'] = true;

	devtoolHook.on('vuex:travel-to-state', targetState => {
		store.state = targetState[store.name]
	});

	// store.subscribe((mutation, state) => {
	// 	rootStore.state[store.id] = state
	// 	devtoolHook.emit(
	// 		'vuex:mutation',
	// 		{
	// 			...mutation,
	// 			type: `[${mutation.storeName}] ${mutation.type}`,
	// 		},
	// 		rootStore.state
	// 	)
	// })
}