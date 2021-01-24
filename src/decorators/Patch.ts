import 'reflect-metadata';

export const $Patch = Symbol.for('PATCH');

export function Patch(name: string = null) {
	return function (target: any, propertyKey: string) {
		Reflect.defineMetadata($Patch, name, target, propertyKey);
	}
}
