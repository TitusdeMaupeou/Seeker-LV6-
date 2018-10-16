var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//change port back to /dev/cu.usbmodem143242
//------ SETTINGS ---------------------------------
const settings = {
    serialAddress: 'COM4',
    baudRate: 115200
}

//------ GLOBALS ---------------------------------
const serialPort = new SerialPort(settings.serialAddress, {
    baudRate: settings.baudRate
  }, function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
});    

const parser = new Readline();

const crew = {};


//------ crew ---------------------------------
function updateCrewData(t, s, property, value) {
    if (crew.hasOwnProperty(s)) {
        if (!value) {
            crew[s].name = property;
        } else {
            crew[s][property] = value;
        }
    } else {
        crew[s] = {};
    }   
}

//-------- serial + socket_______________

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html'); //serve index.html
});

io.on('connection', function(socket){ //connection socket
   serialPort.pipe(parser)
   parser.on('data', function (data) {
    if (data != null || data != "" || data != undefined) {
        try {
            console.log(data);
            let parsed = JSON.parse(data);
            updateCrewData(parsed.t,parsed.s, parsed.n, parsed.v); //time, id, property and its value (e.g temperature)
            io.emit('update', data); //send crewdata to socket
        } catch (error) {
            console.log(error);
        }
    }
});

});





