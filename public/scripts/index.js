async function initMap() {
    const response = await fetch('/maps');
    const locations = await response.json();
    const center = { lat: 34.052235, lng: -118.243683 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center
    });

    var infowindow = new google.maps.InfoWindow({});
    locations.forEach(location => {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.latitude, location.longitude),
            map: map,
            title: location.name
        });

        google.maps.event.addListener(marker, 'click', function () {
            const contentString = `${location.name}<br>${location.description}<br><a href="${location.directionsLink}">Get Directions</a>`;
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    });
}

document.addEventListener('DOMContentLoaded', initMap);
