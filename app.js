const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon');
const app = express();
const clientId = require('./api_key.js')

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');
app.use('/jquery', express.static(__dirname + '/node.modules/jquery/dist/'));


function getData(APIKEY, LINEUPID) {
    var url = `https://www.xmltvlistings.com/xmltv/get/${APIKEY}/${LINEUPID}`

    return request({url:url},function(err,response, body) {
        return response;
    });
}

app.get('/', function (req, res) {
    getData(clientId.clientId, 2961).then(function(data){
        // console.log(data);
    })
    res.send(data)
});
           
app.listen(3000)
    
    