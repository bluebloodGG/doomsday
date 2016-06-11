var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  firebase = require('firebase');


app.use(bodyParser.json());

firebase.initializeApp({
  databaseURL: process.env.FB_DATABASEURL,
  serviceAccount: {
    "project_id": process.env.FB_PROJECTID,
    "private_key": process.env.FB_PRIVATEKEY,
    "client_email": process.env.FB_CLIENTEMAIL
  }
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/highscores", function (req, res) {
  firebase.database().ref('highscores').orderByChild('score').limitToLast(10).once('value').then(function (snapshot) {
    var result = [];
    snapshot.forEach(function (child) {
      result.unshift(child.val());
    });


    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });

});

app.post('/highscore', function (req, res, next) {
  console.log(req.body); // populated!

  firebase.database().ref('highscores/').push(req.body);


  res.send(req.body);
});

app.use(express.static(__dirname));

app.listen(process.env.PORT || 8080);
