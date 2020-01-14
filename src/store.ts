import {computed, ComputedGetter, ComputedRef, effect, reactive, toRefs} from '@vue/reactivity';
import {useStoreDevtools} from './devtools';
import {Context} from './Context';
import {functionDeclaration} from "@babel/types";
import {FunctionMap, functionsDecorator} from "./utils";

export function store<T>(name: string, setup: (name: string) => T) {
    const context = Context.init(name);
    const instance = setup(name);
    useStoreDevtools(context);
    return instance;
}

export function cargo<T>(map: T): T {
    const context = Context.get();
    const state = reactive(map as any);

    context.instance = state;
    watcher(state);
    return state;
}

export function watcher(state) {
    const context = Context.get();

    Object
        .entries(toRefs(state))
        .forEach(([key, ref]) => {
            const runner = effect(() => ref.value, {
                computed: true,
                lazy: false,
                scheduler(c) {
                    if (!context.mutation) {
                        context.sendMutation({
                            type: key,
                            payload: runner()
                        });
                    }
                }
            });
        });
}

export function actions<T extends FunctionMap>(actions: T): T {
    return functionsDecorator(actions, action);
}

export function addContext<T extends Function>(name: string, fuu: T): T;
export function addContext<T extends Function>(fuu: T, k: any): T;
export function addContext(name, fuu) {
    name = fuu ? name : name.name;
    fuu = fuu || name;

    if (!name) {
        throw new Error('');
    }

    const context = Context.get();

    return () => {};
}

export function action<T extends Function>(map: T, name?: string): T {
    const context = Context.get();
    const type = name || map.name;

    function action(payload) {
        const ret = map(payload);
        context.sendAction({type, payload});
        return ret;
    }

    return action as any;
}

export function mutation<T extends Function>(map: T, name?: string): T {
    const context = Context.get();
    const type = name || map.name;

    function mutation(payload) {
        context.mutation = true;
        const ret = map(payload);
        context.sendMutation({type, payload});
        context.mutation = false;
        return ret;
    }

    context.mutations.set(type, mutation);
    return mutation as any;
}

export function getter<T>(map: ComputedGetter<T>, name?: string): ComputedRef<T> {
    const context = Context.get();
    const type = name || map.name;
    const getter = computed(map);

    context.getters.set(map.name, getter);

    return getter;
}

