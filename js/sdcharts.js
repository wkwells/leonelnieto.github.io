//Plug ins
Chart.plugins.register({
  afterDraw: function(chartInstance) {
    if (chartInstance.config.options.showDatapoints) {
      var helpers = Chart.helpers;
      var ctx = chartInstance.chart.ctx;
      var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);

      // render the value of the chart above the bar
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = fontColor;

      chartInstance.data.datasets.forEach(function (dataset) {
        for (var i = 0; i < dataset.data.length; i++) {
          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
          var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
          var yPos = (scaleMax - model.y) / scaleMax >= 0.93 ? model.y + 20 : model.y - 5;
          ctx.fillText(dataset.data[i], model.x, yPos);
        }
      });
    }
  }
});
Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;
      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'proxima-nova';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;
      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);
      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);
      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse+"px " + fontStyle;
      ctx.fillStyle = color;
      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});
//Strategic Goal Charts
function drawGoalCharts() {
  var url = "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide";
  fetch(url).then(function(response){
    return response.json();
  }).then(function(data){
    var dataIndex = data[0].safety;
    var indexLabel =["","Safety Index"];
		var config = {
			type: 'doughnut',
			data: {
				labels: indexLabel,
				datasets: [{
					data: [(Math.round((100-dataIndex)*10)/10),dataIndex],
					backgroundColor: [
					  "#d58e61",
					  "#5a87c5"
					]
				}]
			},
		options: {
      defaultFontFamily: Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif",
      legend:{display:false},
    	responsive: true,
      animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
			elements: {
				center: {
					text: dataIndex+'%',
          color: '#000000', // Default is #000000
          fontStyle: 'proxima-nova, sans-serif', // Default is Arial
          sidePadding: 20 // Defualt is 20 (as a percentage)
				}
			}
		}
	 };
  	var ctx = document.getElementById("zero-fatalities-doughut-chart").getContext("2d");
  	var myChart = new Chart(ctx, config);
    dataIndex = data[0].mobility;
    indexLabel =["","Mobility Index"];
    config = {
			type: 'doughnut',
			data: {
				labels: indexLabel,
				datasets: [{
					data: [(Math.round((100-dataIndex)*10)/10),dataIndex],
					backgroundColor: [
            "#d58e61",
					  "#5a87c5"
					]
				}]
			},
		options: {
      defaultFontFamily: Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif",
      legend:{display:false},
    	responsive: true,
      animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
			elements: {
				center: {
					text: dataIndex+'%',
          color: '#000000', // Default is #000000
          fontStyle: 'proxima-nova, sans-serif', // Default is Arial
          sidePadding: 20 // Defualt is 20 (as a percentage)
				}
			}
		}
	 };
    var ctx = document.getElementById("optimize-mobility-doughut-chart").getContext("2d");
  	var myChart = new Chart(ctx, config);
    dataIndex = data[0].infrastructure;
    indexLabel =["","Infrastructure Index"];
    config = {
			type: 'doughnut',
			data: {
				labels: indexLabel,
				datasets: [{
					data: [(Math.round((100-dataIndex)*10)/10),dataIndex],
					backgroundColor: [
            "#d58e61",
					  "#5a87c5"
					]
				}]
			},
		options: {
      defaultFontFamily: Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif",
      legend:{display:false},
    	responsive: true,
      animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
			elements: {
				center: {
					text: dataIndex+'%',
          color: '#000000', // Default is #000000
          fontStyle: 'proxima-nova, sans-serif', // Default is Arial
          sidePadding: 20 // Defualt is 20 (as a percentage)
				}
			}
		}
	 };
    var ctx = document.getElementById("preserve-infrastructure-doughut-chart").getContext("2d");
  	var myChart = new Chart(ctx, config);
    //Fron here on down draw historical charts.
    url = "https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year";
    fetch(url).then(function(response){
      return response.json();
    }).then(function(j){
      var zfData = [];
      var omData = [];
      var piData = [];
      var years = [];
      for(var i = 0; i < j.length; i++){
          zfData.push(parseFloat(j[i]["avg_safety"]).toFixed(2));
          omData.push(parseFloat(j[i]["avg_mobility"]).toFixed(2));
          piData.push(parseFloat(j[i]["avg_infrastructure"]).toFixed(2));
          years.push(j[i]["year"]);
      }
      // var zfLineChart = document.getElementById("zero-fatalities-line-chart");
      // var omLineChart = document.getElementById("optimize-mobility-line-chart");
      // var piLineChart = document.getElementById("preserve-infrastructure-line-chart");
      Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
      Chart.defaults.global.defaultFontSize = 14;
      Chart.defaults.global.defaultFontColor = '#000';
      var linechartData = {
        labels: years,
        datasets: [{
          label: "Safety Index",
          data: zfData,
          borderColor: "#5a87c5",
          fill:false,
          backgroundColor: "#000",
        }]
      };
      var chartOptions = {
        responsive: true,
        animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc',
        onComplete: function () {
                var chartInstance = this.chart,
                ctx = chartInstance.ctx;

                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y +20);
                });
              });

            }
      },
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 80
          }
        },
        scales:{
          yAxes: [{display: true, ticks:{beginAtZero: true, steps: 10, stepValue: 5, max: 100}}]
        },
        tooltips: {
          enabled: false
        }
      };
      var ctx = document.getElementById("zero-fatalities-line-chart")
      new Chart(ctx, {
        type: 'line',
        data: linechartData,
        options: chartOptions
      });
      //redefine data
      linechartData = {
        labels: years,
        datasets: [{
          label: "Mobility Index",
          data: omData,
          borderColor: "#5a87c5",
          fill:false,
          backgroundColor: "#000",
        }]
      };
      ctx = document.getElementById("optimize-mobility-line-chart");
      new Chart(ctx, {
        type: 'line',
        data: linechartData,
        options: chartOptions
      });
      //redefine data
      linechartData = {
        labels: years,
        datasets: [{
          label: "Infrastructure Index",
          data: piData,
          borderColor: "#5a87c5",
          fill:false,
          backgroundColor: "#000",
        }]
      };
      ctx = document.getElementById("preserve-infrastructure-line-chart");
      new Chart(ctx, {
        type: 'line',
        data: linechartData,
        options: chartOptions
      });
    }).catch(function(err){
      console.log("(*_*) if you see me there is with the second fetch..."+err);
    });
  }).catch(function(err){
    console.log("{*_*} if you see me there is problem..."+err);
  });
}
//Chart for individual goal pages
//Preserve Infrastructure Charts
function drawPICharts(){
  var url = "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide";
  fetch(url).then(function(response){
    return response.json();
  }).then(function(data){
    var dataIndex = data[0].infrastructure;
    var indexLabel =["","Infrastructure Index"];
		var config = {
			type: 'doughnut',
			data: {
				labels: indexLabel,
				datasets: [{
					data: [(Math.round((100-dataIndex)*10)/10),dataIndex],
					backgroundColor: [
					  "#d58e61",
					  "#5a87c5"
					]
				}]
			},
		options: {
      defaultFontFamily: Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif",
      legend:{display:false},
    	responsive: true,
      animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
			elements: {
				center: {
					text: dataIndex+'%',
          color: '#000000', // Default is #000000
          fontStyle: 'proxima-nova, sans-serif', // Default is Arial
          sidePadding: 20 // Defualt is 20 (as a percentage)
				}
			},
		}
	 };
  	var ctx = document.getElementById("pi-goalpage-doughut-chart").getContext("2d");
  	var myChart = new Chart(ctx, config);
    //Second fetch for historical line charts
    url = "https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year";
    fetch(url).then(function(response){
      return response.json();
    }).then(function(j){
      var piData = [];
      var years = [];
      for(var i = 0; i < j.length; i++){
          piData.push(parseFloat(j[i]["avg_infrastructure"]).toFixed(2));
          years.push(j[i]["year"]);
      }
      var piLineChart = document.getElementById("pi-line-chart");
      Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
      Chart.defaults.global.defaultFontSize = 14;
      var linechartData = {
        labels: years,
        datasets: [{
          label: "Infrastructure Index",
          data: piData,
          borderColor: "#5a87c5"
        }]
      };
      var chartOptions = {
        responsive: true,
        animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 80
          }
        },
        maintainAspectRatio: false
      };
      new Chart(piLineChart, {
        type: 'line',
        data: linechartData,
        options: chartOptions,

      });
      //Third fetch for stacked KPI Charts charts
      url = "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?$select=pavement,bridges,atms,signals&entity=Statewide";
      fetch(url).then(function(response){
        return response.json();
      }).then(function(j){
        var targetMet = [parseFloat(j[0]["atms"]),parseFloat(j[0]["bridges"]),parseFloat(j[0]["pavement"]),parseFloat(j[0]["signals"])];
        var targetRem = [100 - parseFloat(j[0]["atms"]),100 - parseFloat(j[0]["bridges"]),100 - parseFloat(j[0]["pavement"]),100 - parseFloat(j[0]["signals"])];
        var kpiChartData = {
          labels: ["ATMS","Bridges","Pavements","Signals"],
          datasets: [
            {label: 'Target Met',
             data:targetMet,
             backgroundColor:'#5b87c6'},
            {label: 'Target Remaining',
             data:targetRem,
             backgroundColor:'#eb7523'}
          ]
        }
        var piKPIChart = document.getElementById('pi-kpi-chart');
        new Chart(piKPIChart,{
          type: 'bar',
          data:kpiChartData,
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ stacked: true }]
            },
            responsive: true,
            animation: {duration: 3000, animateScale: true,animateRotate: true,easing:'easeOutCirc'},
            maintainAspectRatio: false
          }
        });
      }).catch(function(err){
        console.log("(*_*) if you see me there is with the third fetch..."+err);
      });
    }).catch(function(err){
      console.log("(*_*) if you see me there is with the second fetch..."+err);
    });
  }).catch(function(err){
    console.log("{*_*} if you see me there is problem in preserve infrastructure chart..."+err);
  });
}
//Strategic Direction Peformance Measure charts
//Preserve infrastructure//Infrastructure Metrics Chart,Page specific excecute on page
//Pavement pltly Chart
//With Forcasted Numbers
function pavementPlotlyChart2(){
  var todaydate = new Date();
  var year = todaydate.getFullYear();
    fetch("https://dashboard.udot.utah.gov/resource/hyep-ccu9.json?$where=year<="+year)
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();
        var good = new Array();
        var poor = new Array();
        var fair = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            good.push(parseFloat(j[i]["good"]));
            poor.push(parseFloat(j[i]["poor"]));
            fair.push(parseFloat(j[i]["fair"]));
        }
        var trace1 = {
          x:x,
          y:good,
          name: "% Good: IRI < 95 in/mi",
          type: "bar",
          marker: {color: 'rgb(40, 167, 69)'}
        };
        var trace3 = {
            x:x,
            y:fair,
            name:"% Fair: IRI {95,170} in/mi",
            type: "bar",
            marker: {color: 'rgb(255, 193, 7)'}
        };
        var trace5 = {
            x:x,
            y:poor,
            name:"% Poor: IRI > 170 in/mi",
            type: "bar",
            marker: {color: 'rgb(220, 53, 69)'}
        };
        var data = [trace1,trace3,trace5];
        var layout = {barmode:'stack',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:80,
                    x1:1,
                    y1:80,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
            legend: {
                showlegend: true,
		              legend: {"orientation": "h"},
                y: -0.5,
                x:0.3
            }
        };
        Plotly.newPlot('pavementPlotlyChart',data,layout);
    });
}
//Bridge Plotly Charts
function bridgeConditionChart(){
    fetch("https://dashboard.udot.utah.gov/resource/ujbw-qqsi.json?$order=bhi_year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var y = new Array(); //This will house data but will be reset after each loop
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["bhi_year"]));
            y.push(parseFloat(j[i]["nhs_inv_avg"]));
        }
        var nhs = {
            x:x,
            y:y,
            type: 'bar',
            name:"Average BHI of NHS Bridges",
            text: ["Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85"],
            marker: {
            color: '#f1c232'
            }
        };
        var data = [nhs];
        var layout = {title: 'NHS BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:85,
                    x1:1,
                    y1:85,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
                yaxis: {range: [50, 100]}
              };
        Plotly.newPlot('nhsBridgeCondition',data,layout);
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["state_inv_avg"]));
        }
        var state = {
            x:x,
            y:y,
            name:"Average BHI of State Bridges",
            text: ["Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80"],
            type: 'bar',
            marker: {
            color: '#0b5394'
          }
        };
        data = [];
        data = [state];
        layout = [];
        layout = {title: 'State BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:80,
                    x1:1,
                    y1:80,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],yaxis: {range: [50, 100]}};
        Plotly.newPlot('stateBridgeCondition',data,layout);
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["loc_combined_avg"]));
        }
        var local = {
            x:x,
            y:y,
            name:"Average BHI of State Bridges",
            text:['Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75'],
            type: 'bar',
            marker: {
            color: '#76a5af'
          }
        };
        data = [];
        data = [local];
        layout = [];
        layout = {title: 'Local Governments BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:75,
                    x1:1,
                    y1:75,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],yaxis: {range: [50, 100]}};
        Plotly.newPlot('lgBridgeCondition',data,layout);
    });
}
//Operational ATMS charts
function atmsOperationalChart(){
    fetch("https://dashboard.udot.utah.gov/resource/twwa-kcr4.json?$order=year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var y = new Array(); //This will house data but will be reset after each loop
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            y.push(parseFloat(j[i]["percent_operational"]));
        }
        var operational = {
            x:x,
            y:y,
            mode: "lines+markers",
            name:"% of ATMS Devices in Operation",
            text:['Target: 90'],
            type: 'scatter',
            line:{shape:'spline'}
        };
        var data = [operational];
        var layout = {
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }};
        Plotly.newPlot('atmsOperationalChart',data,layout);
    });
}
//Signal Condition Bart Stacked Chart
function signalsPlotlyChart(){
    fetch("https://dashboard.udot.utah.gov/resource/cqny-q9v6.json?$select=percent_average_all,percent_good_all,percent_poor_all,year&$order=year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();
        var y = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            y.push(parseFloat(j[i]["percent_good_all"]));
        }
        var good = {
          x:x,
          y:y,
          name: "%in Good Condition",
          type: "bar",
          marker: {color: 'rgb(40, 167, 69)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["percent_average_all"]));
        }
        var avg = {
            x:x,
            y:y,
            name:"% in Average Condition",
            type: "bar",
            marker: {color: 'rgb(255, 193, 7)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["percent_poor_all"]));
        }
        var poor = {
            x:x,
            y:y,
            name:"% in Poor Condition",
            type: "bar",
            marker: {color: 'rgb(220, 53, 69)'}
        };
        var data = [good,avg,poor];
        var layout = {barmode:'stack',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:95,
                    x1:1,
                    y1:95,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }
        };
        Plotly.newPlot('signalsPlotlyChart',data,layout);
    });
}
