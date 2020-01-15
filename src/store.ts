import {effect, reactive, toRefs} from '@vue/reactivity';
import {useStoreDevtools} from './devtools';
import {Context} from './Context';

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