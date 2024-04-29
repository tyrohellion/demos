let sidebar = document.querySelector('.sidebar');
let icon = document.querySelector('.sidebar-icon');
let search = document.querySelector('.fullscreen-search-container');
let searchButton = document.querySelector('.search-button');
let closeSearch = document.querySelector('.x-icon');
var body = document.body;

icon.onclick = function() {
    sidebar.classList.toggle('active');
};

searchButton.onclick = function() {
    search.classList.toggle('active');
    body.classList.toggle('active');
};

closeSearch.onclick = function() {
    search.classList.toggle('active');
    body.classList.toggle('active');
};

// Debounce function
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Function to perform AJAX call for player search
const debouncedPlayerSearch = debounce(performPlayerSearch, 200);

// Function to perform AJAX call for event search
const debouncedEventSearch = debounce(performEventSearch, 200);

// Function to perform AJAX call for team search
const debouncedTeamSearch = debounce(performTeamSearch, 200);

// Attach debounced event listeners to the input field for each search type
var userInputField = document.getElementById('searchInput');
userInputField.addEventListener('input', debouncedPlayerSearch);
userInputField.addEventListener('input', debouncedEventSearch);
userInputField.addEventListener('input', debouncedTeamSearch);

// Function to perform AJAX call for player search
function performPlayerSearch() {
    var query = document.getElementById("searchInput").value;
    console.log("Player Search Query:", query); // Log the player search query

    // Perform AJAX call to /search endpoint with the player query
    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Player Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Player Search Data:', data); // Log the received player search data
            updatePlayerResults(data.players);
            updateResultsDisplay(); // Update results display after receiving data
        })
        .catch(error => console.error('Player Search Error:', error));
}

// Function to update player search results
function updatePlayerResults(players) {
    // Clear previous player results
    var playerResults = document.getElementById("playerResults");
    playerResults.innerHTML = "";

    // Sort players based on presence of team image
    players.sort(function(a, b) {
        // Sort players with team image first
        if (a.team && a.team.image !== undefined && (!b.team || b.team.image === undefined)) {
            return -1;
        }
        // Sort players without team image second
        if ((!a.team || a.team.image === undefined) && b.team && b.team.image !== undefined) {
            return 1;
        }
        // Keep the order the same otherwise
        return 0;
    });

    // Update with new player search results
    players.forEach(function(player) {
        var divWrapper = document.createElement("div"); // Create parent div
        divWrapper.classList.add("results-item"); // Add class to parent div

        // Check if player object contains a non-empty tag
        if (player.tag.trim() !== "") {
            var divTag = document.createElement("div"); // Create nested div for player tag
            divTag.classList.add("player-tag"); // Add class to nested div
            divTag.textContent = player.tag; // Set content of nested div
            divWrapper.appendChild(divTag); // Append tag div to parent div
        }

        // Check if player object contains a name property
        if (player.name) {
            var pName = document.createElement("p"); // Create p element for player name
            pName.classList.add("player-name"); // Add class to p element
            pName.textContent = player.name; // Set content of p element
            divWrapper.appendChild(pName); // Append p element to parent div
        } else {
            // Append nested div to parent div
            divWrapper.style.paddingTop = "0"; // Remove padding-top if no name
        }

        // Check if player has a team linked and if team image is defined
        if (player.team && player.team.image !== undefined) {
            var teamDiv = document.createElement("div"); // Create nested div for team image
            var img = document.createElement("img"); // Create img element for team image
            img.classList.add("team-image"); // Add class to img element
            img.src = player.team.image; // Set src of img element to team image URL
            img.alt = player.team.name; // Set alt attribute of img element
            teamDiv.appendChild(img); // Append img element to team div
            divWrapper.appendChild(teamDiv); // Append team div to parent div
        }

        // Add click event listener to each player result
        divWrapper.addEventListener('click', function() {
            window.location.href = '/player/' + player._id; // Redirect to player info page
        });

        function updateResultsDisplay() {
            // Get the number of .results-item elements
            var itemCount = document.querySelectorAll('#playerResults .results-item').length;

            // If there are 8 or more items, display .seeMore
            if (itemCount >= 8) {
                document.getElementById('playersMoreResults').style.display = 'flex';
            } else {
                document.getElementById('playersMoreResults').style.display = 'none';
            }
        }

        // Call the function initially
        updateResultsDisplay();
        
        // Now let's assume you have an input field where the user types something
        var userInputField = document.getElementById('searchInput');
        
        // Attach an event listener to the input field to trigger the function whenever the user types something
        userInputField.addEventListener('input', function() {
            // Call the function whenever the user types something
            updateResultsDisplay();
        });

        playerResults.appendChild(divWrapper); // Append parent div to playerResults
    });
}

// Function to remove see more when less than 8 results
function updateResultsDisplay() {
    // Get the number of .results-item elements within #teamResults and #playerResults
    var teamItemCount = document.querySelectorAll('#teamResults .results-item').length;
    var playerItemCount = document.querySelectorAll('#playerResults .results-item').length;

    // Update team results display
    if (teamItemCount >= 8) {
        document.getElementById('teamsMoreResults').style.display = 'flex';
    } else {
        document.getElementById('teamsMoreResults').style.display = 'none';
    }

    // Update player results display
    if (playerItemCount >= 8) {
        document.getElementById('playersMoreResults').style.display = 'flex';
    } else {
        document.getElementById('playersMoreResults').style.display = 'none';
    }
}

// Call the function initially
updateResultsDisplay();

// Now let's assume you have an input field where the user types something
var userInputField = document.getElementById('searchInput');

// Attach an event listener to the input field to trigger the function whenever the user types something
userInputField.addEventListener('input', function() {
    performSearch(); // Call performSearch() whenever user types something
});

// Function to perform AJAX call for event search
function performEventSearch() {
    var query = document.getElementById("searchInput").value;
    console.log("Event Search Query:", query); // Log the event search query

    // Perform AJAX call to /search endpoint with the event query
    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Event Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Event Search Data:', data); // Log the received event search data
            // Sort events by start date in descending order
            var sortedEvents = data.events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            updateEventResults(sortedEvents);
            updateResultsDisplay(); // Update results display after receiving data
        })
        .catch(error => console.error('Event Search Error:', error));
}

// Function to update event search results
function updateEventResults(events) {
    // Clear previous event results
    var eventResults = document.getElementById("tournamentResults");
    eventResults.innerHTML = "";

    // Update with new event search results
    events.forEach(function(event) {
        var divWrapper = document.createElement("div"); // Create parent div
        divWrapper.classList.add("event-results-item"); // Add class to parent div

        // Check if event object contains a name property
        if (event.name) {
            var pName = document.createElement("p"); // Create p element for event name
            pName.classList.add("event-name"); // Add class to p element
            pName.textContent = event.name; // Set content of p element
            divWrapper.appendChild(pName); // Append p element to parent div
        }

        // Check if event object contains an image URL
        if (event.image !== undefined) {
            var img = document.createElement("img"); // Create img element for team image
            img.classList.add("event-image"); // Add class to img element
            img.src = event.image; // Set src of img element to team image URL
            img.alt = event.name; // Set alt attribute of img element
            divWrapper.appendChild(img); // Append img element to parent div
        }

        // Create div for event details
        var divDetails = document.createElement("div");
        divDetails.classList.add("event-details");

        // Check if event object contains a tier property
        if (event.tier) {
            var pTier = document.createElement("p"); // Create p element for event tier
            pTier.classList.add("event-tier"); // Add class to p element
            pTier.textContent = event.tier; // Set content of p element
            divDetails.appendChild(pTier); // Append p element to event details div
        }

        // Check if event object contains a region property
        if (event.region) {
            var pRegion = document.createElement("p"); // Create p element for event region
            pRegion.classList.add("event-region"); // Add class to p element
            pRegion.textContent = event.region; // Set content of p element
            divDetails.appendChild(pRegion); // Append p element to event details div
        }

        // Add click event listener to each player result
        divWrapper.addEventListener('click', function() {
            window.location.href = '/event/' + event._id; // Redirect to player info page
        });

        function updateResultsDisplay() {
            // Get the number of .results-item elements within #tournamentResults
            var itemCount = document.querySelectorAll('#tournamentResults .event-results-item').length;
        
            // If there are 4 or more items, display #tourneyMoreResults, otherwise hide it
            if (itemCount >= 4) {
                document.getElementById('tourneyMoreResults').style.display = 'flex';
            } else {
                document.getElementById('tourneyMoreResults').style.display = 'none';
            }
        }

        // Call the function initially
        updateResultsDisplay();

        // Now let's assume you have an input field where the user types something
        var userInputField = document.getElementById('searchInput');

        // Attach an event listener to the input field to trigger the function whenever the user types something
        userInputField.addEventListener('input', function() {
            // Call the function whenever the user types something
            updateResultsDisplay();
        });

        divWrapper.appendChild(divDetails); // Append event details div to parent div
        eventResults.appendChild(divWrapper); // Append parent div to eventResults
    });
}

// Function to perform AJAX call for team search
function performTeamSearch() {
    var query = document.getElementById("searchInput").value;
    console.log("Team Search Query:", query); // Log the team search query

    // Perform AJAX call to /search endpoint with the team query
    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Team Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Team Search Data:', data); // Log the received team search data
            updateTeamResults(data.teams);
        })
        .catch(error => console.error('Team Search Error:', error));
}

// Function to perform AJAX call to fetch active teams
function fetchActiveTeams() {
    fetch("/active-teams")
        .then(response => {
            if (!response.ok) {
                throw new Error('Active Teams: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Active Teams Data:', data); // Log the received active teams data
            updateTeamResults(data.teams, data.active_teams);
        })
        .catch(error => console.error('Active Teams Error:', error));
}

// Function to update team search results
function updateTeamResults(teams, active_teams) {
    var teamResults = document.getElementById("teamResults");
    teamResults.innerHTML = "";

    // Display active teams first
    if (active_teams) {
        active_teams.forEach(function(activeTeam) {
            var divWrapper = createTeamElement(activeTeam);
            teamResults.appendChild(divWrapper); // Append active teams at the end
        });
    }

    // Display regular teams after active teams
    if (teams) {
        teams.forEach(function(team) {
            var divWrapper = createTeamElement(team);
            teamResults.appendChild(divWrapper); // Append regular teams after active teams
        });
    }

    // Call the function to update display
    updateResultsDisplay();
}

// Function to create a team element
function createTeamElement(team) {
    var divWrapper = document.createElement("div");
    divWrapper.classList.add("results-item");

    if (team.name) {
        var pName = document.createElement("p");
        pName.classList.add("team-name");
        pName.textContent = team.name;
        divWrapper.appendChild(pName);
    }

    if (team.image !== undefined) {
        var img = document.createElement("img");
        img.classList.add("team-image");
        img.src = team.image;
        img.alt = team.name;
        divWrapper.appendChild(img);
    }

    divWrapper.addEventListener('click', function() {
        window.location.href = '/team/' + team._id;
    });

    return divWrapper;
}

// Function to perform all searches
function performSearch() {
    debouncedPlayerSearch();
    debouncedPlayerSearch();
    debouncedEventSearch();
}

// Function to convert UTC date string to date only format (YYYY-MM-DD)
function convertUTCtoDateOnly(utcDateString) {
    var dateParts = utcDateString.split('T')[0];
    return dateParts;
}

// Get the elements by class name
var dateElements = document.querySelectorAll('.event-start-date, .event-end-date, .match-date');

// Loop through each element
dateElements.forEach(function(element) {
    // Get the UTC date string from the data attribute
    var utcDateString = element.getAttribute('data-utc');

    // Convert the UTC date string to the desired format
    var formattedDate = convertUTCtoDateOnly(utcDateString);

    // Set the formatted date as the content of the element
    element.textContent = formattedDate;
});

// Get the prize pool element by ID
var prizePoolElement = document.getElementById('prizePool');

// Get the prize pool amount from the element
var prizePoolAmount = prizePoolElement.textContent.trim();

// Function to add commas every three digits
function addCommas(numberString) {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format the prize pool amount with commas
var formattedPrizePool = addCommas(prizePoolAmount);

// Set the formatted prize pool as the content of the element
prizePoolElement.textContent = formattedPrizePool;