window.onload = function() {
   $("#date").fdatepicker({
     language: "fr", 
     weekStart: 1,
     format: "dd/mm/yyyy",
     initialDate: formatedNowDate()
   });
  $("#from, #to").each(function(index) {
    var dumb = new google.maps.places.SearchBox(this);
  });
  $("form").on('submit', function (e) {
    e.preventDefault();
    submitOffer(); 
  });
}
