import Router from "./router.js";
import Dish from "./classes/dish.js";
import DishAppEvents from "./events.js";

const dishAddHandler = dish_object => {
    let event = new CustomEvent(DishAppEvents.ITEM_ADDED_TO_CART, {
        detail: {
            name: dish_object.name,
            price: dish_object.price,
            count: 1
        }
    });

    document.dispatchEvent(event);
}

class Menu {
    constructor() {
        this.menu_items = [];
        this.menu_items = Router.getCurrentRouteItems() || this.menu_items;
        this.init();
    }

    init = () => {
        /*
            Mounts the menu components on the DOM, by calling the mountMenu method., and then
            sets the event listener that will refresh the menu item when the router triggers 
            a route change event.
        */
        this.mountMenu();

        document.addEventListener(DishAppEvents.ROUTE_CHANGED, e => {
            let dishes_container = document.getElementById("dishes-container");
            dishes_container?.remove();
            this.menu_items = e.detail.items;
            
            this.mountMenu();
        });
    }

    mountMenu = () => {
        const dishes_container = document.createElement("div");
        dishes_container.id = "dishes-container";
    
        this.menu_items.forEach(item => {
            const dish_item = new Dish(item);
            dishes_container.appendChild(dish_item.toHtml(() => dishAddHandler(dish_item))); 
            // dish.toHtml takes a handler to be called when the add btn on the dish component is clicked
            // then returns the NodeElement representing the dish component
            // dishAddHandler triggers an event that will make the cart add the dish to its contents

        });
    
        document.getElementById("store-items-container").appendChild(dishes_container);
    }
}

const menu = new Menu();