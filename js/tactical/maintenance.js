(function() {
  fetch(
    "http://maps.udot.utah.gov/wadocuments/Data/EmpDev/course_schedule_data.json"
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
