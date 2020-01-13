import {devtoolHook} from "./utils";
import {Context} from "./context";

export class RootStore {
    modules = new Map<string, Context>();
    fakeRootStore: FakeRootStore;

    constructor() {
        this.fakeRootStore = new FakeRootStore(this);
    }

    registerModule(cargo: Context) {
        this.modules.set(cargo.name, cargo);

        this.generateFakeState(cargo);
        this.generateFakeNamespaces(cargo);
        this.generateFakeGetters(cargo);
        this.generateFakeMutations(cargo);

        this.fakeRootStore.registerModule(cargo.name, cargo);
    }

    unregisterModule(cargo: Context) {
        this.modules.delete(cargo.name);

        this.generateFakeState(cargo, true);
        this.generateFakeNamespaces(cargo, true);
        this.generateFakeGetters(cargo, true);
        this.generateFakeMutations(cargo, true);
    }

    private generateFakeState(context: Context, remove?: boolean) {
        this.fakeRootStoreAssign({
            target: this.fakeRootStore.state,
            remove,
            key: context.name,
            def: {
                get() {
                    return context.instance;
                }
            }
        });
    }

    private generateFakeNamespaces(context: Context, remove?: boolean) {
        this.fakeRootStoreAssign({
            target: this.fakeRootStore._modulesNamespaceMap,
            remove,
            key: `${context.name}/`,
            def: {
                value: true
            }
        });
    }

    private generateFakeGetters(context: Context, remove?: boolean) {
        context.getters.forEach((getter, key: string) => {
            this.fakeRootStoreAssign({
                target: this.fakeRootStore.getters,
                remove,
                key: `${context.name}/${key}`,
                def: {
                    get() {
                        return getter.value;
                    }
                }
            });
        });
    }

    private generateFakeMutations(context: Context, remove?: boolean) {
        context.mutations.forEach((mutation, key: string) => {
            this.fakeRootStoreAssign({
                target: this.fakeRootStore._mutations,
                remove,
                key: `${context.name}/${key}`,
                def: {
                    value: mutation
                }
            });
        });
    }

    private fakeRootStoreAssign(as: {target: any, key: string, remove: boolean, def: any}) {
        if (as.remove) {
            delete as.target[as.key];
        } else {
            Object.defineProperty(as.target, as.key, {
                enumerable: true,
                ...as.def
            });
        }
    }
}

export class FakeRootStore {
    _devtoolHook = devtoolHook;
    _vm = { $options: { computed: {} } };
    _modules;
    _modulesNamespaceMap = {};
    _mutations = {};
    getters = {};
    state = {};

    constructor(
        root: RootStore
    ) {
        this._modules = {
            get(name: string) {
                return root.modules.has(name);
            }
        };
    }

    replaceState(...args: any[]) {}
    registerModule(...args: any[]) {}
    unregisterModule(...args: any[]) {}
}