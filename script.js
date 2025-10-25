console.log("hi");
const pages = document.querySelectorAll('.page');
const x = document.getElementById("demo");
const stamps = document.querySelectorAll('.stamp')
let foundArray = [];
let data = [];


// Data gathering
// For the hut coordinates.
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

// Get current data
let current = localStorage.getItem('current');

if (current) {
  console.log('Current Data already exists!');
  current = JSON.parse(current);
  console.log(current);
} else {
  console.log('No Current data found — initializing new array.');
  current = 1
  localStorage.setItem('current', JSON.stringify(current));
}

console.log("current: " + current);

// Get found data.
const found = localStorage.getItem('found');

if (found) {
  console.log('Data already exists!');
  foundArray = JSON.parse(found);
  console.log(foundArray);
} else {
  console.log('No data found — initializing new array.');
  foundArray = Array(pages.length).fill(0);
  localStorage.setItem('found', JSON.stringify(foundArray));
}
 
function updateImages() {
  //x.innerHTML = current;
  for (let i = 0; i < pages.length; i++) {
	// Make stamps visible
	if (foundArray[i] === 1) {
		stamps[i].classList.add('visible');
	} else {
		stamps[i].classList.remove('visible');
	}
	 
	// Add pages after each other 
    //console.log(pages[i]);
	if (current === i || current - 1=== i) {
		pages[i].classList.remove('flipped');
		if (!(i+1 === pages.length)) {
			pages[i+1].classList.remove('flipped');
		}
    } else {
		pages[i].classList.add('flipped');
	}
  }
  localStorage.setItem('current', JSON.stringify(current))
}

function updateFound() {
	localStorage.setItem('found', JSON.stringify(foundArray));
	updateImages();
}

updateImages();

function flipNext(n) {
  if (n < pages.length) {
    current++;
	updateImages();
  }
}

function flipPrev(n) {
  if (n > 1) {
    current--;
    updateImages();
  }
}

// coordinate stuff
function checkCoords(n) {
  document.getElementById("checkCoords").disabled = true;
  x.innerHTML = "Laden..."
  if (foundArray[n-1] === 0) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => success(position, n), error, {maximumAge: 25000, enableHighAccuracy: true,timeout: 5000});
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
	  document.getElementById("checkCoords").disabled = false;
    }
  } else {
	  alert("Hütta al gevonden!")
	  document.getElementById("checkCoords").disabled = false;
	  x.innerHTML = ""
  }
}
  

function areCoordsClose(lat1, lon1, lat2, lon2, maxDistanceMeters = 50) {
  console.log("1: " + lat1 + " - " + lon1);
  console.log("2: " + lat2 + " - " + lon2);
  
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

function success(position, n) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
  document.getElementById("checkCoords").disabled = false;
  
  if (areCoordsClose(position.coords.latitude, position.coords.longitude, data[current-1][0], data[current-1][1], maxDistanceMeters = 50)) {
	  foundArray[n-1] = 1;
	  updateFound();
	  x.innerHTML = "Hütta is in de buurt.";
  } else{
	  x.innerHTML = "Hier is geen Hütta";
  }
}

function error() {
  alert("Sorry, no position available.");
  document.getElementById("checkCoords").disabled = false;
}

//Delete local storage data.
function deleteData () {
	localStorage.clear();
	foundArray = Array(pages.length).fill(0);
	x.innerHTML = "Data verwijderd."
	updateImages();
}

 
// Button support
document.getElementById('nextBtn').addEventListener('click', () => { flipNext(current);});
document.getElementById('prevBtn').addEventListener('click', () => { flipPrev(current);});
document.getElementById('delete').addEventListener('click', deleteData);
document.getElementById('checkCoords').addEventListener('click', () => { checkCoords(current);});

// Touchscreen swipe support
const container = document.querySelector('.book-container');

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const threshold = 50; // minimum distance for swipe
const restraint = 150; // max vertical movement allowed

container.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, false);

container.addEventListener('touchmove', (e) => {
  // Prevent vertical scroll if horizontal movement dominates
  const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
  const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);

  if (diffX > diffY) {
    e.preventDefault(); // stops scrolling
  }
}, { passive: false }); // must be false to use preventDefault

container.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, false);

function handleSwipe() {
  const distX = touchEndX - touchStartX;
  const distY = touchEndY - touchStartY;

  // Only handle horizontal swipes
  if (Math.abs(distX) > threshold && Math.abs(distY) < restraint) {
    if (distX < 0) {
      flipNext(current); // swipe left
    } else {
      flipPrev(current); // swipe right
    }
  }
}