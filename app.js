const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const clientId = require('./api_key')

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node.modules/jquery/dist/'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



function getShows() {
    return request({
      url: 'https://www.xmltvlistings.com/xmltv/get/',
      qs: {
        s: 'friends',
        apikey: clientId,
        lineupId: 2961,
      }
    })
  }

console.log(getShows);
       
app.listen(3000)