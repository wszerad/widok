import { destroyWidok } from '../index'
import { defineComponent, createApp, onUnmounted } from 'vue'
import { useShop } from './shop'

const List = defineComponent({
	setup() {
		const shop = useShop()
		onUnmounted(() => destroyWidok(shop))
		return {shop}
	},
	render(ctx) {
		const shop = ctx.shop

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
		)
	}
})

createApp(List).mount('#app')
