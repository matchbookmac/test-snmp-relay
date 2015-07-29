To get snmp trap sending to work:

To create MIB files as non-sudoer, create .snmp folder in the current user's root directory. Inside that directory, create a mibs folder

```console
cd ~
mkdir .snmp
mkdir mibs
touch MIB.txt
```

add the following line to snmp.conf in your .snmp folder at the current user's root:

```console
cd ~/.snmp
touch snmp.conf
echo "persistentDir /Users/Guest/Desktop/.snmp_persist" > snmp.conf
```

clone the snmpjs repo from git.

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

Install snmpjs via npm using the local repo. Substitute the folder for wherever you save the snmpjs repo.
```console
npm install --save ../node-snmpjs/
```

start node server
```console
node index.js
```

send trap with:
```console
snmptrap -v 1 -m +TRAP-TEST-MIB -c public localhost:3000 TRAP-TEST-MIB::demotraps localhost 6 17 '' SNMPv2-MIB::sysLocation.0 s "You were here"
```

profit
