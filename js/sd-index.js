(function($){
    "use strict";
    let gsheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRK-A8e5rrNmiyOFE0O42IVpEKm4OLBL8xL2YDb201Vg7fUNGJtVs3XFG9CEdPm5pHBTjMCk7ryDvai/pub?output=csv';

    fetch(gsheet).then(function(response){
        return response.text();
    }).then(function(data) {
        var data = JSON.parse(csvJSON(data));
        var maxTimestamp = maxDateInData(data,"Timestamp");
        data = data.filter(val=>{return val.Timestamp === maxTimestamp})
        let statewideIndex = data.filter(val=>{return val.Entity === "Statewide"});
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
                  text: safetyIndex + "%",
                  color: "#000000", // Default is #000000
                  fontStyle: "proxima-nova, sans-serif", // Default is Arial
                  sidePadding: 20 // Defualt is 20 (as a percentage)
                }
              }
            }
        };
        var ctx = document.getElementById("zero-fatalities-doughut-chart").getContext("2d");
        var myChart = new Chart(ctx, config);
        
    }).catch(function(err){
        console.log("you fucked up in ",err);
    })

})(jQuery);