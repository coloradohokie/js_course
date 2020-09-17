/////////////////////////////////
// CODING CHALLENGE

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

*/

class Element {
    constructor(name, buildYear) {
        this.name = name
        this.buildYear = buildYear
    }
}

class Park extends Element {
    constructor(name, buildYear, treeCount, area) {
        super(name, buildYear)
        this.treeCount = treeCount
        this.area = area
    }

    treeDensity = () => this.treeCount/this.area 
}

class Street extends Element {
    constructor(name, buildYear, length, classification='normal') {
        super(name, buildYear)
        this.length = length
        this.classification = classification
    }
}

const parks = [
    new Park("Central Park", 1842, 22000, 40),
    new Park("City Park", 1901, 500, 4),
    new Park("Gramarcy Park", 1974, 22, 2)
]

const streets = [
    new Street('Broadway', 1790, 10, 'big'),
    new Street('12th Steet', 1981, 1, 'tiny'),
    new Street('FDR Drive', 1955, 30, 'huge'),
    new Street('E 66th Ave', 1901, 3)
]

treeDensityReport = () => {
    for (park of parks) {
        console.log(`The tree density of ${park.name} is ${park.treeDensity()}`)
    }
}

parkAgeReport = () => {
    const currentYear = new Date().getFullYear()
    const sumOfAges = parks.reduce((acc, cv) => acc + (currentYear - cv.buildYear), 0)
    console.log(`The average age of all of the parks is ${(sumOfAges/parks.length).toFixed(0)}`)
}

treesGreaterThan = (value=1000) => {
    const filteredParkList = parks.filter( park => park.treeCount > value)
    if (filteredParkList.length) {
        console.log(`The following parks have more than ${value} trees:`)
        for (park of filteredParkList) {
            console.log(park.name)
        }
    } else {
        console.log(`No parks have more than ${value} trees`)
    }
}

streetsReport = () => {
    const sumOfLengths = streets.reduce((acc, cv) => acc + cv.length, 0)
    console.log(`The total length of the all of the streets is ${sumOfLengths}. The average length is ${sumOfLengths/streets.length}`)
}

listOfSteetClassifications = () => {
    classfications = ['tiny', 'normal', 'big', 'huge']
    for (classification of classfications) {
        console.log(`The following steets have a classification of ${classification}:`)
        for (street of streets) {
            if (street.classification === classification) {
                console.log(street.name)
            }
        }
    }
}

parkAgeReport()
treesGreaterThan()
streetsReport()
listOfSteetClassifications()