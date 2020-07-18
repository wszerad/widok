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
						shop.available.map(i => (
							<li>{i.name} = {i.price} <span onClick={() => shop.addToCart(i)}>(+)</span></li>
						))
					}
				</ul>

				Cart:
				<ul>
					{
						shop.cart.map(i => (
							<li>{i.name} = {i.price} <span onClick={() => shop.removeFromCart(i)}>(-)</span></li>
						))
					}
				</ul>
				<div>Cost: {shop.totalPrice}</div>
				<div>{shop.totalPrice && !shop.sending ? <button onClick={() => shop.buy()}>Buy</button> : null}</div>
				<div>{shop.sending ? 'shipping' : null}</div>
			</div>
		)
	}
})

createApp(List).mount('#app')
