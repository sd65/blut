window.onload = function() {
   $("#date").fdatepicker({
     language: "fr", 
     weekStart: 1,
     format: "dd/mm/yyyy",
     initialDate: $("#queryDate").text()
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
  
  $("#searchResults").on('click', '.journey', function () {
    console.log($(this).data("link"));
    window.location.href = $(this).data("link");
  });

  $("#radius option[value=10]").attr("selected", "selected");
  
  connectSlider.noUiSlider.on('change', getSearchResults);
  $( "#date, #radius" ).change(getSearchResults);
  getSearchResults();
}

function getSearchResults() {
  var data = {
    date: $("#date").val(),
    radius: $("#radius").val(),
    time: $("#time").get(0).noUiSlider.get(),
    from: $("#queryFrom").text(),
    to: $("#queryTo").text()
  }
  $.ajax({ 
    type: 'POST', 
    url: '/search', 
    contentType: "application/JSON; charset=UTF-8",
    data : JSON.stringify(data),
    success: function (data) { 
      $('#searchResults').html(data)
    }
  });
}
