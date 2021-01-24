import 'reflect-metadata';

export const $Action = Symbol.for('ACTION');

export function Action(name: string = null) {
	return function (target: any, propertyKey: string) {
		Reflect.defineMetadata($Action, name, target, propertyKey);
	}
}
