var
  os = require('os'),
  snmp = require('snmpjs'),
  http = require('http'),
  util = require('util'),
  express = require('express')
;
var
  app = express(),
  trapd = snmp.createTrapListener(),
  result = [],
  messages = []
;

app.use(express.static('public'));
app.get('/get_today_count', function(req, res) {
  //  console.log(result.length);
  res.send(JSON.stringify(
    { count: result.length.toString(),
      message: messages[result.length - 1]
    }));
});

var server = app.listen(3001, function() {
  console.log('Listening on port %d', server.address().port);
});

trapd.on('trap', function (msg) {
  var trapValue = util.inspect(
    snmp.message
        .serializer(msg)['pdu']
        .varbinds[0]
        .string_value,
    false,
    null
  );

  result.push(msg);
  messages.push(trapValue);

  var now = new Date();
  console.log("Trap Received " + now);
  console.log(trapValue);
  console.log(result.length);
});
trapd.bind({ family: 'udp4', port: 3000 });
