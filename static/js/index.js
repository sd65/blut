window.onload = function() {
   $("#date").fdatepicker({
     language: "fr", 
     weekStart: 1,
     format: "dd/mm/yyyy",
     initialDate: ""
   });
  $("#from, #to").each(function(index) {
    var el = this;
    var searchBox = new google.maps.places.SearchBox(this);
    searchBox.addListener('places_changed', function() {
      var place = searchBox.getPlaces()[0];
      el.setAttribute("data-latlng", place.geometry.location.toString());
      el.setAttribute("data-city", getCity(place));
    });
  });
  $("form").on('submit', function (e) {
    e.preventDefault();
    submitSearch(); 
  });
}

function submitSearch() {
  var url="/search?"
  if (typeof $("#from").data("latlng") != 'undefined') {
    url += "from=" + encodeURIComponent($("#from").data("latlng"));
    url += "&fromCity=" + encodeURIComponent($("#from").data("city"));
  }
  if (typeof $("#to").data("latlng") != 'undefined') {
    url += "&to=" + encodeURIComponent($("#to").data("latlng"));
    url += "&toCity=" + encodeURIComponent($("#to").data("city"));
  }
  if($("#date").val())
    url +=  "&date" + encodeURIComponent($("#date").val());
  window.location.href = url;
}
