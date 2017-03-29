/*
 *
 Brewer v1.0
 Mauricio Mourraille 2017
 License: MIT
 *
 */


var chartData;
var deg;
var percentage;
var {ipcRenderer, remote} = require('electron');


window.onload = function () {
    chartData = [];
    plot();
}


function plot() {
   var data = ipcRenderer.sendSync('poll', 'DATA');
   this.deg = data.batt;
    this.percentage = data.batt;
    if(data.flag === 1) {
        formatDisplayableVariables();
        var chartData = generateChartData();
        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "marginRight": 80,
            "dataProvider": chartData,
            "valueAxes": [{
                "position": "left",
                "title": "Temperature C "
            }],
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "valueField": "temp",
                "balloonText": "<div style='margin:5px; font-size:19px;'>Temp: <b>[[value]]</b>&deg C</div>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "scrollbarHeight": 80,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "yellow",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.7,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "color": "black"
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "HH:NN:SS",
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true
            },
            "export": {
                "enabled": true,
                "dateFormat": "YYYY-MM-DD HH:NN:SS"
            }
        });
        chart.addListener("dataUpdated", zoomChart);
        zoomChart();
        function zoomChart() {
            chart.zoomToIndexes(chartData.length, chartData.length - 100);
        }

    } else { $("#temp").html("Attempting connection to controller...");}
}

function generateChartData() {
    var currentTime = new Date()
    chartData.push({
        date: currentTime,
        temp: deg
    });
    return chartData;
}

function formatDisplayableVariables() {
    if (deg < 67) {
        var color = 275 - (deg+10);
        if (deg > 56) {
            $("#temp").html('Current boil temp:  &nbsp' + '<span style="color: rgb(0, 0, ' + color + '); font-size:' + (deg + 68) + '%">' + deg + '&deg; C </span> <span style="color: rgb(0, 0, ' + color + '); font-size: 100%">(approaching mash temp)</span>');
        } else {
            $("#temp").html('Current boil temp:  &nbsp' + '<span style="color: rgb(0, 0, '+color+'); font-size:'+(deg+68)+'%">'+ deg +'&deg; C </span>');
        }
    }
    if (deg >= 67 && deg <= 70) {
        $("#temp").html('Current boil temp: &nbsp &nbsp' + '<span style="color: darkgreen; font-size: '+(deg+100)+'%">'+ deg +'&deg; C </span> <span style="color: darkgreen; font-size: 100%">(good to go)</span>');
    }
    if (deg > 70 ) {
        $("#temp").html('Current boil temp: &nbsp &nbsp' + '<span style="color: red; font-size: '+(deg+105)+'%">'+ deg +'&deg; C </span><span style="color: red; font-size: 100%">(HARD BOIL !)</span>');
    }
    else {
        $("#temp").css('color','black');
    }

    if(percentage > 30) {
        $("#batt").html('Remaining battery: &nbsp<span style="color: lightseagreen;">'+percentage+'%</span>');
    } else {
        $("#batt").html('Remaining battery: &nbsp<span style="color: red;">'+percentage+'%</span>');
    }
}

setInterval(function(){ plot(); }, 2000);


