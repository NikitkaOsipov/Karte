// Initialize the map
const map = L.map('map').setView([56.8796, 24.6032], 7); // Centered on Latvia

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function loadJSON() {
    try {
        const response = await fetch('vietas.json');
        const data = await response.json();
        const places = getPlacesArray(data);
        console.log('Places array:', places); // Debugging statement
        addMarkersToMap(places);
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

// Function to get an array of places
function getPlacesArray(data) {
    const placesArray = [];
    data.features.forEach(feature => {
        const place = {
            name: feature.properties.PLACENAME,
            type: feature.properties.PLACESUBTY,
            regionCode: feature.properties.REG_CODE,
            lvmDistrict: feature.properties.LVM_DISTRI,
            blockKey: feature.properties.BLOCKKEY,
            coordinates: feature.geometry.coordinates
        };
        placesArray.push(place);
    });
    return placesArray;
}

// Function to add markers to the map
function addMarkersToMap(places) {
    places.forEach(place => {
        const latLng = LKS92WGS84.convertXYToLatLon(place.coordinates);
        // const latLng = L.latLng(y, x); // Leaflet uses [lat, lng] format
        L.marker(latLng)
        .bindPopup(`<b>${place.name}</b><br>
            Type: ${place.type}<br>
            Region Code: ${place.regionCode}<br>
            LVM District: ${place.lvmDistrict}<br>
            Block Key: ${place.blockKey}<br>
            Coordinates: ${place.coordinates.join(', ')}`)            
            .addTo(map);
    });
}

// Load the JSON data when the page loads
window.onload = loadJSON;