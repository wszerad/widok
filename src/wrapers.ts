import {computed, ComputedGetter, ComputedRef} from "@vue/reactivity";
import {Context} from "./Context";

interface Handler<T = Function> {
    (name: string, fuu: T): T;

    (fuu: T): T;
}

interface Getter<T = any> {
    (name: string, fuu: ComputedGetter<T>): ComputedRef<T>;

    (fuu: ComputedGetter<T>): ComputedRef<T>;
}

export function addContext(...args) {
    const [type, fuu] = args.length > 1
        ? args
        : [args[0].name, args[0]];

    if (!type) {
        throw new Error('');
    }

    const context = Context.get();

    return {type, fuu, context};
}

export const action: Handler = (...args) => {
    const {type, fuu, context} = addContext(...args);

    function action(payload) {
        const ret = fuu(payload);
        context.sendAction({type, payload});
        return ret;
    }

    return action;
};
export const mutation: Handler = (...args) => {
    const {type, fuu, context} = addContext(...args);

    function mutation(payload) {
        context.mutation = true;
        const ret = fuu(payload);
        context.sendMutation({type, payload});
        context.mutation = false;
        return ret;
    }

    context.mutations.set(type, mutation);
    return mutation;
};
export const getter: Getter = (...args) => {
    const {type, fuu, context} = addContext(...args);
    const getter = computed(fuu);

    context.getters.set(type, getter);

    return getter;
};