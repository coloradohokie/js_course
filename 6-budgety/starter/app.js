
/////Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value,
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        totalIncome > 0 ? this.percentage = Math.round((this.value / totalIncome) * 100) : -1
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
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
            calculateTotal('exp')
            calculateTotal('inc')
            data.budget = data.totals.inc - data.totals.exp
            data.totals.inc > 0 ? data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 ) : -1

        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(element => {
                element.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(element => {
                return element.getPercentage()
            })
            return allPercentages
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
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        //+ or -, 2 decimal places, comma separating 1000's
        num = Math.abs(num)
        num = num.toFixed(2)
        let numSplit = num.split('.')
        let int = numSplit[0]
        if (int.length > 3 ) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3)
        }
        let dec = numSplit[1]
        return (type === 'exp' ? "-" : "+") + int + '.' + dec
    }

    const nodeListForEach = (list, callback) => {
        for (let i=0; i < list.length; i++) {
            callback(list[i], i)
        }
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
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">22%</div><div class="item__delete"><button class="item__delete--btn">DEL</button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', formatNumber(obj.value, type))
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
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, obj.budget >= 0 ? 'inc' : 'exp') 
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')

            obj.percentage > 0 ? 
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%' :
                document.querySelector(DOMstrings.percentageLabel).textContent = '--'
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel)
            nodeListForEach(fields, (current, index) => percentages[index] > 0 ? current.textContent = percentages[index] + '%' : current.textContent = '--')
        },

        displayMonth: function() {
            const now = new Date()
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const year = now.getFullYear()
            const month = now.getMonth()

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },

        changedType: function() {
            const fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            )
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus')
            })
            document.querySelector(DOMstrings.inputButton).classList.toggle('red')  
        },

        getDOMstrings: () => DOMstrings
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
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }

    var updateBudget = function() {
        budgetCtrl.calculateBudget()
        var budget = budgetCtrl.getBudget()
        UICtrl.displayBudget(budget)
    }

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages()
        var percentages = budgetCtrl.getPercentages()
        console.log(percentages)
        //update UI
        UICtrl.displayPercentages(percentages)

    }


    var ctrlAddItem = function() {
        var input, newItem
        input = UICtrl.getInput()
        if (input.description !== '' && !isNaN(input.value) && input.value > 0 ) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            UICtrl.addListItem(newItem, input.type)
            UICtrl.clearFields()
            updateBudget()
            updatePercentages()
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id

        itemId = event.target.parentNode.parentNode.parentNode.id

        if (itemId) {
            splitId = itemId.split('-')
            type = splitId[0]
            id = parseInt(splitId[1])
            budgetCtrl.deleteItem(type, id)
            UICtrl.deleteListItem(itemId)
            updateBudget()
            updatePercentages()
        }
    }
    
    return {
        init: function() {
            console.log('started')
            setupEventListeners()
            UICtrl.displayMonth()
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