# Widok
```
> Uses raw @vue/reactivity functions
> Supports Vuex-devtools
> Minimal overhead
> Allow directly state manipulation (without using mutation)
```

## How it works

- Use @vue/reactivity functions: ref and computed to keep state
- Define some mutation function (do not use async like in actions)
- export flat object with what you need
- after creation of store exported ref/computed/mutations will be decorated and watched for changes

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
```

## API

### createWidok - create Widok instance and return function(StoreClass, name?)

### @Action(name?) - If the method performs any async operation should be decorated with (it is only for proper devtools logging)

### @Patch(name?) - optional decorator, needed only to overwrite default name (extracted from function.name)
