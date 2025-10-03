const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// URLs ICS de Google Calendar
const CALENDAR_LIVA = "https://calendar.google.com/calendar/ical/25b3ab9fef930d1760a10e762624b8f604389bdbf69d0ad23c98759fee1b1c89%40group.calendar.google.com/private-13c805a19f362002359c4036bf5234d6/basic.ics";
const CALENDAR_BLOM = "https://calendar.google.com/calendar/ical/c686866e780e72a89dd094dedc492475386f2e6ee8e22b5a63efe7669d52621b%40group.calendar.google.com/private-a78ad751bafd3b6f19cf5874453e6640/basic.ics";

// Middleware pour éviter les blocages CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Route pour LIVA
app.get("/liva.ics", async (req, res) => {
  try {
    const response = await axios.get(CALENDAR_LIVA);
    res.type("text/calendar").send(response.data);
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du calendrier LIVA");
  }
});

// Route pour BLOM
app.get("/blom.ics", async (req, res) => {
  try {
    const response = await axios.get(CALENDAR_BLOM);
    res.type("text/calendar").send(response.data);
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du calendrier BLOM");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});

