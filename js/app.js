class CalorieTracker {
    #calorieLimit = Storage.getCalorieLimit();
    #totalCalories = Storage.getTotalCalories();
    #meals = Storage.getMeals();
    #workouts = Storage.getWorkouts();

    constructor() {
        this.#loadItems();
        this.#render();
    }

    //  Public methods

    addMeal(meal) {
        Storage.addMeal(meal);
        this.#meals = Storage.getMeals();

        Storage.setTotalCalories(+Storage.getTotalCalories() + +meal.calories);
        this.#totalCalories = Storage.getTotalCalories();

        this.#displayNewItemInDOM(meal, 'meal');
        this.#render();
    }

    removeMeal(id) {
        Storage.removeMeal(id);
        this.#meals = Storage.getMeals();

        this.#totalCalories = Storage.getTotalCalories();

        this.#render();
    }

    addWorkout(workout) {
        Storage.addWorkout(workout);
        this.#workouts = Storage.getWorkouts();

        Storage.setTotalCalories(Storage.getTotalCalories() - workout.calories);
        this.#totalCalories = Storage.getTotalCalories();

        this.#displayNewItemInDOM(workout, 'workout');
        this.#render();
    }

    removeWorkout(id) {
        Storage.removeWorkout(id);
        this.#workouts = Storage.getWorkouts();

        this.#totalCalories = Storage.getTotalCalories();

        this.#render();
    }

    resetDay() {
        Storage.resetAll();

        this.#meals = Storage.getMeals();
        this.#workouts = Storage.getWorkouts();
        this.#totalCalories = Storage.getTotalCalories();

        this.#render();
    }

    setLimit(limit) {
        Storage.setCalorieLimit(limit);
        this.#calorieLimit = Storage.getCalorieLimit();
        this.#render();
    }

    //  Private methods

    #displayCaloriesLimit() {
        const calorieLimitDOM = document.querySelector('#calories-limit');
        calorieLimitDOM.innerText = this.#calorieLimit;

    }

    #displayCaloriesTotal() {
        const totalCaloriesDOM = document.querySelector('#calories-total');
        totalCaloriesDOM.innerText = this.#totalCalories;
    }

    #displayCaloriesConsumed() {
        const caloriesConsumedDOM = document.querySelector('#calories-consumed');
        const consumed = this.#meals.reduce((acc, meal) => acc + meal.calories, 0);

        caloriesConsumedDOM.innerHTML = consumed;
    }

    #displayCaloriesBurned() {
        const caloriesBurnedDOM = document.querySelector('#calories-burned');
        const burned = this.#workouts.reduce((acc, meal) => acc + meal.calories, 0);

        caloriesBurnedDOM.innerHTML = burned;
    }

    #displayCaloriesRemaining() {
        const caloriesRemainingDOM = document.querySelector('#calories-remaining');
        const caloriesProgressDOM = document.querySelector('#calorie-progress')

        const remaining = this.#calorieLimit - this.#totalCalories;
        caloriesRemainingDOM.innerHTML = remaining;

        remaining <= 0
            ? (
                caloriesRemainingDOM.parentElement.classList.add('bg-danger'),
                caloriesProgressDOM.classList.add('bg-danger')
            )
            : (
                caloriesRemainingDOM.parentElement.classList.remove('bg-danger'),
                caloriesProgressDOM.classList.remove('bg-danger')
            )
    }

    #updateCaloriesProgress() {
        const caloriesProgressDOM = document.querySelector('#calorie-progress');

        const progress = this.#totalCalories < 0
            ? 0
            : this.#totalCalories / this.#calorieLimit * 100;

        caloriesProgressDOM.style.width = `${progress}%`;
    }

    #displayNewItemInDOM(obj, type) {
        const items = document.querySelector(`#${type}-items`);

        const div = document.createElement('div');
        div.classList.add('card', 'my-2');
        div.setAttribute('id', obj.id);

        const bgType = type === 'meal'
            ? 'primary'
            : 'secondary';

        div.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${obj.name}</h4>
                    <div class="fs-1 bg-${bgType} text-white text-center rounded-2 px-2 px-sm-5">
                    ${obj.calories}</div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            `;

        items.appendChild(div);
    }

    #loadItems() {
        this.#meals.forEach(meal => this.#displayNewItemInDOM(meal, 'meal'));

        this.#workouts.forEach(workout => this.#displayNewItemInDOM(workout, 'workout'));
    }

    #render() {
        this.#displayCaloriesLimit();
        this.#displayCaloriesTotal();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
        this.#updateCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Storage {
    static getCalorieLimit() {
        return localStorage.getItem('calorieLimit') || 2000;
    }
    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories() {
        return localStorage.getItem('totalCalories') || 0;
    }
    static setTotalCalories(totalCalories) {
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getMeals() {
        return JSON.parse(localStorage.getItem('meals')) || [];
    }
    static addMeal(meal) {
        const meals = this.getMeals();
        meals.push(meal);

        localStorage.setItem('meals', JSON.stringify(meals));
    }
    static removeMeal(id) {
        const meals = this.getMeals();

        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
                Storage.setTotalCalories(Storage.getTotalCalories() - meal.calories);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts() {
        return JSON.parse(localStorage.getItem('workouts')) || [];
    }
    static addWorkout(workout) {
        const workouts = this.getWorkouts();
        workouts.push(workout);

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
    static removeWorkout(id) {
        const workouts = this.getWorkouts();

        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
                Storage.setTotalCalories(+Storage.getTotalCalories() + +workout.calories);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static resetAll() {
        localStorage.setItem('totalCalories', 0);
        localStorage.setItem('meals', JSON.stringify([]));
        localStorage.setItem('workouts', JSON.stringify([]));
    }
}

class App {
    #tracker = new CalorieTracker();

    constructor() {
        document.querySelector('#meal-form').addEventListener('submit', this.#newItem.bind(this, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', this.#newItem.bind(this, 'workout'));

        document.querySelector('#meal-items').addEventListener('click', this.#removeItem.bind(this, 'meal'));
        document.querySelector('#workout-items').addEventListener('click', this.#removeItem.bind(this, 'workout'));

        document.querySelector('#filter-meals').addEventListener('input', this.#filterItems.bind(this, 'meal'));
        document.querySelector('#filter-workouts').addEventListener('input', this.#filterItems.bind(this, 'workout'));

        document.querySelector('#reset').addEventListener('click', this.#reset.bind(this));

        document.querySelector('#limit-form').addEventListener('submit', this.#setLimit.bind(this));
    };

    #newItem(type, e) {
        e.preventDefault();

        const name = document.querySelector(`#${type}-name`);
        const calories = document.querySelector(`#${type}-calories`);

        if (name.value === '' || calories.value === '') {
            alert('Please enter all fields');
            return;
        }

        type === 'meal'
            ? this.#tracker.addMeal(new Meal(name.value, +calories.value))
            : this.#tracker.addWorkout(new Workout(name.value, +calories.value));

        name.value = '';
        calories.value = '';

        const collapseMeal = document.querySelector(`#collapse-${type}`);
        new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });
    }

    #removeItem(type, e) {
        if (e.target.classList.contains('fa-xmark') || e.target.classList.contains('delete')) {

            if (confirm('Are you sure?')) {
                const item = e.target.closest('.card');
                const id = item.getAttribute('id');

                type === 'meal'
                    ? this.#tracker.removeMeal(id)
                    : this.#tracker.removeWorkout(id);

                item.remove();
            };
        }
    }

    #filterItems(type, e) {
        const inputText = e.target.value.toLowerCase();

        const items = document.querySelectorAll(`#${type}-items .card`);

        items.forEach(item => {
            const itemName = item.querySelector('.mx-1').innerText.toLowerCase();

            if (itemName.includes(inputText)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    #reset() {
        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';

        this.#tracker.resetDay();
    }

    #setLimit(e) {
        e.preventDefault();

        const limit = document.querySelector('#limit');

        if (limit.value.trim() <= 0 || isNaN(limit.value.trim())) {
            alert('Please add a limit');
            return;
        }

        this.#tracker.setLimit(limit.value);
        limit.value = '';

        document.querySelector('#limit-modal').querySelector('.btn-close').click();
    }

}

const app = new App();

