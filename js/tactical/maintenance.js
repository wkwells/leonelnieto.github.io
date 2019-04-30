(function() {
  fetch(
    "https://maps.udot.utah.gov/wadocuments/Data/UDOTWide/strategic-indexes.json"
  )
    .then(function(response) {
      return response;
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
})();
