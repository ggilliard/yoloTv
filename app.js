const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');

const path = require('path');
const {
  clientId,
  userKey,
  clientUsername
} = require('./api_key');

const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({ defaultLayout: 'index' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

function normalizeShows(show) {
  // const seriesName = data.data[0].seriesName;

  const {
      seriesName: nameOfSeries,
      id: seriesId,
      network: network,
      banner: image,
      overview: synopsis
  } = show;

  return {
    nameOfSeries,
    seriesId,
    network,
    image,
    synopsis
  }
}
// displaying all data from series
function getShowSeries(token, series) {
  var options = getRequestOptions('https://api.thetvdb.com/search/series', token, { name: series })

  return request(options).then(function(seriesData) {
    return seriesData;
  });
}

app.get('/:series', function(req, res) {
  const series = req.params.series;
  let _jwt_token;

  getJwtToken()
    .then(function(token) {
      _jwt_token = token;

      // console.log(token)
      return getShowSeries(_jwt_token, series)
    })
    .then(function(showSeries) {
      const showData = showSeries.data.map(function(show) {
        return normalizeShows(show);
      })

      const result = {
        show: showData
      }

       // console.log(showSeries.data);
      res.render('shows', result);
    })
});

app.listen(3000, function() {
  console.log('server is listening to port 3000');
});
