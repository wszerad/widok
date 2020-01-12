import {computed, ComputedGetter, ComputedRef, effect, reactive, toRefs} from '@vue/reactivity';
import {getContext, setContext} from './context';
import {useStoreDevtools} from "./devtools";

export function store<T>(name: string, setup: (name: string) => T) {
    const context = setContext(name);
    const instance = setup(name);
    useStoreDevtools(context);
    return instance;
}

export function cargo<T>(map: T): T {
    const context = getContext();
    const state = reactive(map as any);

    context.instance = state;
    watcher(state);
    return state;
}

export function watcher(state) {
    const context = getContext();

    Object
        .entries(toRefs(state))
        .forEach(([type, ref]) => {
            const runner = effect(() => ref.value, {
                computed: true,
                lazy: false,
                scheduler(c) {
                    if (!context.mutation) {
                    	context.sendMutation({type, payload: runner()});
                    }
                }
            });
        });
}

export function action<T extends Function>(map: T): T {
    const context = getContext();
    const type = map.name;

    return ((payload) => {
        const ret = map(payload);
        context.sendAction({type, payload});
        return ret;
    }) as any;
}

// get function name from setup by pairing function => var
export function mutation<T extends Function>(map: T): T {
    const context = getContext();
    const type = map.name;

    return ((payload) => {
        context.mutation = true;
        const ret = map(payload);
        context.sendMutation({type, payload});
        context.mutation = false;
        return ret;
    }) as any;
}

export function getter<T extends Function>(map: ComputedGetter<T>): ComputedRef<T> {
    const context = getContext();
    context.getters[map.name] = computed(map);
    return context.getters[map.name]
}

