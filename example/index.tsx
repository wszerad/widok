import { defineComponent, createApp, h } from 'vue';
import Vue from 'oldvue';
import { shop } from './shop';

// my JSX plugin :p
const React = {
	createElement(el, ...children) {
		let props = null;
		if (children.length && children[0] && !children[0]._isVNode) {
			props = children[0];
			children = children.slice(1);
		}
		return h(el, props, children);
	}
};

const List = defineComponent({
	render() {
		return (
			<div>
				Shop:
				<ul>
					{
						shop.available.value.map(i => (
							<li>{i.name} = {i.price} <span onClick={() => shop.addToCart(i)}>(+)</span></li>
						))
					}
				</ul>

				Cart:
				<ul>
					{
						shop.cart.value.map(i => (
							<li>{i.name} = {i.price} <span onClick={() => shop.removeFromCart(i)}>(-)</span></li>
						))
					}
				</ul>
				<div>Cost: {shop.totalPrice.value}</div>
				<div>{shop.totalPrice.value && !shop.sending.value ? <button onClick={() => shop.buy()}>Buy</button> : null}</div>
				<div>{shop.sending.value ? 'shipping' : null}</div>
			</div>
		);
	}
});

createApp(List).mount('#app');

new Vue({
	template: '<span>Hello :D</span>'
}).$mount('#fake-vue-element');