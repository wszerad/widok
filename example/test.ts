import { computed, ref } from '@vue/reactivity';
import { store } from '../src/store';
import Vue from 'vue';

const v = new Vue({
	template: '<span>test</span>'
});

v.$mount('#app');

function test() {
	const s = ref(5);

	function mutation() {
		s.value = 7;
	}

	function test(v: number) {
		s.value = v;
    }

	const ss = computed(() => {
		return s.value + 'x';
	});

	return {
		s,
		ss,
		mutation,
		test
	};
}

function testWithActions(state) {
	return {
		tet() {
			state.test(6);
			setTimeout(() => {
				state.test(8);
			}, 10);
		},
		...state
    };
}

const c = store('test', test, testWithActions);
c.tet();