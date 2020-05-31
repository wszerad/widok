import { defineComponent, createApp, onUnmounted } from 'vue';
import Vue from 'oldvue';
import { useShop, unregisterShop } from './shop';

const List = defineComponent({
	setup() {
		onUnmounted(() => unregisterShop());
	},
	render() {
		const shop = useShop();

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