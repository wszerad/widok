import { Action } from '../src/decorators/Action';
import { widok } from './store';

interface Item {
	name: string;
	price: number;
}

class Shop {
	available = [
		{
			name: 'car',
			price: 23000
		},
		{
			name: 'house',
			price: 200000
		},
		{
			name: 'bike',
			price: 300
		}
	];
	cart = [];
	sending = false;

	get totalPrice() {
		return this.cart.reduce((total, item) => {
			total += item.price;
			return total;
		}, 0);
	};

	addToCart(addItem: Item) {
		this.available = this.available.filter(item => item.name !== addItem.name);
		this.cart.push(addItem);
	}

	removeFromCart(removeItem: Item) {
		this.available.push(removeItem);
		this.cart = this.cart.filter(item => item.name !== removeItem.name);
	}

	clearCart() {
		this.cart = [];
	}

	@Action()
	async buy() {
		this.sending = true;
		this.clearCart();

		return new Promise((res, rej) => {
			window.setTimeout(() => {
				this.sending = false;
				res(true);
			}, 3000);
		})
	}
}

export const shop = widok(Shop);
