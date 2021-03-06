var
  os = require('os'),
  snmp = require('snmpjs'),
  http = require('http'),
  util = require('util'),
  express = require('express')
;
var
  trapd = snmp.createTrapListener(),
  result = [],
  messages = [];
;

trapd.on('trap', function (msg) {

  // Find the message from the trap
  var
    trapData = snmp.message.serializer(msg)['pdu'],
    trapValue = trapData.varbinds[0].string_value
  ;

  // Push trap to ongoing result count, and current message to message array
  result.push(msg);
  messages.push(trapValue);

  // Create postData for http POST
  var postData = JSON.stringify({
    count: result.length,
    message: messages[result.length - 1],
    status: trapData.specific_trap === 18
  });

  // Log trap data
  var now = new Date();
  console.log("\n\n-------- \nTrap Received " + now);
  console.log("Trap Value: " + trapValue);
  console.log("Trap ID: " + trapData.specific_trap);
  console.log("Total Traps Received: " + result.length + "\n");

  // Create POST request to external server
  // var options = {
  //   hostname: "192.168.1.182",
  //   port: 3002,
  //   path: "/incoming-snmp",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Content-Length": postData.length
  //   }
  // };

  // Create POST request to internal server
  var options = {
    hostname: "localhost",
    port: 3002,
    path: "/incoming-snmp",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length
    }
  };

  var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.pipe(process.stdout);
  });

  req.on("error", function (err) {
    console.log("problem with request: " + err.message);
  });

  req.write(postData);
  req.end();
  // END POST
});

// bind listener to port receiving snmp traps
trapd.bind({ family: 'udp4', port: 3000 });
