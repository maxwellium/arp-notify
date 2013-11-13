arp notify
==========

This module exposes a promise-wrapped api to check for gateway ip and mac address. Monitoring these values helps detecting arp-spoofs.

See examples for usage.

##tl;dr

[Arp Spoofing on Wikipedia](http://en.wikipedia.org/wiki/ARP_spoofing)

If you're at *bucks and wifi is slow, that vpn overhead is just so inconvenient. While this module will only detect changes as they happen (if the script-kiddies got there before you did, you're still screwed), it can warn you when the shenanigans start.

###What it does
> call netstat -rn

note down IP of default gateway

> call arp -n (IP)

tell you IP and mac-address of default gateway

###Know better?
pr please

###cc
i included one example that makes use of osx notification center

as soon as i get my hands on a windows computer i'll check for syntax compatibility of netstat and arp, for now, this works on ubuntu 1310 and osx mavericks.


#License

MIT