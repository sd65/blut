// SITE_URL is set in login.jade

window.onload = function() {
  $(".progress-meter").css("width", "66%");

  setTimeout(function () {
    $(".progress-meter").css("width", "90%");
    window.location.href = "https://cas.utc.fr/cas/login?service=" + SITE_URL + "/login";
  }, 500);
}
