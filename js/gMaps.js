function createInputMap(idInput, idMap) {
  var defaultPosition = {lat: 49.1, lng: 2.19};
  
  var map = new google.maps.Map(document.getElementById(idMap), {
    center: defaultPosition,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  var input = document.getElementById(idInput);
  var searchBox = new google.maps.places.SearchBox(input);
  var marker = new google.maps.Marker({
    position: defaultPosition,
    map: map
  });

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  
  var geocoder = new google.maps.Geocoder();
  map.addListener('click', function(event) {
    var place = event.latLng;
    var address;
    geocoder.geocode( {'latLng': place},
      function(results, status) {
        if(status == google.maps.GeocoderStatus.OK)
          address = results[0].formatted_address;
        else
          address = "Can't get the address.";
        input.value = address;
      });
    marker.setPosition(place);
  });
  
  searchBox.addListener('places_changed', function() {
    var place = searchBox.getPlaces()[0].geometry.location;
    marker.setPosition(place);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(place);
    map.fitBounds(bounds);
    map.setZoom(13);
});
}

function initMap(from, to) {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
  });
  directionsDisplay.setMap(map);

  directionsService.route({
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
