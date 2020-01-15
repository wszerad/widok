import {action, getter, mutation} from "./wrapers";

export interface FunctionMap {
    [key: string]: Function
}

export function functionsDecorator<T extends FunctionMap>(object: T, decorator: Function): T {
    return Object.entries(object)
        .reduce((map, [key, fuu]) => {
            map[key] = decorator(fuu);
            return map;
        }, {}) as any;
}

export function actions<T extends FunctionMap>(actions: T): T {
    return functionsDecorator(actions, action);
}

export function mutations<T extends FunctionMap>(mutations: T): T {
    return functionsDecorator(mutations, mutation);
}

export function getters<T extends FunctionMap>(getters: T): T {
    return functionsDecorator(getters, getter);
}