window.onload = function() {
   $("#date").fdatepicker({
     language: "fr", 
     weekStart: 1,
     format: "dd/mm/yyyy",
     initialDate: ""
   });
   var connectSlider = document.getElementById('time');
   var format = wNumb({ 
     decimals: 0,
     postfix : "h"
    });
   noUiSlider.create(connectSlider, {
    start: [8, 19],
    step: 1,
    margin: 1,
    connect: true,
    tooltips:  [ format, format ],
    range: {
      'min': 0,
      'max': 23
    },
    pips: {
      mode: 'values',
      values: [0,2,4,6,8,10,12,14,16,18,20,22],
      density: 4,
      format: format
    }
  });
  $("form").on('submit', function (e) {
    e.preventDefault();
    submitSearch(); 
  });
  $("#radius option[value=10]").attr("selected", "selected");
  //getSearchResults();
}

function submitSearch() {
  var url="/search?"
  if (typeof $("#from").data("latlng") != 'undefined')
    url += "from=" + encodeURIComponent($("#from").data("latlng"));
  if (typeof $("#to").data("latlng") != 'undefined')
    url += "&to=" + encodeURIComponent($("#to").data("latlng"));
  if($("#date").val())
    url +=  "&date" + encodeURIComponent($("#date").val());
  window.location.href = url;
}

function getSearchResults() {
  $.ajax({ 
    type: 'POST', 
    url: '/search', 
    data: { get_param: 'value' }, 
    dataType: 'json',
    success: function (data) { 
      $.each(data, function(index, journey) {
        $('#searchResults').append($('<div>', {
            text: journey._id
        }));
      });
    }
  });
}
