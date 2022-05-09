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


const createAndMountDishes = () => {
    
    const dishes_container = document.createElement("div");
    const dishes_list = Router.getCurrentRouteItems();
    dishes_container.id = "dishes-container";

    dishes_list.forEach(item => {
        const dish_item = new Dish(item);
        dishes_container.appendChild(dish_item.toHtml(() => dishAddHandler(dish_item)));
    });

    document.getElementById("store-items-container").appendChild(dishes_container);
}

if (Router.getCurrentRouteItems().length > 0) {
    createAndMountDishes();
}

document.addEventListener(DishAppEvents.ROUTE_CHANGED, e => {
    let dishes_container = document.getElementById("dishes-container");
    dishes_container?.remove();
    createAndMountDishes();
});
