
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

    var calculateTotal = function(type) {
        if (data.allItems[type].length) {
            data.totals[type] = data.allItems[type].reduce((acc, cv) => acc + cv.value, 0)
        }
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },

        deleteItem: function(type, id) {
            var index

            var ids = data.allItems[type].map(function(current) {
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function() {
            //calc total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            //calc budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp

            //cacl % of income that we spent
            console.log (data.totals.inc)
            data.totals.inc > 0 ? data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 ) : -1

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data)
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element
            
            //create HTML string with pl text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            }

            // replace pl text with data
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value)

            //insert html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem: function(selectorId) {
            var element = document.getElementById(selectorId)
            element.parentNode.removeChild(element)
        },

        clearFields: function() {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)
            fieldsArray.forEach(function(current) {
                current.value = ""
            })
            fieldsArray[0].focus()
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp

            obj.percentage > 0 ? 
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%' :
                document.querySelector(DOMstrings.percentageLabel).textContent = '--'
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function() {
        // 1. calc the budget
        budgetCtrl.calculateBudget()

        // 2. return the budget
        var budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)
    }


    var ctrlAddItem = function() {
        var input, newItem

        //1. get the input data
        input = UICtrl.getInput()

        if (input.description !== '' && !isNaN(input.value) && input.value > 0 ) {

            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            //3. add the item tot he UI
            UICtrl.addListItem(newItem, input.type)
            UICtrl.clearFields()

            //4. calc and update the budget
            updateBudget()
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id

        itemId = event.target.parentNode.parentNode.parentNode.id

        if (itemId) {
            //inc-1
            splitId = itemId.split('-')
            type = splitId[0]
            id = parseInt(splitId[1])

            // del item from data structure
            budgetCtrl.deleteItem(type, id)

            // del item from UI
            UICtrl.deleteListItem(itemId)

            //update and show new totals
            updateBudget()

        }
    }
    
    return {
        init: function() {
            console.log('started')
            setupEventListeners()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
        }
    }

})(budgetController, UIController)


controller.init()