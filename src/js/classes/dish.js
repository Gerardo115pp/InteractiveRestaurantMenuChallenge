class Dish {
    static id = 0;

    constructor(dish_object) {
        this.id = Dish.id+1;
        this.name = dish_object.title;
        this.price = parseFloat(dish_object.price);
        this.description = dish_object.description;
        this.image = `${dish_object.image}.jpg`;
        Dish.id = this.id;
    }

    get ID() {
        return this.id;
    }

    toHtml = (add_handler) => {  
        let dish_container = document.createElement("div");
        // MXN formatter
        let price_formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        });
        dish_container.id = `dish-${this.ID}`;
        dish_container.classList.add("dish-item");
        dish_container.innerHTML = `
            <div class="dish-info-right-content">
                <img src="/assets/${this.image}" alt="${this.name}">
            </div>
            <div class="dish-info-left-content">
                <div class="di-left-upper-content">
                    <h3>${this.name}</h3>
                    <p>${price_formatter.format(this.price)}</p>    
                </div>
                <div class="di-left-lower-content">
                    <p>${this.description}</p>
                </div>
                <div class="di-actions-container">
                    <div class="di-actions-add">Add</div>
                </div>
            </div>
        `;

        if (add_handler) {
            let add_button = dish_container.querySelector(".di-actions-add");
            add_button.addEventListener("click", add_handler);
        }
        
        return dish_container;
    }
}

export default Dish;