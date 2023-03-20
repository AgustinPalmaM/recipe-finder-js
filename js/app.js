
function startApp() {
  
  const result = document.querySelector('#resultado');
  const selectCategories = document.querySelector('#categorias');
  if(selectCategories) {
    selectCategories.addEventListener( 'change', selectCategory );
    getCategories();
  }

  const favoritesDiv = document.querySelector('.favoritos');
  if (favoritesDiv) {
    getFavorites();
  }


  const modal = new bootstrap.Modal('#modal', {});
  

  function getCategories() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    fetch(url)
      .then(response => response.json())
      .then(data => showCategories(data.categories))
  }

  function showCategories(categories = []) {
    categories.forEach(category => {
      const option = document.createElement('OPTION');
      const { strCategory } = category;
      option.value = strCategory;
      option.textContent = strCategory;
      selectCategories.appendChild(option);
    })
  }

  function selectCategory(e) {
    const category = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${ category }`;
    fetch(url)
      .then(response => response.json())
      .then(data => showRecipe(data.meals))
  }

  function showRecipe(recipe = []) {
    cleanHTML(result);

    const heading = document.createElement('H2');
    heading.classList.add('text-center', 'text-black', 'my-5');
    heading.textContent = recipe.length ? `${recipe.length} Results` : 'There is not results';
    result.appendChild(heading);

    recipe.forEach(recipe => {
      const { idMeal, strMeal, strMealThumb } = recipe;

      const recipeContainer = document.createElement('DIV');
      recipeContainer.classList.add('col-md-4');
      recipeContainer.dataset.id = idMeal ?? recipe.id;

      const recipeCard = document.createElement('DIV');
      recipeCard.classList.add('card', 'mb-4');

      const recipeImage = document.createElement('IMG');
      recipeImage.classList.add('card-img-top');
      recipeImage.alt = `Recipe image ${strMeal ?? recipe.title}`;
      recipeImage.src = strMealThumb ?? recipe.img;

      const recipeBody = document.createElement('DIV');
      recipeBody.classList.add('card-body');
      
      const recipeHeading = document.createElement('H3');
      recipeHeading.classList.add('card-title', 'mb-3');
      recipeHeading.textContent = strMeal ?? recipe.title;
      
      const recipeButton = document.createElement('BUTTON');
      recipeButton.classList.add('btn', 'btn-danger', 'w-100');
      recipeButton.textContent = 'Watch recipe';
      recipeButton.onclick = function() {
        selectRecipe(idMeal ?? recipe.id);
      }

      recipeBody.appendChild(recipeHeading);
      recipeBody.appendChild(recipeButton);

      recipeCard.appendChild(recipeImage);
      recipeCard.appendChild(recipeBody);

      recipeContainer.appendChild(recipeCard);

      result.appendChild(recipeContainer);

    })
  }

  function selectRecipe(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    fetch(url)
      .then(response => response.json())
      .then(data => showRecipeModal(data.meals[0]))
  }

  function showRecipeModal(recipe) {
    const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;

    const modalTitle = document.querySelector('.modal .modal-title');
    modalTitle.textContent = strMeal;

    const modalBody = document.querySelector('.modal .modal-body');
    modalBody.innerHTML = `
      <img class="img-fluid" src="${strMealThumb}" alt="recipe ${strMeal}"/>
      <h3>Instructions</h3>
      <p>${strInstructions}</p>
      <h3 class="my-3">Ingredients and measures</h3>

    `;

    const listGroup = document.createElement('UL');
    listGroup.classList.add('list-group');

    for(let i = 1; i <= 20; i++){
      if (recipe[`strIngredient${i}`]) {
        const ingredients = recipe[`strIngredient${i}`];
        const measures = recipe[`strMeasure${i}`];
        
        const ingredientLi = document.createElement('LI');
        ingredientLi.classList.add('list-group-item');
        ingredientLi.textContent = `${ingredients} - ${measures}`;

        listGroup.appendChild(ingredientLi);

      }
    }
    modalBody.appendChild(listGroup);

    
    const modalFooter = document.querySelector('.modal-footer');
    cleanHTML(modalFooter);

    const btnFavorite = document.createElement('BUTTON');
    btnFavorite.classList.add('btn', 'btn-danger', 'col');
    btnFavorite.textContent = checkStorage(idMeal) ? 'Delete favorite' : 'Save favorite';
    modalFooter.appendChild(btnFavorite);

    btnFavorite.onclick = function() {

      if(checkStorage(idMeal)) {
        deleteFavorite(idMeal);
        btnFavorite.textContent = 'Save favorite';
        showToast('Deleted from favorites');
        return
      }
      
      addFavorite({
        id: idMeal,
        title: strMeal,
        img: strMealThumb
      });
      
      btnFavorite.textContent = 'Delete favorite';
      showToast('Added to favorites');
    }

    const btnCloseModal = document.createElement('BUTTON');
    btnCloseModal.classList.add('btn', 'btn-secondary', 'col');
    btnCloseModal.textContent = 'Close';
    modalFooter.appendChild(btnCloseModal);
    btnCloseModal.onclick = function() {
      modal.hide();
    }

    modal.show();
  }

  function addFavorite( recipeObject ) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    localStorage.setItem('favorites', JSON.stringify([...favorites, recipeObject]));
  }

  function deleteFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    const newFavorites = favorites.filter(favorite => favorite.id !== id);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    showRecipe(newFavorites);
    modal.hide();

  }

  function checkStorage(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    return favorites.some(favorite => favorite.id === id);
  }

  function showToast(message) {
    const toastDiv = document.querySelector('#toast');
    const toastBody = document.querySelector('.toast-body');
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = message;
    toast.show();

  }

  function getFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
    if (favorites.length) {
      showRecipe(favorites)
    }

    const noFavorites = document.createElement('P');
    noFavorites.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
    noFavorites.textContent = 'No favorites yet';

    favoritesDiv.appendChild(noFavorites);
  }

  function cleanHTML(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
}

document.addEventListener( 'DOMContentLoaded', startApp );