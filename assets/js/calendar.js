// assets/js/calendar.js
import { Calendar } from '@fullcalendar/core';
import icalParser from 'node-ical';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn-reserver');

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const calendarContainer = document.getElementById('calendar-container');
      calendarContainer.style.display = 'block'; // Affiche le calendrier
      calendarContainer.innerHTML = ''; // Vide l'ancien contenu

      // Détermine le lien ICS selon le bouton
      const isLiva = btn.dataset.logement === 'liva';
      const icsUrl = isLiva 
        ? '/calendar/liva'  // ton serveur iCal
        : '/calendar/blom';

      try {
        const res = await fetch(icsUrl);
        const text = await res.text();
        const eventsObj = icalParser.parseICS(text);

        // Transforme en format FullCalendar
        const events = Object.values(eventsObj)
          .filter(e => e.type === 'VEVENT')
          .map(e => ({
            title: e.summary,
            start: e.start,
            end: e.end,
            url: e.url || null
          }));

        // Crée le calendrier
        const calendar = new Calendar(calendarContainer, {
          initialView: 'dayGridMonth',
          events
        });
        calendar.render();
      } catch (err) {
        console.error('Erreur chargement ICS:', err);
        calendarContainer.innerHTML = '<p>Impossible de charger le calendrier.</p>';
      }
    });
  });
});
