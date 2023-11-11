/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

let gamesToDisplay = GAMES_JSON;

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data (11 times)
    games.forEach(item => {
        // create a new div element, which will become the game card
        let div = document.createElement('div');

        // add the class game-card to the list
        div.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        div.innerHTML =
            `
                <p>${item.pledged > item.goal ? "Full Funded!" : `$${item.pledged.toLocaleString()} / $${item.goal.toLocaleString()}`}</p>
                <img class='game-img' src='${item.img}' />
                <p class="game-card-name">${item.name}</p> 
                <p class="game-card-description">${item.description}</p>
                <p>Backers: ${item.backers}
                
            `;

        // append the game to the games-container
        gamesContainer.append(div);
    });
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(gamesToDisplay);

// Code: 
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((total, item) => { return total + item.backers; }, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

let totalRaised = GAMES_JSON.reduce((total, item) => { return total + item.pledged; }, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

let totalGames = GAMES_JSON.reduce((total, item) => { return total + 1 }, 0);

gamesCard.innerHTML = `${totalGames}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unreachedGoal = gamesToDisplay.filter((game) => { return game.goal > game.pledged; });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unreachedGoal);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let funded = gamesToDisplay.filter((game) => { return game.pledged > game.goal; });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(funded);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(gamesToDisplay);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

// tolocaleString<div>1ivy
/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfunded = GAMES_JSON.reduce((sum, item) => { return item.pledged < item.goal ? sum + 1 : sum }, 0);

// create a string that explains the number of unfunded games using the ternary operator
let descriptionStr =
    `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames} game${unfunded == 1 ? '' : 's'}.  
    Currently ${unfunded} game${unfunded == 1 ? '' : 's'} 
    remain${unfunded == 1 ? 's' : ''} unfunded. 
    We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container

let desc = document.createElement('p');
desc.innerHTML = descriptionStr;

descriptionContainer.append(desc);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [first, second, ...others] = GAMES_JSON;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledge = document.createElement('p');
topPledge.innerHTML = `${first.name}`;
firstGameContainer.append(topPledge);

// do the same for the runner up item
let runnerUp = document.createElement('p');
runnerUp.innerHTML = `${second.name}`;
secondGameContainer.append(runnerUp);

const searchInput = document.getElementById("search-input");

// On keypress search for games that include the searchQuery
searchInput.addEventListener("keyup", (event) => {
    deleteChildElements(gamesContainer);

    const { value } = event.target;
    const search = value.toLowerCase();
    console.log(search);

    if (search == '')
        gamesToDisplay = GAMES_JSON;
    else
        gamesToDisplay = GAMES_JSON.filter((item) => {
            return item.name.toLowerCase().includes(search);
        });

    addGamesToPage(gamesToDisplay);
});
