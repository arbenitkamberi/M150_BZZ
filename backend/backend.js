var validators = require('../src/Validators/Validators.js');
var angebote = require('../src/angebote.json');
var angeboteIds = angebote.filter(angebot => angebot != null).map(angebot => angebot.id);

var sha256 = require('js-sha256').sha256;

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

var express = require('express');
var app = express();

var SimpleNodeLogger = require('simple-node-logger');
var logger = SimpleNodeLogger.createSimpleLogger({
  logFilePath:'backend.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
});
logger.setLevel('trace');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessAdapter = new FileSync('sessions.json', {defaultValue: []});
const sessDB = low(sessAdapter);
var session = require('express-session');
var LowdbStore = require('lowdb-session-store')(session);
var sessionProps = {
  store: new LowdbStore(sessDB, {
    ttl: 86400
  }),
  resave: false,
  saveUninitialized: false,
  secret: "M183BZZ",
  rolling: true,
  cookie: {
    secure: false,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000
  }
};
app.use(session(sessionProps));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(function (err, req, res, next) {
  if (err) {
    logger.log('error', err);
  }
});

db.defaults({
  users: [
    {
      id: 1,
      geschlecht: "M", //Mögliche Werte: M/W/A
      vorname: "Arbenit",
      nachname: "Kamberi",
      email: "arben_a.k@hotmail.com",
      passwort: "cf0b854f5a17fdad773d462438d4d7328722b817d40a74ecb8d9ad79f98aa251",
      tel: "0793251749",
      role: "ADMIN",
      reservationen: []
    }
  ],
  usersIdSequence: 1,
  reservationenIdSequence: 0
}).write();


app.post('/benutzer/login', function (req, res) {
  let user = db.get("users").find({email: req.body.email, passwort: sha256(req.body.passwort)}).value();
  if(typeof user !== 'undefined'){
    req.session.userId = user.id;
    logger.log('trace', `Benutzer mit Email ${req.body.email} angemeldet, role: ${user.role}`);
    res.status(200).json({role: user.role});
  }
  else{
    logger.log('info', `Email ${req.body.email} nicht gefunden oder falsches Passwort`);
    res.sendStatus(404);
  }
});

app.get('/benutzer/logout', function (req, res) {
  logger.log('trace', `Benutzer mit id ${req.session.userId} loggt sich aus`);
  req.session.userId = null;
  req.session.destroy();
  res.location("/index.html");
});


app.post('/benutzer/register', function (req, res) {
  logger.log('info', `Neuer Benutzer wird angelegt`);
  let newUser = userWithOnlyAcceptedAttributes(req.body);
  let errors = validators.validateUser(newUser);
  if(errors.length > 0){
    logger.log('warn', `Ungültige Werte gefunden beim Registrieren: ${JSON.stringify(errors)}`);
    res.status(400).json(errors);
  }
  else if (typeof db.get("users").find({email: newUser.email}).value() !== 'undefined'){
    logger.log('error', `Email existiert bereits: ${newUser.email}`);
    res.sendStatus(409);
  }
  else{
    newUser.passwort = sha256(newUser.passwort);
    db.update('usersIdSequence', n => {
      newUser.id = ++n;
      return newUser.id;
    }).write();
    db.get('users').push(newUser).write();
    req.session.userId = newUser.id;
    logger.log('info', `Neuer Benutzer angelegt: ${JSON.stringify(newUser)}`);
    res.status(200).json({role: newUser.role});
  }
});

app.post('/reservation/neu', function (req, res) {
  if(typeof req.session.userId === 'number'){
    logger.log('trace', `Neue Reservation wird angelegt: ${JSON.stringify(req.body)}`);
    let newReservation = reservationWithOnlyAcceptedAttributes(req.body);
    let errors = validators.validateReservation(newReservation);
    if(errors.length > 0){
      logger.log('warn', `Ungültige Werte gefunden bei Reservation: ${JSON.stringify(errors)}`);
      res.status(400).json(errors);
    }
    else{
      db.update("reservationenIdSequence", n => {
        newReservation.id = ++n;
        return newReservation.id;
      }).write();
      db.get("users").find({id: req.session.userId}).get("reservationen").push(newReservation).write();
      logger.log('info', `Neue Reservation: ${JSON.stringify(newReservation)}`);
      res.sendStatus(200);
    }
  }
  else {
    logger.log('warn', `Nicht angemoldener Benutzer versuchte einen Termin zu reservieren`);
    res.sendStatus(403);
  }
});

app.get('/reservation/BenutzerMitReservationen', function (req, res) {
  if(typeof req.session.userId === 'number'){
    let user = db.get("users").find({id: req.session.userId}).value();
    if(user.role !== "ADMIN"){
      logger.log('warn', `Ein Benutzer ohne Adminrechte versuchte Benutzer mit Reservationen abzurufen`);
      res.sendStatus(401);
    }
    else{
      let users = db.get("users").filter((user, index, array) => {
        let hasNichtBestaetigteReservationen = false;
        user.reservationen.forEach(reservation => {
          if(!reservation.bestaetigt){
            hasNichtBestaetigteReservationen = true;
          }
        });
        return hasNichtBestaetigteReservationen;
      }).value() || [];
      logger.log('trace', `Es wurden Benutzer mit Reservationen abgerufen, anzahl zurückgegebener Benutzer: ${users.length}`);
      res.status(200).json(users.map(user => {return {...user, passwort: null}}));
    }
  }
  else {
    logger.log('warn', `Nicht angemodener Benutzer versuchte Benutzer mit Reservationen abzurufen`);
    res.sendStatus(403);
  }
});

app.get('/reservation/bestaetigen/:userId/:reservationId', function (req, res) {
  let userId = parseInt(req.params.userId, 10);
  let reservationId = parseInt(req.params.reservationId, 10);
  logger.log('trace', `Reservationsbestätigung: Reservation mit ID ${reservationId} des Benutzers mit ID ${userId}`);
  if(typeof req.session.userId === 'number'){
    let user = db.get("users").find({id: req.session.userId}).value();
    if(user.role === "ADMIN"){
      let reservation = db.get("users").find({id: userId}).get("reservationen").find({id: reservationId});
      if(typeof reservation.value() !== 'undefined'){
        reservation.assign({bestaetigt: true}).write();
        logger.log('info', `Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} bestätigt`);
        res.sendStatus(200);
      }
      else{
        logger.log('error', `Reservationsbestätigung: Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} nicht gefunden`);
        res.sendStatus(404);
      }
    }
    else{
      logger.log('warn', `Ein Benutzer ohne Adminrechte versuchte Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} zu bestätigen`);
      res.sendStatus(401);
    }
  }
  else{
    logger.log('warn', `Nicht angemodener Benutzer versuchte Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} zu bestätigen`);
    res.sendStatus(403);
  }
});

app.get('/reservation/loeschen/:userId/:reservationId', function (req, res) {
  let userId = parseInt(req.params.userId, 10);
  let reservationId = parseInt(req.params.reservationId, 10);
  logger.log('trace', `Reservationslöschung: Reservation mit ID ${reservationId} des Benutzers mit ID ${userId}`);
  if(typeof req.session.userId === 'number'){
    let user = db.get("users").find({id: req.session.userId}).value();
    if(user.role === "ADMIN"){
      let kunde = db.get("users").find({id: userId});
      let reservation = kunde.get("reservationen").find({id: reservationId}).value();
      if(typeof reservation !== 'undefined'){
        kunde.get("reservationen").remove({id: reservationId}).write();
        logger.log('info', `Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} gelöscht`);
        res.sendStatus(200);
      }
      else{
        logger.log('error', `Reservationslöschung: Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} nicht gefunden`);
        res.sendStatus(404);
      }
    }
    else{
      logger.log('warn', `Ein Benutzer ohne Adminrechte versuchte Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} zu löschen`);
      res.sendStatus(401);
    }
  }
  else{
    logger.log('warn', `Nicht angemodener Benutzer versuchte Reservation mit ID ${reservationId} des Benutzers mit ID ${userId} zu löschen`);
    res.sendStatus(403);
  }
});


app.listen(8080, function () {
  console.log('app listening on port 8080!');
});


function userWithOnlyAcceptedAttributes(user){
  return {
    id: null,
    geschlecht: user.geschlecht,
    vorname: user.vorname,
    nachname: user.nachname,
    email: user.email,
    passwort: user.passwort,
    tel: user.tel,
    role: "USER",
    reservationen: []
  };
}

function reservationWithOnlyAcceptedAttributes(reservation){
  return {
    id: null,
    bestaetigt: false,
    datum: reservation.datum,
    uhrzeit: reservation.uhrzeit,
    services: reservation.services.filter(service => angeboteIds.includes(service)),
    nachricht: reservation.nachricht
  };
}