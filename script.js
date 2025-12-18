const pages = document.querySelectorAll('.page');
const x = document.getElementById("demo");
const pointcounter = document.querySelector(".pointcounter")
const stamps = document.querySelectorAll('.stamp')
const tinystamps = document.querySelectorAll('.tinystamp')

const params = new URLSearchParams(window.location.search);
const token = 7;

let foundArray = [];
let data = [];
let tpa = [];
let totalpoints = 0;

console.log("hi");
//console.log(pointcounter);
//console.log(tinystamps);


// Data gathering
// For the hut coordinates.
fetch('data.csv')
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.trim().split('\n');
    data = rows.slice(1).map(row => row.split(','));
	data = data.map(row => row.map(Number));
    //console.log(data);
	
  })
  .catch(error => {
    console.error('Error fetching CSV:', error);
  });
  
// Points Array
const points = [0,0,0,0,0,25,25,25,75,50,75,50,50,100,150,100,100,100,25,75,50,100,25,50,75,100,150,100,25,25,50,75,100,50,50,75,150,0];
//console.log(points);

// Get current data
let current = localStorage.getItem('current');
let storagetoken = localStorage.getItem('token')

if (current) {
  console.log('Current Data already exists!');
  current = JSON.parse(current);
} else {
  console.log('No Current data found — initializing new array.');
  current = 1
  localStorage.setItem('current', JSON.stringify(current));
}

// Get token data.
if (storagetoken) {
  console.log('Storage token data already exists!');
  storagetoken = JSON.parse(storagetoken);
  if (token !== storagetoken) {
    deleteData();
    console.log('storage token incorrect — initializing new data.');
    storagetoken = token;
    localStorage.setItem('token', JSON.stringify(token));
  }

} else {
  console.log('No storage token data found — initializing new data.');
  deleteData();
  storagetoken = token;
  localStorage.setItem('token', JSON.stringify(token));
}



console.log("current page: " + current);

// Get found data.
const found = localStorage.getItem('found');

if (found) {
  console.log('Data already exists!');
  foundArray = JSON.parse(found);
  //console.log(foundArray);
} else {
  console.log('No data found — initializing new array.');
  foundArray = Array(pages.length).fill(0);
  localStorage.setItem('found', JSON.stringify(foundArray));
}
 
function updateImages() {
	//Reset the text bubble.
	x.innerHTML = ""
  for (let i = 0; i < pages.length; i++) {
	// Make stamps visible
	if (foundArray[i] === 1) {
		stamps[i].classList.add('visible');
		tinystamps[i-5]?.classList.add('visible');
	} else {
		stamps[i].classList.remove('visible');
		tinystamps[i-5]?.classList.remove('visible');
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
  
  // Count total points.
	tpa = points.map((v, i) => v * foundArray[i]);
	totalpoints = tpa.reduce((total, num) => total + (Number(num) || 0), 0);
	pointcounter.innerHTML = "Punkte: " + totalpoints;
	if (totalpoints >= 1275) {
		pointcounter.style.color = "DarkGoldenRod";
	} else if (totalpoints >= 850){
		pointcounter.style.color = "DarkGray"
	} else if (totalpoints >= 425) {
		pointcounter.style.color = "Sienna"		
	} else {
		pointcounter.style.color = "black"		
	}

  
  // Logger
  //x.innerHTML = current;
  //console.log(totalpoints);
  //console.log(foundArray);
}

if (params.has('reset')) {
  deleteData();
  
  params.delete('reset');
  const newUrl =
    window.location.pathname +
    (params.toString() ? `?${params}` : '');

  window.location.replace(newUrl);
}

if (params.has('Seraph7')) {
  add1Data();
  
  params.delete('Seraph7');
  const newUrl =
    window.location.pathname +
    (params.toString() ? `?${params}` : '');

  window.location.replace(newUrl);
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

function flipQuick(n) {
	current = n;
	updateImages();
}


// coordinate stuff
function checkCoords(n) {
  document.getElementById("checkCoords").disabled = true;
  x.innerHTML = "Laden..."
  if (foundArray[n-1] === 0) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => success(position, n), error, {maximumAge: 20000, enableHighAccuracy: true, timeout: 5000});
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
	  document.getElementById("checkCoords").disabled = false;
    }
  } else {
	  x.innerHTML = "Hütta al gevonden!"
	  document.getElementById("checkCoords").disabled = false;
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
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
  document.getElementById("checkCoords").disabled = false;
  
  if (areCoordsClose(position.coords.latitude, position.coords.longitude, data[current-1][0], data[current-1][1], maxDistanceMeters = 50)) {
	  foundArray[n-1] = 1;
	  updateFound();
	  x.innerHTML = "Hütta gevonden!";
  } else{
	  x.innerHTML = "Geen Hütta!";
  }
}

function error() {
  x.innerHTML = "GPS is te langzaam. Probeer het nog eens.";
  document.getElementById("checkCoords").disabled = false;
}

//Delete local storage data.
function deleteData () {
	localStorage.clear();
	foundArray = Array(pages.length).fill(0);
	x.innerHTML = "Data verwijderd."
	updateImages();
}

//Add all storage data.
function addData () {
	foundArray = Array(pages.length).fill(1,5);
	updateFound();
	x.innerHTML = "Data toegevoegd."
	updateImages();
}

function add1Data () {
	foundArray[current-1] = 1;
	updateFound();
	x.innerHTML = "Hütta gevonden!";
	updateImages();
}
 
// Button support
	// Quick travel buttons
document.getElementById('indexBtn').addEventListener('click', () => {flipQuick(4);});
document.getElementById('brixenBtn').addEventListener('click', () => {flipQuick(6);});
document.getElementById('sollBtn').addEventListener('click', () => {flipQuick(19);});
document.getElementById('scheffauBtn').addEventListener('click', () => {flipQuick(23);});
document.getElementById('ellmauBtn').addEventListener('click', () => {flipQuick(29);});
document.getElementById('westendorfBtn').addEventListener('click', () => {flipQuick(34);});

	// next and previous
document.getElementById('nextBtn').addEventListener('click', () => { flipNext(current);});
document.getElementById('prevBtn').addEventListener('click', () => { flipPrev(current);});
	// check coords button
document.getElementById('checkCoords').addEventListener('click', () => { checkCoords(current);});

/* Admin stuff
document.getElementById('delete').addEventListener('click', deleteData);
document.getElementById('add').addEventListener('click', addData);
document.getElementById('add1').addEventListener('click', add1Data);
 */

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