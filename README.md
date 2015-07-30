# Boss level SNMP Listener Relay

### By:
- Ian MacDonald (<a href="https://github.com/matchbookmac" target="#">GitHub</a>)
- Bob Ellis (<a href="https://github.com/bobellis" target="#">GitHub</a>)

@ Epicodus Programming School, Portland, OR

GNU General Public License, version 3. Copyright (c) 2015 Ian C. MacDonald & Bob Ellis.

## Steps
1. Setup SNMP locally
2. Setup Node app
3. Setup external node app (or other) to receive POST request from the relay
  * See https://github.com/matchbookmac/test-snmp-api for a node app to receive these signals
4. Start Node app
5. Send/receive signals

##### Notes

These instructions are for setting up development on OSX 10.10.2, YMMV on other systems

### 1: SNMP ('Simple' Network Management Protocol) setup

If you don't already have it, install `net-snmp`
```console
brew install net-snmp
```

Clone the repo below into your root directory to get our setup:
```console
cd ~
git clone https://github.com/matchbookmac/snmp-config.git
```

#### OR If you need to do it on your own

To create MIB files as non-sudoer, create .snmp folder in the current user's root directory. Inside that directory, create a mibs folder

```console
cd ~
mkdir .snmp
cd .snmp
mkdir mibs
touch <file name>MIB.txt
```

add the following line to snmp.conf in your .snmp folder at the current user's root:

```console
cd ~/.snmp
touch snmp.conf
echo "persistentDir /Users/Guest/Desktop/.snmp_persist" > snmp.conf
```

This particular app listens for two different traps:

`~/.snmp/mibs/UP-BRIDGE-MIB.txt`
```shell
UP-BRIDGE-MIB DEFINITIONS ::= BEGIN
IMPORTS ucdExperimental FROM UCD-SNMP-MIB;

demotraps OBJECT IDENTIFIER ::= { ucdExperimental 990 }

demo-trap TRAP-TYPE
STATUS current
ENTERPRISE demotraps
VARIABLES { sysLocation }
DESCRIPTION "This is just a demo"
::= 18
END
```

##### AND

`~/.snmp/mibs/DOWN-BRIDGE-MIB.txt`
```shell
DOWN-BRIDGE-MIB DEFINITIONS ::= BEGIN
IMPORTS ucdExperimental FROM UCD-SNMP-MIB;

demotraps OBJECT IDENTIFIER ::= { ucdExperimental 990 }

demo-trap TRAP-TYPE
STATUS current
ENTERPRISE demotraps
VARIABLES { sysLocation }
DESCRIPTION "This is just a demo"
::= 19
END
```


### 2: Setup Node server

Until snmpjs dependency on banyan is updated, clone the snmpjs repo from git.
```console
cd ~/Desktop
git clone https://github.com/joyent/node-snmpjs.git
```

inside of the `package.json` file change

```javascript
"dependencies": {
  "jison": "0.3",
  "asn1": "~0.2.2",
  "bunyan": "0.1.something",
  "dtrace-provider": "~0.4"
},
```
to
```javascript
"dependencies": {
  "jison": "0.3",
  "asn1": "~0.2.2",
  "bunyan": "^1.3.5",
  "dtrace-provider": "~0.4"
},

```
Run

```console
nmp install

```
Or, if you just need to install snmpjs:

Install snmpjs via npm using the local repo. Substitute the folder for wherever you save the snmpjs repo.

```console
npm install --save ../node-snmpjs/
```

### 3: Setup external server

Create a server to receive the POST requests from this relay.

Alternatively, you can just use the one we made:

```console
git clone https://github.com/matchbookmac/test-snmp-api.git
```

### 4: Start Server

start node server
```console
node index.js
```

### 5: Poke the listener

#### Signals to Local server

send UP trap with:

```console
snmptrap -v 1 -m +UP-BRIDGE-MIB -c public localhost:3000 UP-BRIDGE-MIB::demotraps localhost 6 18 '' SNMPv2-MIB::sysLocation.0 s "UP signal"
```

send DOWN trap with:

```console
snmptrap -v 1 -m +DOWN-BRIDGE-MIB -c public localhost:3000 DOWN-BRIDGE-MIB::demotraps localhost 6 19 '' SNMPv2-MIB::sysLocation.0 s "DOWN signal"
```

#### Signals to External server

If you have the listener setup on an external server that has a port open to the web, you can send a trap to that server by substituting `localhost` after `-c public` with the IP address or server name.

A good way to do this for testing is to install ngrok and open the port to the web:

```console
brew install ngrok
ngrok 3000
```

Now you can send snmp traps to the IP that ngrok provides

### Next Steps
profit
