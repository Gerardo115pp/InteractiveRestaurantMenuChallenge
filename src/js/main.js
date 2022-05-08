import { store } from "/js/store.js";
import Dish from "/js/classes/dish.js";
console.log(store.items);
const greet = () => {
    alert("Hello, world!");
  }
const createAndMountDishes = () => {
    const dishes_container = document.createElement("div");
    dishes_container.id = "dishes-container";

    store.items.forEach(item => {
        const dish_item = new Dish(item);
        dishes_container.appendChild(dish_item.toHtml(() => alert("Added!")));
    });

    document.getElementById("store-items-container").appendChild(dishes_container);
}

if (store.items.length > 0) {
    createAndMountDishes();
}


