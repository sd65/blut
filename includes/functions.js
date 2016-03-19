module.exports = {

  formatDate: function (mdate) {
    var date = new Date(mdate);
    var monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin',  
       'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    var dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi','Vendredi', 'Samedi'];
    return dayNames[date.getDay()] + ' ' + date.getDate() + ' ' + monthNames[date.getMonth()];
  },

  formatTime: function (mdate) {
    var date = new Date(mdate);
    return date.getHours() + "h" + ('0' + date.getMinutes()).slice(-2);
  }

};
