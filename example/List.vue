<template>
		<div>
				Shop:
				<ul>
						<li v-for='item in shop.available'>
								{{item.name}} = {{item.price}}
								<span @click='shop.addToCart(item)'>
										(+)
								</span>
						</li>
				</ul>

				Cart:
				<ul>
						<li v-for='item in shop.cart'>
								{{item.name}} = {{item.price}}
								<span @click='shop.removeFromCart(item)'>
										(-)
								</span>
						</li>
				</ul>
				<div>Cost: {{shop.totalPrice}}</div>
				<div v-if='shop.totalPrice && shop.shosending'>
						<button @click='shop.buy()'>Buy</button>
				</div>
				<div v-if='shop.sending'>shipping</div>
		</div>
</template>

<script setup>
import { shop } from './shop.ts';
</script>

<style scoped>

</style>
