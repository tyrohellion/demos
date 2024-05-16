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

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedPlayerSearch = debounce(performPlayerSearch, 200);

const debouncedEventSearch = debounce(performEventSearch, 200);

const debouncedTeamSearch = debounce(performTeamSearch, 200);

var userInputField = document.getElementById('searchInput');
userInputField.addEventListener('input', debouncedPlayerSearch);
userInputField.addEventListener('input', debouncedEventSearch);
userInputField.addEventListener('input', debouncedTeamSearch);

function performPlayerSearch() {
    var query = document.getElementById("searchInput").value;
    console.log("Player Search Query:", query);

    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Player Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Player Search Data:', data);
            updatePlayerResults(data.players);
            updateResultsDisplay();
        })
        .catch(error => console.error('Player Search Error:', error));
}

function updatePlayerResults(players) {
    var playerResults = document.getElementById("playerResults");
    playerResults.innerHTML = "";

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
        divWrapper.classList.add("results-item");

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
        } else {
            divWrapper.style.paddingTop = "0"; 
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

        divWrapper.addEventListener('click', function() {
            window.location.href = '/player/' + player._id; 
        });

        function updateResultsDisplay() {
            var itemCount = document.querySelectorAll('#playerResults .results-item').length;

            if (itemCount >= 8) {
                document.getElementById('playersMoreResults').style.display = 'flex';
            } else {
                document.getElementById('playersMoreResults').style.display = 'none';
            }
        }

        updateResultsDisplay();
        
        var userInputField = document.getElementById('searchInput');
        
        userInputField.addEventListener('input', function() {
            updateResultsDisplay();
        });

        playerResults.appendChild(divWrapper); 
    });
}

function updateResultsDisplay() {
    var teamItemCount = document.querySelectorAll('#teamResults .results-item').length;
    var playerItemCount = document.querySelectorAll('#playerResults .results-item').length;

    if (teamItemCount >= 8) {
        document.getElementById('teamsMoreResults').style.display = 'flex';
    } else {
        document.getElementById('teamsMoreResults').style.display = 'none';
    }

    if (playerItemCount >= 8) {
        document.getElementById('playersMoreResults').style.display = 'flex';
    } else {
        document.getElementById('playersMoreResults').style.display = 'none';
    }
}

updateResultsDisplay();

var userInputField = document.getElementById('searchInput');

userInputField.addEventListener('input', function() {
    performSearch();
});

function performEventSearch() {
    var query = document.getElementById("searchInput").value;
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
            var sortedEvents = data.events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            updateEventResults(sortedEvents);
            updateResultsDisplay();
        })
        .catch(error => console.error('Event Search Error:', error));
}

function updateEventResults(events) {
    var eventResults = document.getElementById("tournamentResults");
    eventResults.innerHTML = "";

    events.forEach(function(event) {
        var divWrapper = document.createElement("div"); 
        divWrapper.classList.add("event-results-item");

        if (event.name) {
            var pName = document.createElement("p");
            pName.classList.add("event-name"); 
            pName.textContent = event.name; 
            divWrapper.appendChild(pName); 
        }

        if (event.image !== undefined) {
            var img = document.createElement("img");
            img.classList.add("event-image");
            img.src = event.image;
            img.alt = event.name;
            divWrapper.appendChild(img);
        }

        var divDetails = document.createElement("div");
        divDetails.classList.add("event-details");

        if (event.tier) {
            var pTier = document.createElement("p"); 
            pTier.classList.add("event-tier"); 
            pTier.textContent = event.tier; 
            divDetails.appendChild(pTier); 
        }

        if (event.region) {
            var pRegion = document.createElement("p"); 
            pRegion.classList.add("event-region"); 
            pRegion.textContent = event.region; 
            divDetails.appendChild(pRegion); 
        }

        divWrapper.addEventListener('click', function() {
            window.location.href = '/event/' + event._id; 
        });

        function updateResultsDisplay() {
            var itemCount = document.querySelectorAll('#tournamentResults .event-results-item').length;
        
            if (itemCount >= 4) {
                document.getElementById('tourneyMoreResults').style.display = 'flex';
            } else {
                document.getElementById('tourneyMoreResults').style.display = 'none';
            }
        }

        updateResultsDisplay();

        var userInputField = document.getElementById('searchInput');

        userInputField.addEventListener('input', function() {
            updateResultsDisplay();
        });

        divWrapper.appendChild(divDetails); 
        eventResults.appendChild(divWrapper); 
    });
}

function performTeamSearch() {
    var query = document.getElementById("searchInput").value;
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
            updateTeamResults(data.teams);
        })
        .catch(error => console.error('Team Search Error:', error));
}
function fetchActiveTeams() {
    fetch("/active-teams")
        .then(response => {
            if (!response.ok) {
                throw new Error('Active Teams: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Active Teams Data:', data);
            updateTeamResults(data.teams, data.active_teams);
        })
        .catch(error => console.error('Active Teams Error:', error));
}

function updateTeamResults(teams, active_teams) {
    var teamResults = document.getElementById("teamResults");
    teamResults.innerHTML = "";

    if (active_teams) {
        active_teams.forEach(function(activeTeam) {
            var divWrapper = createTeamElement(activeTeam);
            teamResults.appendChild(divWrapper);
        });
    }

    if (teams) {
        teams.forEach(function(team) {
            var divWrapper = createTeamElement(team);
            teamResults.appendChild(divWrapper);
        });
    }

    updateResultsDisplay();
}

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

function performSearch() {
    debouncedPlayerSearch();
    debouncedTeamSearch();
    debouncedEventSearch();
}

function convertUTCtoDateOnly(utcDateString) {
    var dateParts = utcDateString.split('T')[0];
    return dateParts;
}

var dateElements = document.querySelectorAll('.event-start-date, .event-end-date, .match-date, .match-date-header');

dateElements.forEach(function(element) {
    var utcDateString = element.getAttribute('data-utc');

    var formattedDate = convertUTCtoDateOnly(utcDateString);

    element.textContent = formattedDate;
});


//player page searching

function updatePlayerPageResults() {
    var query = document.getElementById("playerSearchInput").value;
    console.log("Player Search Query:", query); 

    fetch("/search?query=" + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Player Search: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Player Search Data:', data); 
            clearPlayerResults();
            updatePlayerResultsPage(data.players);
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
