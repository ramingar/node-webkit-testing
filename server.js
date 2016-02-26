var Hapi          = require('hapi');
var http          = require('http');
var requestModule = require('request');
var querystring   = require('querystring');
var fs            = require('fs');

var datos = fs.readFileSync('assets/js/config/serverConfig.json', 'utf8');
datos = JSON.parse(datos);

var myclientid     = datos.clientId;
var myclientsecret = datos.secretKey;

var server = new Hapi.Server();
server.connection({ "port": "2000" });

/* **** ROUTES ************************************************************** */

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {

    var post_data_with_code = querystring.stringify({
      client_id: myclientid,
      client_secret: myclientsecret,
      code: request.query.code,
      state: request.query.state
    });

    requestModule.post({ url:'https://github.com/login/oauth/access_token', form: post_data_with_code},
      function (err, httpResponse, body) {
        //console.log(body);
        console.log('-----------------------------------');
        console.log('-----------------------------------');
        //reply.redirect('http://localhost/index.html?' + body);
        console.log(httpResponse);
        //reply('200 OK!!!').header('Access-Control-Allow-Origin','*');
      }
    )
  }
});

server.route({
  method: 'GET',
  path: '/oauth',
  handler: function (request, reply) {
    reply('200 OK!!!').header('Access-Control-Allow-Origin','*');
  }
});

server.route({
  method: 'POST',
  path: '/oauth',
  handler: function (request, reply) {
    console.log('YAY!!');
    reply('200 OK!!!').header('Access-Control-Allow-Origin','*');
  }
});

/* **** END: ROUTES ********************************************************* */
server.start();
