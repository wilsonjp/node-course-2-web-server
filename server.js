const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
// Express middleware is executed in the procedural order
app.set('view engine', 'hbs');
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now} ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log +'\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// This middleware doesn't call next, so execution
// stops here
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('capitalize', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('welcome.hbs', {
    pageTitle: 'Welcome Page',
    welcomeMessage: 'Welcome, New Visitor!',
    // copyright: new Date().getFullYear()
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // copyright: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "Bad URL"
  });
});

app.listen(3000, console.log(`Server is up on port 3000`));
