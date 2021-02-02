import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { App } from 'vue';
import { Controller } from '../Controller';
import { ControllerCollector } from '../ControllerCollector';
import { ActionEvent } from '../types/ActionEvent';
import { CreateControllerEvent } from '../types/CreateControllerEvent';
import { PatchEvent } from '../types/PatchEvent';
import { SetEvent } from '../types/SetEvent';
import { StoreEvent } from '../types/StoreEvent';

function formatPayload(payload: any[]) {
	if (payload.length < 2) {
		return payload[0];
	}
	return payload;
}

const stateType = '🌄 Widok';

export function addDevtools(app: App, collector: ControllerCollector) {
	setupDevtoolsPlugin(
		{
			id: 'widok',
			label: 'Widok',
			packageName: 'widok',
			homepage: 'https://github.com/wszerad/widok',
			componentStateTypes: [
				stateType
			],
			app,
		},
		(api) => {
			// api.on.inspectComponent((payload, ctx) => {
			// 	if (payload.instanceData) {
			// 		collector.controllers.forEach(controller => {
			// 			payload.instanceData.state.push({
			// 				type: stateType,
			// 				key: controller.name,
			// 				editable: true,
			// 				value: controller.store,
			// 			});
			// 		});
			// 	}
			// });

			const layerId = 'widok:events';
			const inspectorId = 'widok';

			api.addTimelineLayer({
				id: layerId,
				label: stateType,
				color: 0xe5df88,
			});

			api.addInspector({
				id: inspectorId,
				label: stateType,
				icon: 'terrain',
				treeFilterPlaceholder: 'Search stores',
			});

			function observeController(controller: Controller<any>) {
				controller.subscribe((event) => {
					// @ts-ignore
					api.notifyComponentUpdate();
					api.sendInspectorState(inspectorId);

					const payload = formatPayload(event.payload);
					const finishedAction = event instanceof ActionEvent && event.finished;

					api.addTimelineEvent({
						layerId: layerId,
						event: {
							groupId: event.uid,
							time: Date.now(),
							title: withEventTitlePrefix(event),
							data: {
								store: controller.name,
								type: event.type,
								name: event.name,
								...(!finishedAction && payload !== undefined ? { payload } : {})
							}
						},
					});
				});
			}

			collector.controllers.forEach(observeController);
			collector.subscribe(event => {
				if (!(event instanceof CreateControllerEvent)) return;
				observeController(event.controller);
			});

			api.on.getInspectorTree((payload) => {
				if (payload.app === app && payload.inspectorId === inspectorId) {
					payload.rootNodes = Array
						.from(collector.controllers.keys())
						.filter(key => {
							return !payload.filter
								|| key.toLocaleLowerCase().includes(payload.filter.toLocaleLowerCase());
						})
						.map(key => {
							const controller = collector.controllers.get(key);
							return {
								id: controller.name,
								label: controller.name,
								tags: [],
							};
						});
				}
			})

			api.on.getInspectorState((payload) => {
				if (payload.app === app && payload.inspectorId === inspectorId) {
					const controller = collector.controllers.get(payload.nodeId);

					if (controller) {
						payload.state = {
							[controller.name]: Object
								.getOwnPropertyNames(controller.store)
								.map(key => {
									return {
										key,
										editable: true,
										value: controller.store[key]
									};
								})
						};
					}
				}
			});

			api.on.editInspectorState(payload => {
				if (payload.app === app && payload.inspectorId === inspectorId) {
					const controller = collector.controllers.get(payload.nodeId);

					if (controller) {
						payload.set(controller.store, payload.path, payload.state.value);
					}
				}
			});

			// @ts-ignore
			api.notifyComponentUpdate();
		}
	);
}

function withEventTitlePrefix(event: StoreEvent) {
	if (event instanceof ActionEvent) {
		return `${event.finished ? '🟧' : '🟠'} ${event.name}`;
	}
	if (event instanceof PatchEvent) {
		return `🟢 ${event.name}`;
	}
	if (event instanceof SetEvent) {
		return `🟡 ${event.name}`;
	}
}
