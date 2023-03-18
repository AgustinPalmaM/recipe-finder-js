function startApp() {

  const selectCategories = document.querySelector('#categorias');
  selectCategories.addEventListener( 'change', selectCategory );

  const result = document.querySelector('#resultado');
  
  getCategories();

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

      const recipeCard = document.createElement('DIV');
      recipeCard.classList.add('card', 'mb-4');

      const recipeImage = document.createElement('IMG');
      recipeImage.classList.add('card-img-top');
      recipeImage.alt = `Recipe image ${strMeal}`;
      recipeImage.src = strMealThumb;

      const recipeBody = document.createElement('DIV');
      recipeBody.classList.add('card-body');
      
      const recipeHeading = document.createElement('H3');
      recipeHeading.classList.add('card-title', 'mb-3');
      recipeHeading.textContent = strMeal;
      
      const recipeButton = document.createElement('BUTTON');
      recipeButton.classList.add('btn', 'btn-danger', 'w-100');
      recipeButton.textContent = 'Watch recipe';
      recipeButton.onclick = function() {
        selectRecipe(idMeal);
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

  function showRecipeModal(data) {
    console.log(data);
  }

  function cleanHTML(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
}

document.addEventListener( 'DOMContentLoaded', startApp );