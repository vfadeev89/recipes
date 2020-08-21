export const elements = {
    searchForm: document.querySelector('.js-search'),
    searchInput: document.querySelector('.js-search__field'),
    searchResult: document.querySelector('.js-results'),
    searchResultList: document.querySelector('.js-results__list'),
    searchResultPages: document.querySelector('.js-results__pages'),
    recipe: document.querySelector('.js-recipe'),
    shoppingList: document.querySelector('.js-shopping__list'),
    likesMenu: document.querySelector('.js-likes__field'),
    likesList: document.querySelector('.js-likes__list'),
};

export const elementsString = {
    loader: 'js-loader',
};

export const renderLoader = (parent) => {
    const loader = `
        <div class="loader ${elementsString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterBegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementsString.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};
