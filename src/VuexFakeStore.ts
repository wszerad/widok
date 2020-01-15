import {devtoolHook} from "./utils";
import {RootStore} from "./RootStore";

export class VuexFakeStore {
    _devtoolHook = devtoolHook;
    _vm = {$options: {computed: {}}};
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

    replaceState(...args: any[]) {
    }

    registerModule(...args: any[]) {
    }

    unregisterModule(...args: any[]) {
    }
}