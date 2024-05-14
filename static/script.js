let search = document.querySelector('.fullscreen-search-container');
let searchButton = document.querySelector('.search-container');
let closeSearch = document.querySelector('.x-icon');
let hamburger = document.querySelector('.navbar-icon');
let navbar = document.querySelector('.navbar');
let closeMenu = document.querySelector('.close-menu-button');
var body = document.body;
var page = 1;

searchButton.onclick = function() {
    search.classList.toggle('active');
};

closeSearch.onclick = function() {
    search.classList.toggle('active');
};

hamburger.onclick = function() {
    navbar.classList.toggle('active');
};

closeMenu.onclick = function() {
    navbar.classList.toggle('active');
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
    debouncedTeamSearch();
    debouncedEventSearch();
}

// Function to convert UTC date string to date only format (YYYY-MM-DD)
function convertUTCtoDateOnly(utcDateString) {
    var dateParts = utcDateString.split('T')[0];
    return dateParts;
}

// Get the elements by class name
var dateElements = document.querySelectorAll('.event-start-date, .event-end-date, .match-date, .match-date-header');

// Loop through each element
dateElements.forEach(function(element) {
    // Get the UTC date string from the data attribute
    var utcDateString = element.getAttribute('data-utc');

    // Convert the UTC date string to the desired format
    var formattedDate = convertUTCtoDateOnly(utcDateString);

    // Set the formatted date as the content of the element
    element.textContent = formattedDate;
});


//player page searching

// Function to update player search results
function updatePlayerPageResults() {
    var query = document.getElementById("playerSearchInput").value;
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
            clearPlayerResults(); // Clear previous player results
            updatePlayerResultsPage(data.players); // Update player results with new data
        })
        .catch(error => console.error('Player Search Error:', error));
}

function clearPlayerResults() {
    var playerResults = document.getElementById("playerResultsCard");
    playerResults.innerHTML = "";
}

function updatePlayerResultsPage(players) {
    var playerResults = document.getElementById("playerResultsCard");

    players.sort(function(a, b) {
        if (a.team && a.team.image !== undefined && (!b.team || b.team.image === undefined)) {
            return -1;
        }
        if ((!a.team || a.team.image === undefined) && b.team && b.team.image !== undefined) {
            return 1;
        }
        return 0;
    });

    players.forEach(function(player) {
        var divWrapper = document.createElement("div");
        var divTagWrapper = document.createElement("div");
        divWrapper.classList.add("results-item");
        divTagWrapper.classList.add("player-card-tags");

        if (player.tag.trim() !== "") {
            var divTag = document.createElement("div"); 
            divTag.classList.add("player-tag");
            divTag.textContent = player.tag; 
            divWrapper.appendChild(divTag);
        }

        if (player.name) {
            var pName = document.createElement("p");
            pName.classList.add("player-name");
            pName.textContent = player.name; 
            divWrapper.appendChild(pName);
        }

        if (player.team && player.team.image !== undefined) {
            var teamDiv = document.createElement("div");
            var img = document.createElement("img"); 
            img.classList.add("team-image"); 
            img.src = player.team.image; 
            img.alt = player.team.name; 
            teamDiv.appendChild(img); 
            divWrapper.appendChild(teamDiv);
        }

        if (player.country) {
            var pCountry = document.createElement("p");
            pCountry.classList.add("player-country");
            pCountry.textContent = player.country;
            divTagWrapper.appendChild(pCountry);
            divWrapper.appendChild(divTagWrapper);
        }

        if (player.coach) {
            var pCoach = document.createElement("p"); 
            pCoach.classList.add("player-coach-tag");
            pCoach.textContent = "Coach";
            divTagWrapper.appendChild(pCoach);
            divWrapper.appendChild(divTagWrapper);
        } else if (player.substitute) {
            var pSub = document.createElement("p"); 
            pSub.classList.add("player-sub-tag");
            pSub.textContent = "Substitute";
            divTagWrapper.appendChild(pSub);
            divWrapper.appendChild(divTagWrapper);
        } else {
            var pPlayer = document.createElement("p"); 
            pPlayer.classList.add("player-player-tag");
            pPlayer.textContent = "Player";
            divTagWrapper.appendChild(pPlayer);
            divWrapper.appendChild(divTagWrapper);
        }

        divWrapper.addEventListener('click', function() {
            window.location.href = '/player/' + player._id;
        });

        playerResults.appendChild(divWrapper);
    });
}

document.getElementById('playerSearchInput').addEventListener('input', updatePlayerPageResults);

//team page searching

function updateTeamPageResults() {
    var query = document.getElementById("teamSearchInput").value;
    console.log("Team Search Query:", query);

    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Team Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Team Search Data:', data);
            clearTeamResults();
            updateTeamResultsPage(data.teams); 
        })
        .catch(error => console.error('Team Search Error:', error));
}

function clearTeamResults() {
    var teamResults = document.getElementById("teamResultsCard");
    teamResults.innerHTML = "";
}

function updateTeamResultsPage(teams) {
    var teamResults = document.getElementById("teamResultsCard");

    teams.sort(function(a, b) {
        if (a.team && a.team.image !== undefined && (!b.team || b.team.image === undefined)) {
            return -1;
        }
        if ((!a.team || a.team.image === undefined) && b.team && b.team.image !== undefined) {
            return 1;
        }
        return 0;
    });

    teams.forEach(function(team) {
        var divWrapper = document.createElement("div");
        var divTagWrapper = document.createElement("div");
        divWrapper.classList.add("results-item");
        divTagWrapper.classList.add("team-card-tags");

        if (team.name.trim() !== "") {
            var divTag = document.createElement("div"); 
            divTag.classList.add("team-name");
            divTag.textContent = team.name;
            divWrapper.appendChild(divTag);
        }

        if (team.image !== undefined) {
            var teamDiv = document.createElement("div");
            var img = document.createElement("img"); 
            img.classList.add("team-image"); 
            img.src = team.image; 
            img.alt = team.name;
            teamDiv.appendChild(img); 
            divWrapper.appendChild(teamDiv);
        }

        if (team.region) {
            var pCountry = document.createElement("p");
            pCountry.classList.add("team-region");
            pCountry.textContent = team.region;
            divTagWrapper.appendChild(pCountry);
            divWrapper.appendChild(divTagWrapper);
        }

        divWrapper.addEventListener('click', function() {
            window.location.href = '/team/' + team._id;
        });

        teamResults.appendChild(divWrapper);
    });
}

document.getElementById('teamSearchInput').addEventListener('input', updateTeamPageResults);


//event page searching

function updateEventPageResults() {
    var query = document.getElementById("eventSearchInput").value;
    console.log("Event Search Query:", query);

    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Event Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Event Search Data:', data);
            clearEventResults();
            updateEventResultsPage(data.events);
        })
        .catch(error => console.error('Event Search Error:', error));
}

function clearEventResults() {
    var eventResults = document.getElementById("eventResultsCard");
    eventResults.innerHTML = "";
}

function updateEventResultsPage(events) {
    var eventResults = document.getElementById("eventResultsCard");

    events.forEach(function(event) {
        var divWrapper = document.createElement("div");
        var divTagWrapper = document.createElement("div");
        divWrapper.classList.add("results-item");
        divTagWrapper.classList.add("event-card-tags");

        if (event.name.trim() !== "") {
            var divTag = document.createElement("div"); 
            divTag.classList.add("event-name");
            divTag.textContent = event.name;
            divWrapper.appendChild(divTag);
        }

        if (event.image !== undefined) {
            var eventDiv = document.createElement("div");
            var img = document.createElement("img");
            img.classList.add("event-image");
            img.src = event.image;
            img.alt = event.name;
            eventDiv.appendChild(img);
            divWrapper.appendChild(eventDiv);
        }

        if (event.region) {
            var pCountry = document.createElement("p");
            pCountry.classList.add("event-region");
            pCountry.textContent = event.region;
            divTagWrapper.appendChild(pCountry);
            divWrapper.appendChild(divTagWrapper);
        }

        if (event.tier) {
            var pTier = document.createElement("p");
            pTier.classList.add("event-tier");
            pTier.textContent = event.tier;
            divTagWrapper.appendChild(pTier);
            divWrapper.appendChild(divTagWrapper);
        }

        divWrapper.addEventListener('click', function() {
            window.location.href = '/event/' + event._id;
        });

        eventResults.appendChild(divWrapper);
    });
}

document.getElementById('eventSearchInput').addEventListener('input', updateEventPageResults);