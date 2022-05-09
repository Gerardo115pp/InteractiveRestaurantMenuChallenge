import Store from './store.js';
import DishAppEvents from './events.js';

class Cart {
    constructor() {
        let last_cart = Store.readFromGeneric({ owner: "CART", field: "CART_ITEMS" });
        console.log("last_cart", last_cart);
        this.cart_items = last_cart || {};
        this.init();
    }

    addItem = dish_object => {
        if (!this.cart_items[dish_object.name]) {
            this.cart_items[dish_object.name] = {
                count: 0,// will be incremented by 1 after if block
                price: dish_object.price
            }   
        }
        this.cart_items[dish_object.name].count++;
        console.log(dish_object);
        Store.writeToGeneric({ owner: "CART", field: "CART_ITEMS", value: this.cart_items});
        this.updateComponent();
    }

    draw  = () => {
        const mount_point = "cart-container";
        const cart_container = document.createElement("div");
        cart_container.id = "cart-component";

        
        
        /*----------  Title  ----------*/
        const cart_title = document.createElement("h3");
        cart_title.innerText = "Order Details";
        cart_title.id = "cart-title";
        cart_container.appendChild(cart_title);

        
        /*----------  SearchBar  ----------*/
        const cart_search_bar = document.createElement("div");
        cart_search_bar.id = "cart-search-bar-container";
        cart_search_bar.innerHTML = `
            <input type="text" id="cart-search-bar" />
            <div id="cart-search-bar-btn">Add</div>
        `;
        cart_container.appendChild(cart_search_bar);

        /*----------  Cart Content  ----------*/
        const cart_content = document.createElement("div");
        cart_content.id = "cart-content";
        let cart_content_html = "";

        let price_formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        });
        let order_total_cost = 0.0
        for (let item_name of Object.keys(this.cart_items)) {
            let total_cost = this.cart_items[item_name].count * this.cart_items[item_name].price;
            cart_content_html += `
                <div class="cart-item">
                    <span class="cart-item-label">${item_name} (${this.cart_items[item_name].count || "Wierd"}) ${price_formatter.format(this.cart_items[item_name].price)}c/u</span>
                    <span class="cart-item-total">${price_formatter.format(this.cart_items[item_name].count * this.cart_items[item_name].price)}</span>
                    <span class="material-symbols-outlined cart-item-remove-btn">delete_forever</span>
                </div>
            `;
            order_total_cost += total_cost;
        }
        cart_content.innerHTML = cart_content_html;

        cart_container.appendChild(cart_content);

        /*----------  Order Total  ----------*/
        const cart_total = document.createElement("div");
        cart_total.id = "cart-total";
        cart_total.innerHTML = `
            <span>Total:</span>
            <span>${price_formatter.format(order_total_cost)}</span>
        `;

        cart_container.appendChild(cart_total);

        /*----------  Order Actions  ----------*/
        const cart_actions = document.createElement("div");
        cart_actions.id = "cart-actions-container";
        const place_order_btn = document.createElement("div");
        place_order_btn.id = "place-order-btn";
        place_order_btn.classList.add("cart-action");
        place_order_btn.innerText = "Place Order";
        cart_actions.appendChild(place_order_btn);

        const clear_cart_btn = document.createElement("div");
        clear_cart_btn.id = "clear-cart-btn";
        clear_cart_btn.classList.add("cart-action");
        clear_cart_btn.innerText = "Clear";
        clear_cart_btn.onclick = this.resetItems;
        cart_actions.appendChild(clear_cart_btn);

        cart_container.appendChild(cart_actions);

        /*----------  Append to DOM  ----------*/
        document.getElementById(mount_point).appendChild(cart_container);
    }

    init = () => {
        this.draw();
        document.addEventListener(DishAppEvents.ITEM_ADDED_TO_CART, e => this.addItem(e.detail));

    }

    resetItems = () => { 
        this.cart_items = {};
        Store.writeToGeneric({ owner: "CART", field: "CART_ITEMS", value: this.cart_items});
        this.updateComponent();
    }

    updateComponent = () => {
        const cart_container = document.getElementById("cart-component");
        cart_container?.remove();
        this.draw();
    }
}

const cart = new Cart();


export default cart;