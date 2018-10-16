var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline
var fs = require('fs');

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


//------ SERIAL ---------------------------------


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

//--------socket_______________

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
   serialPort.pipe(parser)
   parser.on('data', function (data) {
    if (data != null || data != "" || data != undefined) {
        try {
            console.log(data);
            let parsed = JSON.parse(data);
            updateCrewData(parsed.t,parsed.s, parsed.n, parsed.v);
            io.emit('update', data);
        } catch (error) {
            console.log(error);
        }
    }
});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});





