function loadDraw(region) {
  var corsanyWhere = "https://cors-anywhere.herokuapp.com/";
  var gsheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2DK_5guFPdrRmfFGlh3hXz0l82g2i-XqSsqwl6ZtE8ZgTBIkYGNKn4xmLhYQ9krjU-BJyDxjmC0ZT/pub?output=csv";
  fetch(
    gsheets
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      var data = JSON.parse(csvJSON(data));
      if (region !== "0") {
        console.log(region);
        data = data.filter(val => { return val.UDOT_REGION === region });
      }
      console.log(data);
      document.getElementById("budget").innerHTML = 0;
      var budget = 0;
      var expend = 0;
      var currFis = getCurrentFiscalYear();
      for (var x = 0; x < data.length; x++) {
        if (data[x]["FISCAL_YEAR"] === currFis[0]["FiscalYear"]) {
          budget += parseFloat(data[x]["BUDGET"]);
          expend += parseFloat(data[x]["EXPENDITURES"]);
        } else {
          budget = 0;
          expend = 0;
        }
      }
      var expendProj = Math.round(((expend / (365 - currFis[0]["DaysLeft"])) * currFis[0]["DaysLeft"]) + expend);
      var budgetPercent = parseInt(parseFloat(expend / budget) * 100);
      animateValue("budgetPercent", 0, budgetPercent, 3000);
      document.getElementById("budgetProgress").setAttribute("aria-valuenow", budgetPercent);
      document.getElementById("budgetProgress").setAttribute("style", "width:" + budgetPercent + "%");
      var elem = document.getElementById("budget");
      elem.setAttribute("data-inc-value", budget);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      });
      elem = document.getElementById("expend");
      elem.setAttribute("data-inc-value", expend);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      })
      elem = document.getElementById("expendProj");
      elem.setAttribute("data-inc-value", expendProj);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      })
      if (expendProj <= budget) {
        document.getElementById("indicator").setAttribute("class", "fas fa-angle-down fa-3x text-success")
      } else if (expendProj > budget) {
        document.getElementById("indicator").setAttribute("class", "fas fa-angle-up fa-3x text-warning")
      }
      var fisYears = [];
      var budgetArr = [];
      var expendArr = [];
      for (var x = 0; x < data.length; x++) {
        if (region !== "0") {
          fisYears.push(data[x]["FISCAL_YEAR"]);
          budgetArr.push(data[x]["BUDGET"]);
          expendArr.push(data[x]["EXPENDITURES"]);
        } else {
          var sumBudget = 0;
          var sumExpend = 0;
          sumBudget += data[x]["BUDGET"];
          sumExpend += data[x]["EXPENDITURES"];
          if ((x % 4) === 0) {
            fisYears.push(data[x]["FISCAL_YEAR"]);
            budgetArr.push(sumBudget);
            expendArr.push(sumExpend);
          }
        }
      }
      console.log(fisYears);
      console.log(budgetArr);
      console.log(expendArr);
      var budgetData = {
        label: "Budget",
        data: budgetArr,
        backgroundColor: 'rgba(0,99,1332,0.6)',
        borderWidth: 0,
        yAxisId: 'y-axis-budget'
      }
      var expedData = {
        label: "Expenditures",
        data: expendArr,
        backgroundColor: 'rgba(99,132,0,0.6)',
        borderWidth: 0,
        yAxisId: 'y-axis-expend'
      }

      var barData = {
        labels: fisYears,
        datasets: [budgetData, expedData]
      }

      var ctx = document.getElementById("regionBar");
      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: barData,
        options: {
          scales: {
            xAxes: [{
              barPercentage: 1,
              categoryPercentage: 0.6
            }],
            yAxes: [{
              id: "y-axis-density"
            }, {
              id: "y-axis-gravity"
            }]
          }
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}