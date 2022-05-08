import { menudata } from "/data/menu.js";
const loadStore = () => {
    // current_page is defined in index.html
    let current_store = current_page in menudata ? menudata[current_page] : {};
    return current_store;
}

let store_items = loadStore();
export const store = {
    items: store_items
}