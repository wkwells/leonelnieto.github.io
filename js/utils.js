function csvJSON(csv){
    var lines=csv.split("\r\n");
    var result = [];
    var headers=lines[0].split(",");
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result); 
  }
  function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  
  function Inc(obj) {
    var elem = obj.elem;
    var input = (elem.nodeName.toLowerCase() === 'input') ? true: false;
    var value = parseFloat(elem.getAttribute('data-inc-value')) || 0;
    var duration = parseInt(elem.getAttribute('data-inc-duration')) || 0;
    var delay = parseInt(elem.getAttribute('data-inc-delay')) || 0;
    var decimal = ((obj.decimal > 2) ? 2 : obj.decimal) || 0;
    var currency = obj.currency || '';
    var speed = ((obj.speed < 30) ? 30 : obj.speed) || 30;
    var count = 0;
    var increment = value / (duration / speed);
    var interval = null;
    var regex = /\B(?=(\d{3})+(?!\d))/g;
    var run = function() {
      count += increment;
      if (count < value) {
        (input) ? elem.value = currency + (count).toFixed(decimal).toString().replace(regex, ',') : elem.innerHTML = currency + (count).toFixed(decimal).toString().replace(regex, ',');
      } else {
        clearInterval(interval);
        (input) ? elem.value = currency + (value).toFixed(decimal).toString().replace(regex, ',') : elem.innerHTML = currency + (value).toFixed(decimal).toString().replace(regex, ',');
      }
    };
    setTimeout(function() {
      interval = setInterval(run.bind(this), speed);
    }.bind(this), delay);
    this.reset = function() {
      clearInterval(interval);
      value = parseFloat(elem.getAttribute('data-inc-value')) || 0;
      duration = parseInt(elem.getAttribute('data-inc-duration')) || 0;
      increment = value / (duration / speed);
      delay = parseInt(elem.getAttribute('data-inc-delay')) || 0;
      count = 0;
      interval = setInterval(run, speed);
    }.bind(this);
} // Inc


function getCurrentFiscalYear() {
    //get current date
    var today = new Date();
    //get current month
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if (curMonth > 6) { //
        fiscalYr = (today.getFullYear() + 1).toString();
    } else {
        fiscalYr =  today.getFullYear().toString();
    }
    return [fiscalYr,new Date(fiscalYr,6,1),new Date(fiscalYr-1,6,1)];
 }
 function fiscalYearEnd(){
     var today = new Date();
     var curMonth = today.getMonth();
     var fiscalYearEnd = "";
     if(curMonth>6) {
        fiscalYearEnd = new Date();
     }
 }

var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}