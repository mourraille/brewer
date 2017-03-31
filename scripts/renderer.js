/**
 * Created by mauriciomourraille on 3/30/17.
 */

var percentage;
var deg;
var firstTime = false;


function pollData() {

    var data = ipcRenderer.sendSync('poll', 'DATA');
    localStorage.setItem('data', JSON.stringify(data));

    percentage = data.batt;
    deg = data.temp;
    if (data.flag === 1) {
        $('#buttons').show();
        formatDisplayableVariables();
        $('#cre').html(' <h1 style="color: darkgray; font-size: 78%; margin-top: -6px;">Brewer v1.0 by <a href="https://github.com/mourraille" target="_blank">mourraille</a> 2017 </h1>');

    } else {
        $('#buttons').hide();
        $("#temp").html("Attempting connection to controller...");
        $("#chartdiv").html('<img src="spinner.gif" style="margin-left: 27%;" height="500" width="600"/><h4 style="text-align: center; margin-top: -52px;">(Retrieving chart data)</h4></img>');
        $('#cre').html("");
    }

}



function formatDisplayableVariables() {

    if (deg < 67) {
        var color = 275 - (parseInt(deg)+10);
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


setInterval(function () { pollData()

}, 1000);

