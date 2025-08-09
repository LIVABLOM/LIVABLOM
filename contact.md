<h2>Réserver votre séjour</h2>

<form action="https://formspree.io/f/xxxxxxxx" method="POST">
  <label for="liva-dates">Dates LIVA :</label>
  <input id="liva-dates" name="dates-liva" placeholder="Choisir vos dates pour LIVA">

  <label for="blom-dates">Dates BLŌM :</label>
  <input id="blom-dates" name="dates-blom" placeholder="Choisir vos dates pour BLŌM">

  <label for="message">Votre message :</label>
  <textarea name="message" id="message" required></textarea>

  <button type="submit">Envoyer</button>
</form>

<!-- Flatpickr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/ical.js"></script>
<script>
async function getUnavailableDates(icalUrl) {
  const response = await fetch(icalUrl);
  const text = await response.text();
  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");
  let dates = [];

  events.forEach(event => {
    const e = new ICAL.Event(event);
    const start = e.startDate.toJSDate();
    const end = e.endDate.toJSDate();
    let current = new Date(start);
    while (current < end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  return dates;
}

(async () => {
  const livaDates = await getUnavailableDates("https://calendar.google.com/calendar/ical/25b3ab9fef930d1760a10e762624b8f604389bdbf69d0ad23c98759fee1b1c89%40group.calendar.google.com/private-13c805a19f362002359c4036bf5234d6/basic.ics");
  const blomDates = await getUnavailableDates("https://calendar.google.com/calendar/ical/c686866e780e72a89dd094dedc492475386f2e6ee8e22b5a63efe7669d52621b%40group.calendar.google.com/private-a78ad751bafd3b6f19cf5874453e6640/basic.ics");

  flatpickr("#liva-dates", {
    mode: "range",
    dateFormat: "Y-m-d",
    disable: livaDates
  });

  flatpickr("#blom-dates", {
    mode: "range",
    dateFormat: "Y-m-d",
    disable: blomDates
  });
})();
</script>
