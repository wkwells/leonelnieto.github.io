//Funding Charts on main passages/ Return with commas in between
var numberWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var dataPack1 = [21000, 22000, 26000, 35000, 55000, 55000, 56000, 59000, 60000, 61000, 60100, 62000];
var dataPack2 = [1000, 1200, 1300, 1400, 1060, 2030, 2070, 4000, 4100, 4020, 4030, 4050];
var dates = ["Mon, May 1", "Tue, May 2", "Wed, May 3", "Thu, May 4", "Fri, May 5", "Sat, May 6",
  "Sun, May 7", "Mon, May 8", "Tue, May 9", "Wed, May 10", "Thu, May 11", "Fri, May 12"
];
var data = [{
            data:[5,12,83],

            backgroundColor:["#6d3610","#ee7623","#f5b487"],
            borderColor: "#fff",
            borderWidth:[3,3,3]
        }];

var options = {
	responsive: true,
  title: {
        display: true,
        position: "top",
        text: "Doughnut Chart",
        fontSize: 18,
        fontColor: "#111"
    },
    legend: {
        display: true,
        position: "bottom",
        labels: {
            fontColor: "#333",
            fontSize: 16
        }
    },
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map(data => {
          sum += data;
        });
        let percentage = (value*100 / sum).toFixed(2)+"%";
        return percentage;
      },
      color: '#fff',
    }
  }
};


var ctx = document.getElementById("pie-chart").getContext('2d');
var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: data,
            labels: ["Motor Fuel / Special Fuel", "Motor Vehicle Registration","Sales Tax"]
        },
              options: options
    });

        

var bar_ctx_2 = document.getElementById('bar-chart-2');
var bar_ctx_3 = document.getElementById('bar-chart-3');



var bar_chart_2 = new Chart(bar_ctx_2, {
  type: 'bar',
  data: {
    labels: dates,
    datasets: [{
      label: 'Bowser',
      data: dataPack1,
      backgroundColor: "green",
      hoverBackgroundColor: "green",
      hoverBorderWidth: 2,
      hoverBorderColor: 'lightgrey'
    }, {
      label: 'Mario',
      data: dataPack2,
      backgroundColor: "darkgreen",
      hoverBackgroundColor: "darkgreen",
      hoverBorderWidth: 2,
      hoverBorderColor: 'lightgrey'
    }, ]
  },
  options: {
    tooltips: {
      mode: 'label',
      callbacks: {
        title: function(tooltipItems, data) {
          return data.labels[tooltipItems.index] + ' ';
        },
        label: function(tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
        },
      }
    },
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          callback: function(value) {
            return value.substring(5, value.length);
          },
        },
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          callback: function(value) {
            return numberWithCommas(value);
          },
        },
      }],
    }, // scales
    legend: {
      display: true
    }
  } // options
});


var bar_chart_3 = new Chart(bar_ctx_3, {
  type: 'bar',
  data: {
    labels: dates,
    datasets: [{
      label: 'Bowser',
      data: dataPack1,
      backgroundColor: "blue",
      hoverBackgroundColor: "blue",
      hoverBorderWidth: 2,
      hoverBorderColor: 'lightgrey'
    }, {
      label: 'Mario',
      data: dataPack2,
      backgroundColor: "darkblue",
      hoverBackgroundColor: "darkblue",
      hoverBorderWidth: 2,
      hoverBorderColor: 'lightgrey'
    }, ]
  },
  options: {
    tooltips: {
      mode: 'label',
      callbacks: {
        title: function(tooltipItems, data) {
          return data.labels[tooltipItems.index] + ' ';
        },
        label: function(tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
        },
      }
    },
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          callback: function(value) {
            return value.substring(5, value.length);
          },
        },
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          callback: function(value) {
            return numberWithCommas(value);
          },
        },
      }],
    }, // scales
    legend: {
      display: true
    }
  } // options
});
