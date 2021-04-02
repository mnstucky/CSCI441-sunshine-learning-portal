//const { doc } = require("prettier");

document.addEventListener("readystatechange", e => {
    if (e.target.readyState === "complete") {
        //loadData();
        loadTracks();
    }
});

async function loadTracks() {
    // pull data for the track user has started/completed
    const data = await fetch("/api?action=getusertracks");
    const formatted = await data.json();
    
    let dropdown = document.getElementById("studentTracks");
    dropdown.length = 0;
    let option;
    
    // add an item for each track  user has started/completed
    for (var key in formatted) 
    {
        option = document.createElement('option');
        option.label = formatted[key].trackname;
        option.value = formatted[key].trackid;
        dropdown.add(option);
    } 
    
    // set title of leader table
    let track = dropdown;
    let trackText = track.options[track.selectedIndex].label;
    document.getElementById("selectedTrack").innerHTML = "The leaders for the " + trackText + " track are below";

    // populate leader table
    loadLeaders();
}

// clear values in leader table
function removeLeaders() {
    document.getElementById("leadersBody").innerHTML = "";
}

// populate leader table
async function loadLeaders() {
    // clear values in leader table
    removeLeaders();

    let track = document.getElementById("studentTracks");;
    
    // set title of leader table
    let trackText = track.options[track.selectedIndex].label;
    document.getElementById("selectedTrack").innerHTML = "The leaders for the " + trackText + " track are";

    // pull data for leader table
    const data = await fetch("/api?action=gettop10&track=" + track.value);
    const formatted = await data.json();
    
    // add a row for each user returned
    for (var key in formatted) 
    {
        const table = document.getElementById("leadersBody");
        let tableRow = table.insertRow();
        let tableUser = tableRow.insertCell(0);
        tableUser.style.width = '80%';
        tableUser.innerHTML = formatted[key].firstname + " " + formatted[key].lastname;
        let tableScore = tableRow.insertCell(1);
        tableScore.style.textAlign = "right";
        tableScore.innerHTML = `${formatted[key].postscore / 5 * 100}%`;
    }

    // show user's score for selected track
    loadUserTrackResult(trackText); 
}

// show user's score for selected track
async function loadUserTrackResult(trackName) {
    let track = document.getElementById("studentTracks");
    const data = await fetch ("/api?action=getresults&track=" + track.value);
    const formatted = await data.json();
    document.getElementById("userResults").innerHTML = "Your score for the " + trackName + " track is " + (formatted.postscore / 5 * 100) + "%";
}

// reload leader table and user's score when new track is selected
document.getElementById("studentTracks").addEventListener("change", function() {
    loadLeaders();
});


// password