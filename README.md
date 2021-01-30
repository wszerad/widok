# Widok
```
> Uses @vue/reactivity part of vue lib
> Supports vue-devtools
> Minimal overhead
> Allow directly state manipulation (without using mutation)
```

## Usage

```typescript
// Widok instance
import { createWidok } from 'widok';
export const widok = createWidok();

// main app
const app = createApp(App);
app.use(widok);

// store
class Shop {
	cart = [];

	get getCount() {
		return this.cart.length;
	};

	addToCart(addItem: Item) {
		this.cart.push(addItem);
	}

	@Action()
	async buy() {
		await fetch('cart/buy', this.cart);
		this.cart.length = 0;
	}
}

export const shop = widok(Shop);

// usage
import { shop } from './shop';

shop.addToCart({
    name: 'Laptop',
    price: 200
});
// will emit Patch event

shop.cart.length = 0;
// will also emit Patch event

```

## API

### createWidok
Creates Widok instance and return function(StoreClass, name?)

`name` argument is optional, to overwrite default name extracted from function.name (class name)

### @Patch(name?)
Decorator, needed only to overwrite default name (extracted from function.name)

### @Action(name?)
Decorator, if the method performs any async operation should be decorated with (it is only for proper devtools logging).

`name` argument is optional, to overwrite default name extracted from function.name

## Events

* ActionEvent = Action
* PatchEvent = Patch
* SetEvent = directly value change
