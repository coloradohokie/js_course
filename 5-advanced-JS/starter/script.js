// Function constructor

// var john = {
//     name: 'John',
//     yearOfBirth: 1990,
//     job: 'teacher'
// }

// var Person = function(name, yearOfBirth, job) {
//     this.name = name
//     this.yearOfBirth = yearOfBirth
//     this.job = job

// }

// Person.prototype.calculateAge = this.calculateAge = function() {
//     console.log(2016 - this.yearOfBirth)
// }


// var john = new Person('John', 1990, 'teacher')
// var jane = new Person('Jane', 1969, 'designer')
// var mark = new Person('Mark', 1948, 'retired')

// var Girl = function(firstName, lastName, yearOfBirth, bestMovie) {
//     this.firstName = firstName
//     this.lastName = lastName
//     this.yearOfBirth = yearOfBirth
//     this.bestMovie = bestMovie
// }

// var traci = new Girl("Traci", "Lords", 1968, "It's My Body")
// var jenna = new Girl("Jenna", "Jameson", 1974, "Jenna Ink")


// function retirement(retirementAge) {
//     var a = ' years left until retirement.'
//     return function(yearOfBirth) {
//         var age = 2016 - yearOfBirth
//         console.log((retirementAge - age) + a)
//     }
// }

// var retirementUs = retirement(66)
// retirementUs(1990)
// retirement(66)(1990)


// function interviewQuestion(job) {


//     return function(name) {
//         switch (job) {
//             case 'teacher':
//                 return ('What subject do you teach, ' + name + '?')
//             case 'designer':
//                 return (name + ', can you please explain what UX design is?')
//             default:
//                 return ('Hello ' + name + '! What do you do?') 
//         }

//     }
// }

// const interviewQ = interviewQuestion('teacher')('Mike')
// const interviewD = interviewQuestion('designer')('Steve')
// const interviewI = interviewQuestion('welder')('Jonas')
// console.log(interviewQ)
// console.log(interviewD)
// console.log(interviewI)


// var john = {
//     name: 'John',
//     age: 26,
//     job: 'teacher', 
//     presentation: function(style, timeOfDay) {
//         if (style === 'formal') {
//             console.log('Good ' + timeOfDay + ', ladies and gentlemen! I\'m ' + this.name + ", I'm a " + this.job + ", and I'm " + this.age)
//         } else if (style = 'friendly') {
//             console.log('Wazzup! I\'m ' + this.name + ", I'm a " + this.job + ", and I'm " + this.age + ". Have a nice " + timeOfDay)
//         }
//     }
// }

// var emily = {
//     name: 'Emily',
//     age: 19,
//     job: 'pornstar'
// }

// john.presentation('formal', 'afternoon')

// john.presentation.call(emily, 'friendly', 'evening')


/////////////////////////////
// CODING CHALLENGE


/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).
*/

/*
--- Expert level ---

8. After you display the result, display the next random question, so that the game never ends (Hint: write a function for this and call it right after displaying the result)

9. Be careful: after Task 8, the game literally never ends. So include the option to quit the game if the user writes 'exit' instead of the answer. In this case, DON'T call the function from task 8.

10. Track the user's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'm going to use the power of closures for this, but you don't have to, just do this with the tools you feel more comfortable at this point).

11. Display the score in the console. Use yet another method for this.
*/

//Question: Is Javascript the coolest language in the world?

//Question: What is the instructor's name?

//Question: Do birds go tweet?


/*
(function() {
    const bank = [
        {
            question: 'Is Javascript the coolest language in the world?',
            answers: ['Yes', 'No'],
            correctAnswer: 'Yes'
        },
        {
            question: 'What is the instructor\'s name?',
            answers: ['Mike', 'David', 'Jonas'],
            correctAnswer: 'Jonas'
        },
        {
            question: 'Do birds go tweet?',
            answers: ['Yes', 'No'],
            correctAnswer: 'Yes'
        }
    ]
    
    
    function askQuestion(selectedQuestion) {
        selectedQuestion.answers.map((answer, index) => console.log(index, ' - ', answer))
        const response = prompt(selectedQuestion.question + ' Type "exit" to quit.')
        return response === 'exit' ? 'exit' : selectedQuestion.answers[response]
    }
    
    let quit = false
    let bankQuestion
    let score = 0
    while (!quit) {
        bankQuestion = bank[Math.floor(Math.random()*bank.length)]
        switch(askQuestion(bankQuestion)) {
            case bankQuestion.correctAnswer:
                score++
                console.log('Correct! Current score: ' + score)
                break
            case 'exit':
                quit = true
                console.log('Final Score: ' + score)
                break
            default:
                console.log('Incorrect. The correct answer is ' + bankQuestion.correctAnswer)
        }
    }

})()
*/

////Solution using Classes

class Question {
    constructor(question, answers, correctAnswer) {
        this.question = question
        this.answers = answers
        this.correctAnswer = correctAnswer
    }

    askQuestion() {
        this.answers.map((answer, index) => console.log(index + ' : ' + answer))
        const response = prompt(this.question)
        if (this.answers[response] === this.correctAnswer) {
            return 'Correct!'
        } else if (response === 'exit') {
            return 'exit'
        } else {
            return 'Incorrect. The correct answer is ' + this.correctAnswer
        }
    }
}

const question1 = new Question(
    'What is the coolest programming Language?',
    ['C++', 'Java', 'Ruby', 'JavaScript'],
    'JavaScript'
)

const question2 = new Question(
    'What language should I have learned in high school?',
    ['C++', 'Java', 'Ruby', 'JavaScript'],
    'C++'
)

const question3 = new Question(
    'What language did I do my capstone in?',
    ['C++', 'Java', 'Ruby', 'JavaScript'],
    'Java'
)
const questionBank = [question1, question2, question3]

let active = true
while (active) {
    const selectedQuestion = Math.floor(Math.random()*questionBank.length)
    let userAnswer = questionBank[selectedQuestion].askQuestion()
    if (userAnswer === 'exit') {
        active = false
    } else {
        console.log(userAnswer)
    }

}