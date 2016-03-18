// SITE_URL is defined in login.jade
setTimeout(function () {
  window.location.href = "https://cas.utc.fr/cas/login?service=" + SITE_URL + "/login";
}, 500);
