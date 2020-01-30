import { Context } from './Context';
import { RootStore } from './RootStore';
import { devtoolHook } from './utils';

let rootStore;

export function useStoreDevtools(context: Context) {
	if (!devtoolHook) {
		return;
	}

	if (!rootStore) {
		rootStore = new RootStore();
		devtoolHook.emit('vuex:init', rootStore.fakeRootStore);
	}

	rootStore.registerModule(context);

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
			rootStore.fakeRootStore.state
		)
	})
}