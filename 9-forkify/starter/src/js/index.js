// Global app controller
// forkify-api.herokuapp.com 

import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import {elements, renderLoader, clearLoader} from './views/base'


const state = {}

//SEARCH CONTROLLER
const controlSearch = async () => {
    const query = searchView.getInput()
    if(query) {
        state.search = new Search(query)
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)
        try {
            await state.search.getResults()
            clearLoader()
            searchView.renderResults(state.search.result)

        } catch (error) {
            alert('Error getting search results')
            clearLoader()
        }
    }
}



elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})




elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = +btn.dataset.goto
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})


//RECIPE CONTROLLER
const controlRecipe = async () => {
    const id = parseInt(window.location.hash.replace("#", ""))
    if (id) {
        //prep ui for changes

        // create new recipe object
        state.recipe = new Recipe(id)

        try {
            //get recipe data
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
    
            //calc  servings and time
            state.recipe.calcServings()
            state.recipe.calcTime()
            //render recipe
            console.log(state.recipe)
        } catch (error) {
            alert('Error processing recipe')

        }

    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))