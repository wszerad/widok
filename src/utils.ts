const target: any =
    typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {__VUE_DEVTOOLS_GLOBAL_HOOK__: undefined};

export const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

export class Subscription<P, T = (payload: P, state?: any) => any> {
    private subscribers: Set<T> = new Set();

    next(payload: P, state?: any): void {
        this.subscribers.forEach((subscription: any) => {
            subscription(payload, state);
        });
    }

    subscribe(cb: T) {
        this.subscribers.add(cb);
        return this.unsubscribe(cb);
    }

    private unsubscribe(cb: T) {
        return () => this.subscribers.delete(cb);
    }
}

export interface Mutation<P = any> {
    type: string;
    payload: P;
}

export interface Action<P = any> {
    type: string;
    payload: P;
}

export function assignProperty(as: {target: any, key: string, remove: boolean, def: any}) {
	if (as.remove) {
		delete as.target[as.key];
	} else {
		Object.defineProperty(as.target, as.key, {
			enumerable: true,
			...as.def
		});
	}
}