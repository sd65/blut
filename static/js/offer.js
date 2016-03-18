window.onload = function() {
   createInputMap("from", "fromMap");
   createInputMap("to", "toMap");
   $('#twoWay').click(function() {
     $('#twoWayDiv').toggle(); 
   });   
   $("#date, #returnDate").fdatepicker({
     language: "fr", 
     weekStart: 1,
     format: "dd/mm/yyyy",
     initialDate: formatedNowDate()
   });
  $("#addStage").on('click', function() {
      $("#stages").show();
      var i = $("<input/>").addClass("stage input-group-field")
              .attr("type", "text").attr("autocomplete","off")
              .appendTo("#stages").get(0);
      new google.maps.places.SearchBox(i);
  });
  $("form").on('submit', function (e) {
    e.preventDefault();
    submitOffer(); 
  });

}

function getDatetime(selDate, selHour, selMinute) {
  var day=$(selDate).val().split('/')[0];
  var month=$(selDate).val().split('/')[1];
  var year=$(selDate).val().split('/')[2];
  return new Date(year, month, day, $(selHour).val(), $(selMinute).val());
}
  
function submitOffer() {
  var directionsService = new google.maps.DirectionsService;
  directionsService.route({
    origin: $("#from").data("address"),
    destination: $("#to").data("address"),
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      var distance = response.routes[0].legs[0].distance.text;
      var duration = response.routes[0].legs[0].duration.text;
      var durationSeconds = response.routes[0].legs[0].duration.value;
      var datetime = getDatetime("#date", "#hour", "#minute");
      var datetimeArrival = new Date(datetime.getTime() + durationSeconds*1000);
      var returnDatetime = getDatetime("#returnDate", "#returnHour", "#returnMinute");
      var returnDatetimeArrival = new Date(returnDatetime.getTime() + durationSeconds*1000);
      var data = {
        "fromLatLng": $("#from").data("latlng"),  
        "fromAddress": $("#from").data("address"),  
        "fromCity": $("#from").data("city"),  
        "toLatLng": $("#to").data("latlng"),  
        "toAddress": $("#to").data("address"),  
        "toCity": $("#to").data("city"),  
        "datetime": datetime,
        "datetimeArrival": datetimeArrival,
        "stage": $("#stage").val(),  
        "twoWay": $("#twoWay").val(),  
        "returnDatetime": returnDatetime,  
        "returnDatetimeArrival": returnDatetimeArrival,  
        "availableSeats": $("#availableSeats").val(),  
        "comment": $("#comment").val(),  
        "price": $("#price").val(),  
        "distance": distance,
        "duration": duration
      };
     $.ajax({
        url: "/offer",
        method: "POST",
        contentType: "application/JSON; charset=UTF-8",
        data : JSON.stringify(data)      
      }).success(function(data) {
        window.location.href = data;
      }).error(function() {
        console.log("error")
      }); 
    } else {
      window.alert("Nous ne pouvons calculer l'itinéraire :" + status);
    }
  });
}
