let search = document.querySelector(".fullscreen-search-container");
let searchButton = document.querySelector(".search-container");
let closeSearch = document.querySelector(".fullscreen-icon-tabler-x");
let hamburger = document.querySelector(".navbar-icon");
let navbar = document.querySelector(".navbar");
let closeMenu = document.querySelector(".close-menu-button");
var body = document.body;

searchButton.onclick = function () {
  search.classList.toggle("active");
  document.getElementById("searchInput").focus();
};

closeSearch.onclick = function () {
  search.classList.toggle("active");
};

hamburger.onclick = function () {
  navbar.classList.toggle("active");
};

closeMenu.onclick = function () {
  navbar.classList.toggle("active");
};

function debounce(func, delay) {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

const debouncedPlayerSearch = debounce(performPlayerSearch, 200);

const debouncedEventSearch = debounce(performEventSearch, 200);

const debouncedTeamSearch = debounce(performTeamSearch, 200);

var userInputField = document.getElementById("searchInput");
userInputField.addEventListener("input", debouncedPlayerSearch);
userInputField.addEventListener("input", debouncedEventSearch);
userInputField.addEventListener("input", debouncedTeamSearch);

function performPlayerSearch() {
  var query = document.getElementById("searchInput").value;
  console.log("Player Search Query:", query);

  fetch("/search?query=" + query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Player Search: Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Player Search Data:", data);
      updatePlayerResults(data.players);
      updateResultsDisplay();
    })
    .catch((error) => console.error("Player Search Error:", error));
}

function updatePlayerResults(players) {
  var playerResults = document.getElementById("playerResults");
  playerResults.innerHTML = "";

  players.sort(function (a, b) {
    if (
      a.team &&
      a.team.image !== undefined &&
      (!b.team || b.team.image === undefined)
    ) {
      return -1;
    }
    if (
      (!a.team || a.team.image === undefined) &&
      b.team &&
      b.team.image !== undefined
    ) {
      return 1;
    }
    return 0;
  });

  players.forEach(function (player) {
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

    divWrapper.addEventListener("click", function () {
      window.location.href = "/player/" + player._id;
    });

    function updateResultsDisplay() {
      var itemCount = document.querySelectorAll(
        "#playerResults .results-item"
      ).length;

      if (itemCount >= 8) {
        document.getElementById("playersMoreResults").style.display = "flex";
      } else {
        document.getElementById("playersMoreResults").style.display = "none";
      }
    }

    updateResultsDisplay();

    var userInputField = document.getElementById("searchInput");

    userInputField.addEventListener("input", function () {
      updateResultsDisplay();
    });

    playerResults.appendChild(divWrapper);
  });
}

function updateResultsDisplay() {
  var teamItemCount = document.querySelectorAll(
    "#teamResults .results-item"
  ).length;
  var playerItemCount = document.querySelectorAll(
    "#playerResults .results-item"
  ).length;

  if (teamItemCount >= 8) {
    document.getElementById("teamsMoreResults").style.display = "flex";
  } else {
    document.getElementById("teamsMoreResults").style.display = "none";
  }

  if (playerItemCount >= 8) {
    document.getElementById("playersMoreResults").style.display = "flex";
  } else {
    document.getElementById("playersMoreResults").style.display = "none";
  }
}

updateResultsDisplay();

var userInputField = document.getElementById("searchInput");

userInputField.addEventListener("input", function () {
  performSearch();
});

function performEventSearch() {
  var query = document.getElementById("searchInput").value;
  console.log("Event Search Query:", query);

  fetch("/search?query=" + query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Event Search: Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Event Search Data:", data);
      var sortedEvents = data.events.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      updateEventResults(sortedEvents);
      updateResultsDisplay();
    })
    .catch((error) => console.error("Event Search Error:", error));
}

function updateEventResults(events) {
  var eventResults = document.getElementById("tournamentResults");
  eventResults.innerHTML = "";

  events.forEach(function (event) {
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
      if (event.tier == "S" || event.tier == "A" || event.tier == "B" || event.tier == "C" || event.tier == "D") {
        pTier.textContent = event.tier + "-Tier";
      } else {
        pTier.textContent = event.tier;
      }
      divDetails.appendChild(pTier);
    }

    if (event.region) {
      var pRegion = document.createElement("p");
      pRegion.classList.add("event-region");
      pRegion.textContent = event.region;
      divDetails.appendChild(pRegion);
    }

    divWrapper.addEventListener("click", function () {
      window.location.href = "/event/" + event._id;
    });

    function updateResultsDisplay() {
      var itemCount = document.querySelectorAll(
        "#tournamentResults .event-results-item"
      ).length;

      if (itemCount >= 4) {
        document.getElementById("tourneyMoreResults").style.display = "flex";
      } else {
        document.getElementById("tourneyMoreResults").style.display = "none";
      }
    }

    updateResultsDisplay();

    var userInputField = document.getElementById("searchInput");

    userInputField.addEventListener("input", function () {
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
    .then((response) => {
      if (!response.ok) {
        throw new Error("Team Search: Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Team Search Data:", data);
      updateTeamResults(data.teams);
    })
    .catch((error) => console.error("Team Search Error:", error));
}
function fetchActiveTeams() {
  fetch("/active-teams")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Active Teams: Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Active Teams Data:", data);
      updateTeamResults(data.teams, data.active_teams);
    })
    .catch((error) => console.error("Active Teams Error:", error));
}

function updateTeamResults(teams, active_teams) {
  var teamResults = document.getElementById("teamResults");
  teamResults.innerHTML = "";

  if (active_teams) {
    active_teams.forEach(function (activeTeam) {
      var divWrapper = createTeamElement(activeTeam);
      teamResults.appendChild(divWrapper);
    });
  }

  if (teams) {
    teams.forEach(function (team) {
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

  divWrapper.addEventListener("click", function () {
    window.location.href = "/team/" + team._id;
  });

  return divWrapper;
}

function performSearch() {
  debouncedPlayerSearch();
  debouncedTeamSearch();
  debouncedEventSearch();
}

function convertUTCtoDateOnly(utcDateString) {
  var dateParts = new Date(utcDateString);

  var year = dateParts.getFullYear();
  var month = dateParts.getMonth();
  var num_day = dateParts.getDate();
  var day = dateParts.getDay();
  var timeHours = dateParts.getHours();
  var timeMinutes = dateParts.getMinutes();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var monthOfYear = monthNames[month];
  var dayOfWeek = dayNames[day];

  if (timeMinutes == 0) {
    timeMinutes = "00";
  }

  if ((timeMinutes < 10) & (timeMinutes > 0)) {
    timeMinutes = "0" + timeMinutes;
  }

  if (timeHours > 12) {
    timeHours = timeHours - 12 + ":" + timeMinutes + " PM";
  }

  if (timeHours < 12) {
    timeHours = timeHours + ":" + timeMinutes + " AM";
  }

  if (timeHours == 12) {
    timeHours = timeHours + ":" + timeMinutes + " PM";
  }

  var prettyDate =
    dayOfWeek +
    ", " +
    monthOfYear +
    " " +
    num_day +
    ", " +
    year +
    " @" +
    timeHours;

  return prettyDate;
}

var dateElements = document.querySelectorAll(
  ".event-start-date, .event-end-date, .match-date, .match-date-header"
);

dateElements.forEach(function (element) {
  var utcDateString = element.getAttribute("data-utc");

  var formattedDate = convertUTCtoDateOnly(utcDateString);

  element.textContent = formattedDate;
});

function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = '/static/images/rocketleague.svg';
}