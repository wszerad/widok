import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { App } from 'vue';
import { Controller } from '../Controller';
import { ControllerCollector } from '../ControllerCollector';
import { CreateControllerEvent } from '../types/CreateControllerEvent';

function formatPayload(payload: any[]) {
	if (payload.length < 2) {
		return payload[0];
	}
	return payload;
}

export function addDevtools(app: App, collector: ControllerCollector) {
	setupDevtoolsPlugin(
		{
			id: 'widok',
			label: 'Widok',
			app,
		},
		(api) => {
			api.on.inspectComponent((payload, ctx) => {
				if (payload.instanceData) {
					collector.controllers.forEach(controller => {
						payload.instanceData.state.push({
							type: '🌄 Widok',
							key: controller.name,
							editable: false,
							value: controller.store,
						});
					});
				}
			});

			const layerId = 'widok:events';
			const inspectorId = 'widok';

			api.addTimelineLayer({
				id: layerId,
				label: `🌄 Widok`,
				color: 0xe5df88,
			});

			api.addInspector({
				id: inspectorId,
				label: 'Widok',
				icon: 'terrain',
				treeFilterPlaceholder: 'Search stores',
			});

			function observeController(controller: Controller<any>) {
				controller.subscribe((event) => {
					// @ts-ignore
					api.notifyComponentUpdate();
					api.sendInspectorState(inspectorId);

					const payload = formatPayload(event.payload);
					api.addTimelineEvent({
						layerId: layerId,
						event: {
							time: Date.now(),
							data: {
								store: controller.name,
								name: event.name,
								type: event.type,
								...(payload !== undefined ? { payload } : {})
							},
							// TODO: remove when fixed
							meta: {},
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
										editable: false,
										value: controller.store[key]
									};
								})
						};
					}
				}
			});

			// TODO add edit option
			// api.on.editInspectorState(payload => {
			// 	console.log(payload);
			// });

			// @ts-ignore
			api.notifyComponentUpdate();
		}
	);
}
