import { computed, ref } from '@vue/reactivity';
import { store } from '../src/store';
import Vue from 'vue';
import { action } from '../src/wrappers';

const v = new Vue({
	template: '<span>test</span>'
});

v.$mount('#app');

function test(name: string) {
	const s = ref(5);

	const act = action(function action(ss: number) {
		s.value = ss;
	});

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
		act,
		test
	};
}

const c = store('test', test);
c.act(2);
console.log(c);
c.s.value = 7;