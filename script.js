const pages = document.querySelectorAll('.page');
const x = document.getElementById("demo");
let data = [];
let current = 0;
let watchId;

fetch('data.csv')
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.trim().split('\n');
    data = rows.slice(1).map(row => row.split(','));
	data = data.map(row => row.map(Number));
    console.log(data);
	
  })
  .catch(error => {
    console.error('Error fetching CSV:', error);
  });
 

function flipNext() {
  if (current < pages.length-1) {
    pages[current].classList.add('flipped');
    current++;
  }
}

function flipPrev() {
  if (current > 0) {
    current--;
    pages[current].classList.remove('flipped');
  }
}

// coordinate stuff
function checkCoords() {
  document.getElementById("checkCoords").disabled = true;
  x.innerHTML = "Laden..."
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 25000, enableHighAccuracy: true,timeout: 5000});
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
	document.getElementById("checkCoords").disabled = false;
  }
}

function areCoordsClose(lat1, lon1, lat2, lon2, maxDistanceMeters = 50) {
  const toRad = x => x * Math.PI / 180;

  const R = 6371000; // Earth's radius in meters
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dphi = toRad(lat2 - lat1);
  const dlabda = toRad(lon2 - lon1);

  const a = Math.sin(dphi / 2) ** 2 +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dlabda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance <= maxDistanceMeters;
}

function success(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
  document.getElementById("checkCoords").disabled = false;
  
  if (areCoordsClose(position.coords.latitude, position.coords.longitude, data[current][0], data[current][1], maxDistanceMeters = 50)) {
	  alert("Hütta is in de buurt.");
  } else{
	  alert("Hier is geen Hütta");
  }
}

function error() {
  alert("Sorry, no position available.");
}


 
// Button support
document.getElementById('nextBtn').addEventListener('click', flipNext);
document.getElementById('prevBtn').addEventListener('click', flipPrev);
document.getElementById('checkCoords').addEventListener('click', checkCoords);

// Touchscreen swipe support
let touchStartX = 0;
let touchEndX = 0;
const threshold = 50; // Minimum distance to detect swipe

document.querySelector('.book-container').addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.querySelector('.book-container').addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) > threshold) {
    if (swipeDistance < 0) {
      // Swipe left → Next
      flipNext();
    } else {
      // Swipe right → Previous
      flipPrev();
    }
  }
}