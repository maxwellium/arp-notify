var
  HTTP = require('http'),
  getGatewayArp = require('../index').getGatewayArp,
  entries = [];

HTTP.createServer(function (req, res) {
  res.writeHead( 200, {'Content-Type': 'application/json'} );

  getGatewayArp()
    .then(function(gateway){

      var entry = {
        ip  : gateway[1],
        mac : gateway[0],
        date: new Date()
      };
      entries.push(entry);

    })
    .fail(function(error){

      var entry = { error : error };
      entries.push(entry);

    })
    .fin(function(){

      res.end(JSON.stringify(entries, null, 2));

    });

}).listen(1337);

console.log('http://localhost:1337 and refresh :)');