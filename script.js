async function loadPrayerTimes() {
    try {
        let response = await fetch('./prayer-times.json');
        let data = await response.json();

        let today = new Date();
        let month = today.toLocaleString('default', { month: 'long' });
        let day = today.getDate().toString();

        if (data[month] && data[month][day]) {
            updatePrayerTable(data[month][day]);
        } else {
            console.warn("No prayer time data available for today.");
        }
    } catch (error) {
        console.error("Error loading prayer times:", error);
    }
}

function updatePrayerTable(prayerTimes) {
    let prayerIds = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

    prayerIds.forEach(prayer => {
        let row = document.getElementById(prayer);
        if (row) {
            row.cells[1].innerText = prayerTimes[prayer.charAt(0).toUpperCase() + prayer.slice(1)];
        }
    });
}

function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    let formattedHours = hours % 12 || 12;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    
    let timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    
    document.getElementById("clock").innerText = timeString;
    highlightPrayerTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
}

function highlightPrayerTime(currentTime) {
    let rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        let prayerTime = row.cells[1].innerText.trim();
        
        // Only proceed if prayerTime exists and is valid
        if (prayerTime) {
            let formattedPrayerTime = convertTo12HourFormat(prayerTime);
            row.classList.toggle("highlight-row", formattedPrayerTime === currentTime);
        }
    });
}

function convertTo12HourFormat(timeString) {
    if (!timeString) return "";
    
    let parts = timeString.split(' ');
    if (parts.length !== 2) return "";

    let hourMinute = parts[0];
    let period = parts[1];
    let timeParts = hourMinute.split(':');

    if (timeParts.length !== 2) return "";

    let hours = parseInt(timeParts[0], 10);
    let minutes = timeParts[1];

    return `${hours}:${minutes} ${period}`;
}

setInterval(updateClock, 1000);
updateClock();
loadPrayerTimes();
