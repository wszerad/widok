import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import Vue from 'vue';
import { action, cargo, mutation, store } from './store';

function test(name: string) {
	const state = cargo({
		t: 3
	});

	const send = action(function action() {
		state.t = 5;
	});

	const edit = mutation(function edit() {
		state.t = state.t + 1;
	});

	return {
		state,
		send, edit
	};
}

new Vue({
	el: '#app',
	template: '<div></div>'
});

const c = store('test', test);
console.log(c);


// const k = ref({tt: 6});
// watch(k, (x, y) => console.log(x),
// 	{
// 		deep: true,
// 		flush: 'sync',
// 	});
// k.value.tt = 7;
