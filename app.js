const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon');
const path = require('path');
const { clientId, userKey, clientUsername } = require('./api_key');

const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));


var authOptions = {
  url: 'https://api.thetvdb.com/login',
  body: {
    "apikey": clientId,
    "userkey": userKey,
    "username": clientUsername
  },
  method: 'POST',
  json: true
};

function getJwtToken() {
    return request(authOptions).then(function(data) {
       return data.token;
    })
}

function getRequestOptions(url, token, queryOptions = {}) {
  var options = {
      url: url,
      qs: queryOptions,
      headers: {
          'Authorization': `Bearer ${token}`
      },
      json: true
  };
  return options;
}

function getShowSeries(token, series) {
    var options = getRequestOptions('https://api.thetvdb.com/search/series', token, { name: 'this is us' })

    return request(options).then(function(seriesData) {
        return seriesData;
    });
}


function normalizeShows(data) {
    const showSeriesName = data.data[0].seriesName;
  
    return showSeriesName;
  }
    
  
app.get('/:series', function(req, res) {
  const series = req.params.series;
  let _jwt_token;

  getJwtToken()
    .then(function(token) {
      _jwt_token = token;

      return getShowSeries(_jwt_token, series)
    })
    .then(function(shows) {
        const normalizedShows = shows.shows.map(function(show) {
            return normalizeShowsData(show);
        })

        const result = {
            tracks: normalizedShows
        }

        res.render('series', result);
    })
});

app.listen(3000, function() {
  console.log('server is listening to port 3000');
});