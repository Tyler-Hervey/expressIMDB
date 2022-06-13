var express = require('express');
var router = express.Router();
const axios = require('axios');
const app = require('../app');
const { route } = require('../app');

const apiKey = '3e1cd75b1ea1641cf920dc53676c2005';
const apiBaseUrl = 'https://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w300';
const IMDBBaseUrl = 'https://imdb.com/title/'
// expose vars to EJS view
router.use((req,res,next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  res.locals.IMDBBaseUrl = IMDBBaseUrl;
  next();
})

/* GET home page. */
router.get('/', function(req, res, next) {

  axios.get(nowPlayingUrl)
  .then(function (response) {
    // handle success
    const { data } = response;
    res.render('index', {
      parsedData: data.results
    })
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

  // res.render('index', { title: 'Express' });
});

router.get('/movie/:id', (req,res, next) => {
  // res.render('single-movie', {
  //   movieId: req.params.id
  // })
  thisMovieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;

  // Make request with Axios to get api data
    axios.get(thisMovieUrl)
    .then(function (response) {
      // handle success
      const { data } = response;
      res.render('single-movie', {
        movieData: data
      })

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

})

router.post('/search', (req, res, next) => {
  // res.send('sanity check')
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}/?query=${userSearchTerm}&api_key=${apiKey}`;

  axios.get(movieUrl)
  .then(function (response) {
    // handle success
    let { results } = response.data;
    // res.render('index', {
    //   parsedData: data.results
    // })
    if (cat === 'person') {
      results = results[0].known_for;
    }
    res.render('index', {
      parsedData: results
    })
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
})

module.exports = router;
