# Widok
```
> Uses raw @vue/reactivity functions
> Supports Vuex-devtools
> Minimal overhead
> Allow directly state manipulation (without using mutation)
> Simple extending
```

## How it works

- Use @vue/reactivity functions: ref and computed to keep state
- Define some mutation function (do not use async like in actions)
- export flat object with what you need
- after creation of store exported ref/computed/mutations will be decorated and watched for changes

## Usage

```typescript
function cart() {
    const list = ref<{id: string, name: string, price: number}[]>([]);
    
    function addProduct(product) {
        list.value.push(product);
    }
    
    function removeProduct(product) {
        const index = list.value.findIndex(item => item.id === product.id);
        list.value.splice(index, 1);
    }
    
    function clear() {
        list.value = [];
    }
    
    const totalPrice = computed(() => {
        return list.value.reduce((total, item) => item.price, 0);
    });
    
    return { list, addProduct, removeProduct, clear, totalPrice };
}

function cartActions(cart: ReturnType<typeof cart>, teardown: (...cb: Function[]) => any) {
    const cancel = watch(cart.list, () => console.log('list change'), {deep: true});
    
    teardown(cancel, () => console.log('say bye!'));

    return {
        async order() {
            await post('order', cart.list);
            cart.clear();
        }
    };
}

const useCart = Widok.defineStore('cart', cart, cartActions);
//useCart.destroy() to run teardown logic and delete instance
```

## API

### Widok.defineStore - create store and destroy hooks
```typescript
Widok.defineStore(
    name: string,
    stateFactory: () => T,
    managementFactory: (state: T, teardown: (...cb: Function[]) => void) => R
): () => T & R & {destroy: Function}
```

* stateFactory - exports ref, computed
* managementFactory - exports actions, define some logic with watch etc.
* destroy - run teardown logic and delete instance

### Widok.config({ dev: boolean = true }) - configuration

### Widok.emit(event: InjectionKet<any>) - emit to global event bus

### Widok.on<T>(event: InjectionKet<T>, listener: (p: T) => void) - listen to events

### Widok.once<T>(event: InjectionKet<T>, listener: (p: T) => void) - listen to events (once)

### Widok.off(event?: InjectionKet<T>, listener?: (p: T) => void) - remove listeners all .off(), channel .off(event) or listener .off(event, listener)

## Other info

### ref
> exported ref will be watched for changes

* it is possible to mutating value outside __stateFactory__ and emit `[${store name}] ${ref fieldKey}`

### mutations
> mutations are created from function exported by __stateFactory__.
> Commit __type__ is a function.name or fieldKey of export

* commit name - `[${store name}] ${type}`
* if you use mutation inside other mutation it will be one commit

### actions
> actions are created from function exported by __managementFactory__.
> Dispatch __type__ is a function.name or fieldKey of export

* dispatch name - `[${store name}] ${type}`
* can not be created inside stateFactory because mutations are not decorated yet

## Limitations

* __reactive__ is not supported
* Vue@2.6 have to be mounted to enable vue-devtools
* __New Vuex backend__ option do not work correctly