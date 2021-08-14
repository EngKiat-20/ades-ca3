const express = require('express');
const cors = require('cors');
const {customAlphabet} = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const app = express();

app.use(cors())
app.use(express.json())

const user = require('../database/databaseConnect.js');

const sessions = {};
const playerName = {};
const playerData = {};

app.post('/session', function (req, res, next) {
    const sessionId = nanoid();
    sessions[sessionId] = 1;

    res.json({
        session_id: sessionId,
    });
})

app.post('/setName', function (req, res, next) {
  const playerUsername = req.body.player_username; 
  res.json({
      player_name: playerUsername,
  });
})

app.post('/score', function (req, res, next) {
  console.log('req', req)
  const playerUsername = req.body.player_name;
  const playerFinalScore = req.body.final_score; 
  res.json({
      player_name: playerUsername,
      final_score: playerFinalScore
  });

  user.submitScore(playerUsername, playerFinalScore, function (err, result) {
    if (!err) {
        console.log(result);
        res.send(result + ' record inserted');
    } else{
        res.send(err.statusCode);

    }
  });
})

app.get('/topScore', function (req, res, next) {
  user.topScore(function (err, result) {
    if (!err) {
        console.log(result);
        res.send(result);
    } else{
        res.send(err.statusCode);

    }
  });
})

app.listen(process.env.port || 8000, function () {
  console.log('CORS-enabled web server listening on port '+process.env.port)
})
