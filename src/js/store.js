import { menudata } from "../data/menu.js";
class Store {
    constructor() {
        this.state = {
            items: menudata,
            generic: {},
            cart: {}
        };

        this.loadStateFromLocalStorage();
    }

    get items() {
        return this.state.items;
    }



    loadStateFromLocalStorage = () => {
        let items = localStorage.getItem("items");
        if (items) {
            this.state.items = JSON.parse(items);
        }

        let generic = localStorage.getItem("generic");
        
        if (generic) {
            this.state.generic = JSON.parse(generic);
        }
    }

    readFromGeneric = transaction_data => {
        // transaction_data = { owner: "STORE TO READ FROM", key: "VARIABLE TO READ"  }
        const { owner, field } = transaction_data;
        let value = undefined; // default value
        if (this.state.generic[owner]) { 
            value = this.state.generic[owner][field];
        }
        return value;
    }

    saveStateToLocalStorage = () => {
        localStorage.setItem("items", JSON.stringify(this.state.items));
        localStorage.setItem("generic", JSON.stringify(this.state.generic));
    }

    writeToGeneric = transaction_data => {
        /*
            transaction_data should be an object with the following structure:
            {
                owner: "owner", // store to write to
                field: "field", 
                value: "value"  
            }
        */
        const { owner, field, value } = transaction_data;
        this.state.generic[owner] = owner in this.state.generic ? this.state.generic[owner] : {};
        this.state.generic[owner][field] = value;

        this.saveStateToLocalStorage();
    }
}

const store = new Store();

export default store;