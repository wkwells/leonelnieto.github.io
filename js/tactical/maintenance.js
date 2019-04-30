(function() {
  var corsanyWhere = "https://cors-anywhere.herokuapp.com/";
  var gsheets= "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2DK_5guFPdrRmfFGlh3hXz0l82g2i-XqSsqwl6ZtE8ZgTBIkYGNKn4xmLhYQ9krjU-BJyDxjmC0ZT/pub?output=csv";
  fetch(
    corsanyWhere+gsheets
  )
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      var data = JSON.parse(csvJSON(data));
      console.log(data);
      document.getElementById("budget").innerHTML=0;
      var budget = 0;
      var expend = 0;
      for(var x = 0; x < data.length; x++) {
        if(data[x]["FISCAL_YEAR"] === "2019"){
          budget += parseFloat(data[x]["BUDGET"]);
          expend += parseFloat(data[x]["EXPENDITURES"]);
        }
      }
      console.log(parseFloat(expend/budget)*100);
      var budgetPercent = parseInt(parseFloat(expend/budget)*100);
      animateValue("budgetPercent",0,budgetPercent,3000);
      document.getElementById("budget").setAttribute("data-inc-value",budget);
      document.getElementById("budgetProgress").setAttribute("aria-valuenow",budgetPercent);
      document.getElementById("budgetProgress").setAttribute("style","width:"+budgetPercent+"%");
      var elem = document.getElementById("budget");
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      });
      console.log(getCurrentFiscalYear());
    })
    .catch(function(err) {
      console.log(err);
    });
})();