import { App } from '@vue/devtools-api';
import { reactive } from 'vue';
import { Controller } from './src/Controller';
import { ControllerCollector } from './src/ControllerCollector';
import { CreateControllerEvent } from './src/types/CreateControllerEvent';
import { ReplaceControllerEvent } from './src/types/ReplaceControllerEvent';
import { addDevtools } from './src/utils/devtools';
import { prototypeOverwrite } from './src/utils/prototypeOverwrite';
import { valueObserver } from './src/utils/valueObserver';
export { Action } from './src/decorators/Action';
export { Patch } from './src/decorators/Patch';

export function createWidok() {
	const collector = new ControllerCollector();
	let initialized = false;
	let appInstance: App = null;

	function setupDevtools() {
		if (appInstance && !initialized) {
			addDevtools(appInstance, collector);
			initialized = true;
		}
	}

	function defineStore<T extends object>(StateFactory: { new (): T }, name?: string): T {
		name = name || StateFactory.name;

		const existingController = collector.controllers.get(name);
		const proto = StateFactory.prototype;
		// @ts-ignore
		const isHotReplacement = (import.meta?.hot || typeof(module) !== 'undefined' && module?.hot) && existingController;
		const controller = isHotReplacement
			? existingController
			: new Controller<T>(name);

		let instance: T;

		class State extends (StateFactory as any) {
			constructor() {
				super();
				instance = reactive(this) as T;
				valueObserver(instance, controller);
				controller.setup(instance);
				collector.next(
					isHotReplacement
						? new ReplaceControllerEvent(controller)
						: new CreateControllerEvent(controller)
				);
			}
		}

		prototypeOverwrite(proto, State.prototype, controller);

		new State();
		setupDevtools();

		return instance;
	}


	defineStore.install = (app: App) => {
		appInstance = app;
		setupDevtools();
	}
	return defineStore;
}

