import { Context } from './Context'
import { RootStore } from './RootStore'
import { devtools } from 'vue'

export let rootStore: RootStore

export function useStoreDevtools(context: Context) {
	if (!devtools) {
		return
	}

	if (!rootStore) {
		rootStore = new RootStore()
		devtools.emit('vuex:init', rootStore.fakeRootStore)
	}

	rootStore.registerModule(context)

	devtools.on('vuex:travel-to-state', targetState => {
		context.replaceState(targetState[context.name])
	})

	context.subscribe((mutation, state) => {
		devtools.emit(
			'vuex:mutation',
			{
				...mutation,
				type: `[${context.name}] ${mutation.type}`,
			},
			rootStore.fakeRootStore.state
		)
	})
}
