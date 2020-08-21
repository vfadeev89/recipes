import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const renderResult = (recipes, page = 1, perPage = 10) => {
    // render results of current page
    const start = (page - 1) * perPage;
    const end = page * perPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, perPage);
};

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const highlightSelected = (id) => {
    const selector = 'results__link';
    const resultsArr = Array.from(document.querySelectorAll(`.${selector}`));
    resultsArr.forEach((el) => {
        el.classList.remove(`${selector}--active`);
    });
    document.querySelector(`.${selector}[href*="${id}"]`).classList.add(`${selector}--active`);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, current) => {
            if (acc + current.length <= limit) {
                newTitle.push(current);
            }
            return acc + current.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeEnd', markup);
};

const renderButtons = (page, numResult, perPage) => {
    const pages = Math.ceil(numResult / perPage);
    let button;
    if (page === 1 && pages > 1) {
        // only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both button
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && page > 1) {
        // only button to go to prev page
        button = createButton(page, 'prev');
    } else {
        button = '';
    }

    // render
    elements.searchResultPages.insertAdjacentHTML('afterBegin', button);
};

const createButton = (page, type) => {
    const pageNumber = type === 'prev' ? page - 1 : page + 1;
    return `
        <button class="btn-inline results__btn--${type}" data-goto="${pageNumber}">
            <span>Page ${pageNumber}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
};
