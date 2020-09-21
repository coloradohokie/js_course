// Global app controller
// forkify-api.herokuapp.com 

import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
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
        renderLoader(elements.recipe)

        //Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id)
        }


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
            clearLoader()
            recipeView.clearRecipe()
            recipeView.renderRecipe(state.recipe)
        } catch (error) {
            console.log(error)
            alert('something went wrong loading recipe')

        }

    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))



//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1)
        state.recipe.updateServings('dec')
        recipeView.updateServingsIngredients(state.recipe)
    }

    if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
})

window.l = new List()