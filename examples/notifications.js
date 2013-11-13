// requires terminal-notifier (can be installed by 'brew install terminal-notifier')

var
  HTTP = require('http'),
  ArpGateway = require('../index'),
  getGatewayArp = ArpGateway.getGatewayArp,
  entries = [],
  lastWasError = false,
  port = 1337;

HTTP.createServer(function (req, res) {
  res.writeHead( 200, {'Content-Type': 'application/json'} );
  res.end(JSON.stringify(entries, null, 2));
}).listen(port);

var notify = function(message, title){
  if ( 'object' === typeof message ) {
    message = JSON.stringify(message);
  }
  if ( 'string' !== typeof message  ) { message = ''+ message;  }
  if ( 'string' !== typeof title    ) { title   = ''+ title;    }

  message = message.replace(/[^\w\s-,:.’]/gm, '');
  title   = title.replace(/[^\w\s-,:.’]/gm, '');

  ArpGateway
    .execute('terminal-notifier -title \''+ title +'\' -message \''+ message +'\' -open \'http://localhost:'+ port +'\'', { timeout: 2000 })
    .fail(function(error){
      console.log(error);
    });
};

var parseGatewayArp = function(){
  getGatewayArp()
    .then(function(gateway){

      var entry = {
        ip  : gateway[1],
        mac : gateway[0],
        date: new Date()
      };
      entry.time = entry.date.getHours() +':'+ entry.date.getMinutes() +':'+ entry.date.getSeconds();

      if (!entries.length) {

        entries.push(entry);
        notify('is '+ entry.ip +'\nwith MAC '+ entry.mac, 'Default Gateway');

      } else if ( entry.mac !== entries[entries.length-1].mac ) {

        notify('Was '+ entries[entries.length-1].ip +
          ' with MAC '+ entries[entries.length-1].mac + ' at '+ entries[entries.length-1].time +'\nNow it’s '+
          entry.ip +'with MAC '+ entry.mac +' at '+ entry.time, 'Danger: Gateway has been modified');
        entries.push(entry);
        lastWasError = true;

      } else if (lastWasError) {
        notify('is '+ entry.ip +'\nwith MAC '+ entry.mac, 'Default Gateway');
        lastWasError = false;
      }
    })
    .fail(function(error){
      if (!lastWasError) {
        var entry = {
          ip    : '-error-',
          mac   : '-error-',
          date  : new Date(),
          error : error
        };
        entry.time = entry.date.getHours() +':'+ entry.date.getMinutes() +':'+ entry.date.getSeconds();
        entries.push(entry);


        notify(error, 'Error');
        lastWasError = true;
      }
    });
};

parseGatewayArp();
setInterval( parseGatewayArp, 5000);
