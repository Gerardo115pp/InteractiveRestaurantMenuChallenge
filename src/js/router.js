import Store from "./store.js";
import DishAppEvents from "./events.js";

export const routes = [];

routes.push({ name: "all", link_id: "eln-ns-all" });

Object.keys(Store.items).forEach(item_name => {
    let route_data = {
        name: item_name,
        link_id: `eln-ns-${item_name}`,
    }
    routes.push(route_data);
})

function routeClickHandler() {
    this.router.current_route = this.route_name;
    console.log(`Routing to ${this.route_name}`);
    this.router.updateNavbarCurrentRoute(this.link_element_id);
    let event = new CustomEvent(DishAppEvents.ROUTE_CHANGED, {
        detail: this.route_name,
        items: this.router.getCurrentRouteItems()
    });
    document.dispatchEvent(event);
}

class Router {

    constructor() {
        let last_route = Store.readFromGeneric({ owner: "ROUTER", field: "LAST_ROUTE_DATA" });
        this.current_route = last_route?.name || routes[0].name;
        this.current_link_id = last_route?.link_id || routes[0].link_id;
        this.init();
        this.updateNavbarCurrentRoute(this.current_link_id);
    }

    getCurrentRouteItems = () => {
        let route_items = []
        if (this.current_route === "all") {
            for (let key of Object.keys(Store.items)) {
                route_items.push(...Store.items[key]);
            }
        } else {
            route_items = Store.items[this.current_route];
        }
        return route_items;
    }

    init = () => {
        this.mountRoutes();
    }

    mountRoutes = () => {
        const mount_point = document.getElementById("eln-nav-sections");
        const routes_links = document.createDocumentFragment();
        routes.forEach(route => {
            let link_element = document.createElement("div");
            link_element.id = route.link_id;
            link_element.classList.add("eln-ns-section");
            link_element.innerHTML = `<h5>${route.name}</h5>`;
            link_element.onclick = routeClickHandler.bind({router: this, route_name: route.name, link_element_id: route.link_id});
            routes_links.appendChild(link_element);

        });
        mount_point.appendChild(routes_links);
    }

    saveCurrentRoute = () => {
        const transaction_data = {
            owner: "ROUTER",
            field: "LAST_ROUTE_DATA",
            value: {
                name: this.current_route,
                link_id: this.current_link_id
            }
        }

        Store.writeToGeneric(transaction_data);
    }

    updateNavbarCurrentRoute = (new_link_element_id) => {
        let old_current_link_element = document.getElementById(this.current_link_id);
        let new_current_link_element = document.getElementById(new_link_element_id);
        old_current_link_element?.classList.remove("current");
        new_current_link_element?.classList.add("current");

        this.current_link_id = new_link_element_id;
        this.saveCurrentRoute();
    }

}

const router = new Router();
export default router;


