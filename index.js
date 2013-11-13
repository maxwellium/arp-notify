var
  ChildProcess  = require('child_process'),
  Q             = require('q');


var execute = module.exports.execute = function(handle, options){
  var deferred = Q.defer();

  if ( 'undefined' === typeof options ) {
    options = {};
  }

  ChildProcess.exec(handle, options, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else if (stderr) {
      deferred.reject(stderr);
    } else {
      deferred.resolve(stdout);
    }
  });

  return deferred.promise;
};

module.exports.getGatewayArp = function(){
  return execute('netstat -rn', { timeout: 2000 })

    .then(function(netstat){
      var
        defaultLine = /default.*([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(netstat),
        defaultIP;

      if ( null === defaultLine ) {
        throw 'Could not find default line in netstat';
      } else {
        defaultLine = defaultLine[0];
      }

      defaultIP = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(defaultLine);
      if ( null === defaultIP ) {
        throw 'Could not find default IP';
      } else {
        defaultIP = defaultIP[0];
      }

      return defaultIP;
    })

    .then(function(defaultIP){
      return execute('arp -n '+ defaultIP, { timeout: 2000 })
        .then(function(arp){
          var defaultMac = /([0-9A-F]{1,2}[:-]){5}[0-9A-F]{1,2}/i.exec(arp);

          if ( null === defaultMac ) {
            throw 'Could not find Gateway address in arp table';
          }

          defaultMac = defaultMac[0];

          return [defaultMac, defaultIP];
        });
    });
};
