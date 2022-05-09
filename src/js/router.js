import Store from "./store.js";
import DishAppEvents from "./events.js";

export const routes = [
    {
        name: "breakfast",
        link_id: "eln-ns-breakfast"
    },
    {
        name: "lunch",
        link_id: "eln-ns-lunch"
    },
    {
        name: "shakes",
        link_id: "eln-ns-shakes"
    },
    {
        name: "all",
        link_id: "eln-ns-all"
    }
]

function routeClickHandler() {
    this.router.current_route = this.route_name;
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
        this.bindLinksToRoutes();
        this.updateNavbarCurrentRoute(this.current_link_id);
    }

    bindLinksToRoutes = () => {
        routes.forEach(route => {
            let link_element = document.getElementById(route.link_id);
            if (link_element) 
            {   
                let click_handler = routeClickHandler.bind({router: this, route_name: route.name, link_element_id: route.link_id});
                link_element.onclick = click_handler;
            } else {
                console.warn("Link element not found: " + route.link_id);
            }
        });
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

    saveCurrentRoute = () => {
        const transaction_data = {
            owner: "ROUTER",
            key: "LAST_ROUTE_DATA",
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
        console.log(new_current_link_element)
        console.log(`Old current link: ${this.current_link_id}\n new current link: ${new_link_element_id}`);
        
        this.current_link_id = new_link_element_id;
        this.saveCurrentRoute();
    }

}

const router = new Router();
export default router;


