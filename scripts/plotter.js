/*
 *
 Brewer v1.0
 Mauricio Mourraille 2017
 License: MIT
 *
 */


var chartData;
var data;
var {ipcRenderer, remote} = require('electron');


window.onload = function () {
    pollData();
    chartData = [];
}

function plot() {
     data = JSON.parse(localStorage.getItem('data'));
        if (data.flag === 1) {
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
        }
}

function generateChartData() {
    var currentTime = new Date();
    chartData.push({
        date: currentTime,
        temp: data.batt
    });
    return chartData;
}



setInterval(function(){ plot(); }, 45000);


