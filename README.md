To get snmp trap sending to work:

To create MIB files as non-sudoer, create .snmp folder in the current user's root directory. Inside that directory, create a mibs folder

cd ~
mkdir .snmp
mkdir mibs
touch MIB.txt


add the following line to snmp.conf in your .snmp folder at the current user's root:

cd ~/.snmp
touch snmp.conf
echo "persistentDir /Users/Guest/Desktop/.snmp_persist" > snmp.conf
