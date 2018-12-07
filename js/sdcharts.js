var revcanvas = document.getElementById("TIFRevenuePieChart");
var revctx = revcanvas.getContext('2d');
var theHelp = Chart.helpers;

var expcanvas = document.getElementById("TIFExpendituresPieChart");
var expctx = expcanvas.getContext('2d');

var tifrevenue = {
  labels: ["Motor Fuel / Special Fuel", "Motor Vehicle Registration","Sales Tax"],
  datasets: [{
    fill: true,
    backgroundColor:["#6d3610","#ee7623","#f5b487"],
    data:[5,12,83],
    borderColor: ['#fff', '#fff',"#fff"],
    borderWidth: [3, 3]
  }]
};
var tifexpenditures = {
  labels: ["Bond Payments", "Transit Transportation Investment Fund","Current Projects"],
  datasets: [{
    fill: true,
    backgroundColor:["#6d3610","#ee7623","#f5b487"],
    data:[43,0,57],
    borderColor: ['#fff', '#fff',"#fff"],
    borderWidth: [3, 3]
  }]
};
var options = {
  rotation: -0.7 * Math.PI,
  legend: {
    display: true,
    position: 'bottom',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    // generateLabels changes from chart to chart,  check the source,
    // this one is from the doughut :
    // https://github.com/chartjs/Chart.js/blob/master/src/controllers/controller.doughnut.js#L42
    labels: {
      generateLabels: function(chart) {
        var data = chart.data;
        if (data.labels.length && data.datasets.length) {
          return data.labels.map(function(label, i) {
            var meta = chart.getDatasetMeta(0);
            var ds = data.datasets[0];
            var arc = meta.data[i];
            var custom = arc && arc.custom || {};
            var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
            var arcOpts = chart.options.elements.arc;
            var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
            var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
            var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
              return {
              // And finally :
              text: ds.data[i] + "% " + label,
              fillStyle: fill,
              strokeStyle: stroke,
              lineWidth: bw,
              hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
              index: i
            };
          });
        }
        return [];
      }
    }
  }
};
// Chart declaration:
var myPieChart = new Chart(revctx, {
  type: 'doughnut',
  data: tifrevenue,
  options: options
});
var expPieChart = new Chart(expctx, {
  type: 'doughnut',
  data: tifexpenditures,
  options: options
});
//console.log(myPieChart.generateLegend());
//Plugin from githubExample:
//https://github.com/chartjs/Chart.js/blob/master/samples/data_labelling.html
Chart.plugins.register({
  afterDatasetsDraw: function(chartInstance, easing) {
    // To only draw at the end of animation, check for easing === 1
    var ctx = chartInstance.chart.ctx;
    chartInstance.data.datasets.forEach(function(dataset, i) {
      var meta = chartInstance.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach(function(element, index) {
          // Draw the text in black, with the specified font
          ctx.fillStyle = 'black';
          var fontSize = 12;
          var fontStyle = 'normal';
          var fontFamily = 'Muli';
          ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
          // Just naively convert to string for now
          var dataString = dataset.data[index].toString();
          // Make sure alignment settings are correct
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var padding = 5;
          var position = element.tooltipPosition();
          ctx.fillText(dataString + '%', position.x, position.y - (fontSize / 2) - padding);
        });
      }
    });
  }
});
