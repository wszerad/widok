import {action, cargo, getter, mutation, store} from "../src/store";
import Vue from "vue";

const v = new Vue({
    template: '<span>test</span>'
});

v.$mount('#app');

function test(name: string) {
    const s = cargo({
        tt: '5'
    });

    const send = action(function action() {
        s.tt = '6';
    });

    const edit = mutation(function mutation() {
        s.tt = '7';
    });

    const ss = getter(function ss() {
        return s.tt + 'x';
    });

    return {
        state: s,
        send, edit, ss
    };
}


function test(name: string) {
    const s = cargo({
        tt: '5'
    });

    function action() {
        s.tt = '6';
    }

    function mutation() {
        s.tt = '7';
    }

    const ss = getter(() => {
        return s.tt + 'x';
    });

    return {
        state: s,
        mutations({}),
        action,
        mutation
    };
}

const c = store('test', test);
console.log(c);
c.state.tt = '4';