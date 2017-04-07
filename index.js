/*
 *
 Brewer v1.0
 Mauricio Mourraille 2017
 License: MIT
 *
 */

var electron = require('electron');
var  noble  = require('noble');
var {app,ipcMain} = electron;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;


var devices = [];
var selectedDevice = null;
var selectedAddress = null;

var uartRx = null;
var uartTx = null;
var batt = 100;
var temp = 0;
var flag = 0;


function findUARTCharacteristics(services) {
    services.forEach(function(s, serviceId) {
        s.characteristics.forEach(function(ch, charId) {
            if (ch.uuid === '6e400002b5a3f393e0a9e50e24dcca9e') {
                uartTx = ch;
            }
            else if (ch.uuid === '6e400003b5a3f393e0a9e50e24dcca9e') {
                uartRx = ch;
                uartRx.removeAllListeners('data');
                uartRx.on('data', function(data) {
                    flag = 1;
                    var myData = String(data);
                    if (myData.length == 8){
                    myData = myData.split(":");
                        temp = parseFloat(myData[1]);
                        var currentBatt = parseInt(myData[0]);
                        if (currentBatt > 10) {
                                batt = currentBatt;
                        }
                    }

                });
                uartRx.notify(true);
            }
        });
    });
}

function reconnect(address) {
    if (address === null) {
        return;
    }
    flag = 0;
    console.log('Reconnecting to address: ' + address);
    selectedAddress = address;
    devices = [];
    noble.startScanning();
}

function connected(error) {
    if (error) {
        console.log('Error connecting: ' + error);
        return;
    }
    selectedDevice.removeAllListeners('disconnect');
    selectedDevice.on('disconnect', function() {
        reconnect(selectedAddress);
    });
    selectedDevice.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
        if (error) {
            console.log('Error discovering: ' + error);
            return;
        }
        findUARTCharacteristics(services);
    });
}

app.on('window-all-closed', function() {
    if (process.platform !=='darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1280, height: 830, titleBarStyle: 'hidden', title: 'Brewer 1.0',
        icon: __dirname + './manati.png'});
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    //    mainWindow.toggleDevTools();
    noble.state = 'poweredOn';

    ipcMain.on('poll', (event, arg) => {
        if(batt > 10)
    { //console.log(temp);
        event.returnValue = {
            batt: batt,
            temp: temp,
            flag: flag
        };

    }
});

    noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
            noble.startScanning();
        } else {
            noble.stopScanning();
        }
    });

    noble.on('discover', function(peripheral) {
        var str = peripheral.address;
        if (str.includes("f4:8e:07:df:84:93") ) {
            selectedDevice = peripheral;
            selectedAddress = peripheral.address;
            console.log(selectedDevice.address);
            noble.stopScanning();
            selectedDevice.connect(connected);
        }
    });
});



