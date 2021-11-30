const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const app = express();
// use Heroku's process.env.PORT value when deployed and 3001 when run locally
const PORT = process.env.PORT || 3001;
const path = require('path'); 

// tell Handlebars.js about the helpers file
const helpers = require('./utils/helpers'); // for help formatting dates

const exphbs = require('express-handlebars');

// pass the helpers to the existing exphbs.create() statement
const hbs = exphbs.create({ helpers });

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.SS,
  cookie: {},
  maxAge: 300000, // 5 min
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.static(path.join(__dirname, 'public'))); // link static files
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });

