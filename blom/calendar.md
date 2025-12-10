---
layout: default
title: Calendrier BLŌM
permalink: /blom/calendar/
---


<h1>Calendrier des disponibilités — BLŌM</h1>


<div style="text-align:center; margin-bottom:12px;">
<a href="/blom/">← Retour vers BLŌM</a>
</div>


<!-- Conteneur du calendrier -->
<div id="calendar-blom"></div>


<!-- On charge le script unique de calendrier -->
<script src="/assets/js/calendar.js" defer></script>
<script>
// Initialise le calendrier BLŌM
document.addEventListener('DOMContentLoaded', function(){
if (typeof initCalendar === 'function') {
initCalendar({
elementId: 'calendar-blom',
logementKey: 'BLOM',
locale: 'fr'
});
} else {
console.error('initCalendar introuvable : /assets/js/calendar.js non chargé.');
}
});
</script>