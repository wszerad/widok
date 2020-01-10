import {action, cargo, mutation, store} from "./store";

function test(name: string) {
    const s = cargo({
        tt: '5'
    });

    const send = action(() => {
        s.tt = '6';
    });

    const edit = mutation(() => {
        s.tt = '7';
    });

    return {
        state: s,
        send, edit
    };
}

const c = store('test', test);
c.state.tt = '4';
c.send();
c.edit();