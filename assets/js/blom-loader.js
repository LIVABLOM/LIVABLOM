document.getElementById("reserveBlom").addEventListener("click", async () => {
  const modal = document.getElementById("calendarModalBlom");

  // Charger le HTML du calendrier
  const html = await fetch("/assets/html/blom-calendar.html").then(r => r.text());
  modal.innerHTML = html;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
});
