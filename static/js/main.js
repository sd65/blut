// jQuery is loaded

function formatedNowDate() {
  var now = new Date();
  return now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
}

// Lauch foundation JS
$(document).foundation();

// Visual Tweak
$("#profileDropdown").css("width", $("#profileButton").innerWidth());
