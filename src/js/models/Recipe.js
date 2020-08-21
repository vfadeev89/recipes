import axios from 'axios';
import { apiUrl, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const url = `${apiUrl}/get?rId=${this.id}`;
        try {
            const response = await axios(`${proxy}${url}`);
            this.title = response.data.recipe.title;
            this.publisher = response.data.recipe.publisher;
            this.image_url = response.data.recipe.image_url;
            this.source_url = response.data.recipe.source_url;
            this.ingredients = response.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        // assuming that we need 15 min or each 3 ingredients
        this.time = Math.ceil(this.ingredients.length / 3) * 15;
    }

    parseIngredients() {
        const unitsLong = [
            'tablespoons',
            'tablespoon',
            'ounces',
            'ounce',
            'teaspoons',
            'teaspoon',
            'cups',
            'pounds',
        ];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        this.ingredients = this.ingredients.map((el) => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                };
            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                };
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                };
            }

            return objIng;
        });
    }

    calcServings() {
        this.servings = 4;
    }

    updateServings(type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach((ingr) => {
            ingr.count *= newServings / this.servings;
        });

        this.servings = newServings;
    }
}
