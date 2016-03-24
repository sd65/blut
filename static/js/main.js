// jQuery is loaded

function formatedNowDate() {
  var now = new Date();
  return now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
}

// Lauch foundation JS
$(document).foundation();

// Visual Tweaks
$("#profileDropdown").css("width", $("#profileButton").innerWidth());
$(".fullPage").css("min-height", $(window).innerHeight() - $(".top-bar").innerHeight() - $("#footer").innerHeight());

function createInputMap(idInput, idMap, iconName) {
  var defaultPosition = {lat: 49.1, lng: 2.19};
  
  var map = new google.maps.Map(document.getElementById(idMap), {
    center: defaultPosition,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  var input = document.getElementById(idInput);
  var searchBox = new google.maps.places.SearchBox(input);
  var iconBase = "https://maps.google.com/mapfiles/kml/paddle/"
  var icon = {
    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
    scale: 6
  }
  // For now
  icon = null;
  var marker = new google.maps.Marker({
    position: defaultPosition,
    map: map,
    icon: icon
  });

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  
  var geocoder = new google.maps.Geocoder();
  map.addListener('click', function(event) {
    var place = event.latLng;
    geocoder.geocode( {'latLng': place},
      function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
          var address = results[0].formatted_address;
          var city = getCity(results[0]);
          setMapsAttributes(input, place, address, city);
        } else
          address = "Can't get the address.";
        input.value = address;
      });
    marker.setPosition(place);
  });
  
  searchBox.addListener('places_changed', function() {
    var place = searchBox.getPlaces()[0].geometry.location;
    var city = getCity(searchBox.getPlaces()[0]);
    var fullName = searchBox.getPlaces()[0].formatted_address;
    setMapsAttributes(input, place, fullName, city);
    marker.setPosition(place);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(place);
    map.fitBounds(bounds);
    map.setZoom(13);
  });
}

function getCity(place) {
  var s = place.address_components;
  for (var i=0 ; i < s.length ; i++) {
    if (s[i].types[0] == "locality") 
      return s[i].long_name
  };
  return "Inconnu";
}

function setMapsAttributes(myInput, latLng, fullName, city) {
    var mylatLng = String(latLng).replace("(","[").replace(')',']');
    myInput.setAttribute("data-latlng", mylatLng);
    myInput.setAttribute("data-address", fullName.replace(", France",""));
    myInput.setAttribute("data-city", city);
}

function createJourneyMap(from, to, idMap) {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById(idMap), {
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
