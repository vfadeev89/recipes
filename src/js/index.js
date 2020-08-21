// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

// Search controller
const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();
    if (query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare ui for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);

        try {
            // search for recipes
            await state.search.getResults();

            // render results on ui
            clearLoader();
            searchView.renderResult(state.search.result);

            // highlight selected search item
            if (state.recipe) {
                searchView.highlightSelected(state.recipe.id);
            }
        } catch (error) {
            alert('Something went wrong with search...');
            clearLoader();
        }
    }
};

// Recipe controller
const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // create new recipe object
        state.recipe = new Recipe(id);

        // highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // prepare ui for changes
        recipeView.clearRecipe();

        renderLoader(elements.recipe);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert('Error processing recipe!');
        }
    }
};

// List controller
const controlList = () => {
    // create a new list if there in none yet
    if (!state.list) {
        state.list = new List();
    }
    // add each ingredients to the list and ui
    state.recipe.ingredients.forEach((el) => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Likes controller
const controlLikes = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {
        // user has not yet liked current recipe
        // add like to the state
        const like = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image_url
        );

        // toggle like button
        likesView.toggleLikeButton(true);

        // add like to ui
        likesView.renderLike(like);
    } else {
        // user has liked current recipe
        // remove like from the state
        state.likes.deleteLike(currentId);

        // toggle like button
        likesView.toggleLikeButton(false);

        // remove like from ui
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// handling search form events
elements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    controlSearch();
});

// handling clicks on found recipes
elements.searchResultPages.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, gotoPage);
    }
});

// handling delete and update list items events
elements.shoppingList.addEventListener('click', (event) => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value);
        state.list.updateCount(id, value);
    }
});

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

// handling recipe buttons clicks
elements.recipe.addEventListener('click', (event) => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.js-recipe__btn--add, .js-recipe__btn--add *')) {
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});

// restore likes recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach((like) => likesView.renderLike(like));
});
