var
  getGatewayArp = require('../index').getGatewayArp,
  entries = [];

var notify = function(message, title){
  var
    date = new Date(),
    time = date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds() +' ';

  console.log(time, title, message);
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
        notify('is '+ entry.ip +' with MAC '+ entry.mac, 'Default Gateway');

      } else if ( entry.mac !== entries[entries.length-1].mac ) {

        notify('Was '+ entries[entries.length-1].ip +
          ' with MAC '+ entries[entries.length-1].mac + ' at '+ entries[entries.length-1].time +'\nNow it’s '+
          entry.ip +'with MAC '+ entry.mac +' at '+ entry.time, 'Danger: Gateway has been modified.');
        entries.push(entry);

      } else {
        notify(entry.ip +' with MAC '+ entry.mac +' since '+ entries[entries.length-1].time, 'All clear.');
      }
    })
    .fail(function(error){
      var entry = {
        ip    : '-error-',
        mac   : '-error-',
        date  : new Date(),
        error : error
      };
      entry.time = entry.date.getHours() +':'+ entry.date.getMinutes() +':'+ entry.date.getSeconds();
      entries.push(entry);

      notify(error, 'Error');
    });
};

parseGatewayArp();
setInterval( parseGatewayArp, 5000);
