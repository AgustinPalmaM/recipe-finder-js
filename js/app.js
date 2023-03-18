function startApp() {

  const selectCategories = document.querySelector('#categorias');
  selectCategories.addEventListener( 'change', selectCategory );
  
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
    console.log(url);
  }
}

document.addEventListener( 'DOMContentLoaded', startApp );