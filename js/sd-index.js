function safetyIndexCharts(region){
  region = region !== undefined ? region : 'Statewide';
  "use strict";
  let gsheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRK-A8e5rrNmiyOFE0O42IVpEKm4OLBL8xL2YDb201Vg7fUNGJtVs3XFG9CEdPm5pHBTjMCk7ryDvai/pub?output=csv';
  fetch(gsheet).then(function(response){
      return response.text();
  }).then(function(data) {
      var data = JSON.parse(csvJSON(data));
      let maxTimestamp = maxDateInData(data,"Timestamp");
      data = data.filter(val=>{return val.Timestamp === maxTimestamp})
      let statewideIndex = data.filter(val=>{return val.Entity === region});
      let safetyIndex = 0;
      for(let i=0; i<statewideIndex.length; i++) {
          safetyIndex += parseFloat(statewideIndex[i].WeightedIndex);
      }
      var config = {
          type: "doughnut",
          data: {
            labels: ["","Safety Index"],
            datasets: [
              {
                data: [Math.round((100 - safetyIndex) * 10) / 10, safetyIndex],
                backgroundColor: ["#d58e61", "#5a87c5"]
              }
            ]
          },
          options: {
            defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
              "proxima-nova, sans-serif"),
            legend: { display: false },
            responsive: true,
            animation: {
              duration: 3000,
              animateScale: true,
              animateRotate: true,
              easing: "easeOutCirc"
            },
            elements: {
              center: {
                text: Math.round(safetyIndex *10 )/10 + "%",
                color: "#000000", 
                fontStyle: "proxima-nova, sans-serif",
                sidePadding: 20
              }
            }
          }
      };
      var ctx = document.getElementById("zero-fatalities-doughut-chart").getContext("2d");
      var myChart = new Chart(ctx, config);
  }).catch(function(err){
      console.log('Safety Index Chart error:',err);
  })
  //Historical Line Chart
  gsheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJnuI72Yjc-HGypc4K2Qo3sx6mv6HBOlvj9xEg-9-pgvPr5k28Plhg75hkgC77PEEpzf2kRfQnDw8I/pub?gid=3221396&single=true&output=csv';
  fetch(gsheet).then(function(response) {
    return response.text();
  }).then(function(data){
    data = JSON.parse(csvJSON(data));
    data = data.filter(val => {return val.UDOTREGION === region});
    data.sort(compareValues('YEAR','asc'));
    let zfData = [],zfYear = [];
    for(let i = 0; i < data.length; i++) {
      zfData.push(parseInt(data[i].Overall_Safety_Index));
      zfYear.push(parseInt(data[i].YEAR));
    }
    Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
    Chart.defaults.global.defaultFontSize = 14;
    Chart.defaults.global.defaultFontColor = "#000";
    var linechartData = {
      labels: zfYear,
      datasets: [
        {
          label: "Safety Index",
          data: zfData,
          borderColor: "#5a87c5",
          fill: false,
          backgroundColor: "#000"
        }
      ]
    };
    var chartOptions = {
      responsive: true,
      animation: {
        duration: 3000,
        animateScale: true,
        animateRotate: true,
        easing: "easeOutCirc",
        onComplete: function() {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function(bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y + 20);
            });
          });
        }
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: 100
            }
          }
        ]
      },
      tooltips: {
        enabled: false
      }
    };
    var ctx = document.getElementById("zero-fatalities-line-chart");
    new Chart(ctx, {
      type: "line",
      data: linechartData,
      options: chartOptions
    });
  }).catch(function(err) {
    console.log('Safety Index Historic Line Chart error:',err)
  });
}