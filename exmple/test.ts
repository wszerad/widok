import {cargo, store} from "../src/store";
import Vue from "vue";
import {action, getter, mutation} from "../src/wrapers";
import {actions, mutations} from "../src/groups";

const v = new Vue({
    template: '<span>test</span>'
});

v.$mount('#app');

function test(name: string) {
    const s = cargo({
        tt: '5'
    });

    function action(ss: string) {
        s.tt = ss;
    }

    function mutation() {
        s.tt = '7';
    }

    const ss = getter(() => {
        return s.tt + 'x';
    });

    return {
        state: s,
        ...mutations({
            mutation
        }),
        ...actions({
            action
        }),
        ss
    };
}

const c = store('test', test);
c.action('d')
console.log(c);
c.state.tt = '4';