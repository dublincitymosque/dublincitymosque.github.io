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
        if (row && prayerTimes[prayer.charAt(0).toUpperCase() + prayer.slice(1)]) {
            let prayerData = prayerTimes[prayer.charAt(0).toUpperCase() + prayer.slice(1)];
            row.cells[1].innerText = prayerData.Adhan;
            row.cells[2].innerText = prayerData.Iqamaah;
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
        let iqamaahTime = row.cells[2].innerText.trim(); // Use Iqamaah time for highlighting
        
        if (iqamaahTime) {
            let formattedIqamaahTime = convertTo12HourFormat(iqamaahTime);
            row.classList.toggle("highlight-row", formattedIqamaahTime === currentTime);
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

function updateDate() {
    let today = new Date();
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = today.toLocaleDateString('en-US', options);
    document.getElementById("date").innerText = `${formattedDate}`;
}

async function updateIslamicDate() {
    try {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        let response = await fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`);
        let data = await response.json();

        if (data.data && data.data.hijri) {
            let hijriDate = data.data.hijri;
            let islamicDateString = `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH`;
            document.getElementById("islamic-date").innerText = `${islamicDateString}`;
        }
    } catch (error) {
        console.error("Error fetching Islamic date:", error);
    }
}

setInterval(updateClock, 1000);
updateClock();
loadPrayerTimes();
updateDate();
updateIslamicDate();
