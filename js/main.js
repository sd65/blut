function formatedDate() {
  var now = new Date();
  return now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
}

$(document).foundation();

$("#profileDropdown").css("width", $("#profileButton").innerWidth());
