// Global app controller
// forkify-api.herokuapp.com 

import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {elements, renderLoader, clearLoader} from './views/base'
import Likes from './models/Likes'


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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
        } catch (error) {
            console.log(error)
            alert('something went wrong loading recipe')

        }

    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))


///// LIST CONTROLLER    /////
const controlList = () => {
    //create a new list if there is none yet
    if (!state.list) state.list = new List()

    //add ea ing to list & UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}

//Handle dlete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //dlete from state
        state.list.deleteItem(id)

        //delete from UI
        listView.deleteItem(id)

        //handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value)
        state.list.updateCount(id, val)
        
    }
})


/////     LIKES CONTROLLER     /////

const controlLike = () => {
    if (!state.likes) state.likes = new Likes()
    const currentId = state.recipe.id

    //User has NOT liked the current recipe
    if(!state.likes.isLiked(currentId)) {
        //Add like to state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        //Toggle the button
        likesView.toggleLikeButton(true)

        //Add like to the UI list
        likesView.renderLike(newLike)
    
    //User has liked the current recipe and is unliking it
    } else {
        //Remove like from state
        state.likes.deleteLike(currentId)

        //Toggle the button
        likesView.toggleLikeButton(false)

        //Remove like from the UI list
        likesView.deleteLike(currentId)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}


//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes()
    state.likes.readStorage()
    likesView.toggleLikeMenu(state.likes.getNumLikes())
    state.likes.likes.forEach(like => likesView.renderLike(like))
})

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1)
        state.recipe.updateServings('dec')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ing to shopping list
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike()
    }
})
