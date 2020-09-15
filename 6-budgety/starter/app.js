
/////Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID

            if (data.allItems[type].length) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            data.allItems[type].push(newItem)
            return newItem


        }
    }

})()




/////UI Controller
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element
            
            //create HTML string with pl text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            }

            // replace pl text with data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            //insert html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)



        },

        clearFields: function() {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)
            console.log('hello')

            fieldsArray.forEach(function(current) {
                current.value = ""
            })
            fieldsArray[0].focus()
        },

        getDOMstrings: function() {
            return DOMstrings
        }
    }

})()




/////Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)
        
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })
    }


    var ctrlAddItem = function() {
        var input, newItem

        //1. get the input data
        input = UICtrl.getInput()
        
        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        //3. add the item tot he UI
        UICtrl.addListItem(newItem, input.type)
        UICtrl.clearFields()

        //4. calc the budget
        
        //5. display the budget on the UI
        
    }
    
    return {
        init: function() {
            console.log('started')
            setupEventListeners()
        }
    }

})(budgetController, UIController)


controller.init()