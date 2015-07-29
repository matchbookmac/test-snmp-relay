var
  os = require('os'),
  snmp = require('snmpjs'),
  http = require('http'),
  util = require('util')
;
var trapd = snmp.createTrapListener();
var result = [];

trapd.on('trap', function (msg) {

  result.push(msg);
  var now = new Date();
  console.log("Trap Received " + now);
  console.log(util.inspect(snmp.message.serializer(msg)['pdu'], false, null));
  console.log(result.length);
});
trapd.bind({ family: 'udp4', port: 3000 });
