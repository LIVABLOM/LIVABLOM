function getTarif(date){
  const d = new Date(date);
  const day = d.getUTCDay();
  if(day === 0) return 190;
  if(day === 5 || day === 6) return 169;
  return 150;
}

document.addEventListener("DOMContentLoaded", function(){
  const el = document.getElementById("calendar");
  if(!el) return;

  const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  console.log("Backend URL:", backendUrl);

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,

    select: async info => {
      const start = info.startStr, end = info.endStr;
      let total = 0, cur = new Date(start), fin = new Date(end);
      while(cur < fin){ 
        total += getTarif(cur.toISOString().split("T")[0]); 
        cur.setDate(cur.getDate()+1); 
      }

      let montant = window.TEST_PAYMENT ? 1 : total;
      if(!confirm(`Réserver BLŌM du ${start} au ${end} pour ${montant} € ?`)) return;

      try{
        const res = await fetch(`${backendUrl}/api/checkout`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ logement:"BLOM", startDate:start, endDate:end, amount:montant })
        });
        const data = await res.json();
        if(data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch(err) { 
        console.error(err); 
        alert("Erreur lors de la création de la réservation."); 
      }
    },

    events: async (fetchInfo, success, failure) => {
      try{
        // Ajout du timestamp pour éviter le cache
        const url = `${backendUrl}/api/reservations/BLOM?ts=${Date.now()}`;
        console.log("Fetching events from:", url);

        const res = await fetch(url);
        if(!res.ok) throw new Error("Erreur serveur: " + res.status);

        const evts = await res.json();
        console.log("Réservations reçues du proxy:", evts);

        // Vérifie que toutes les dates sont bien des ISO strings
        const fcEvents = evts.map((e, i) => {
          const startISO = new Date(e.start).toISOString();
          const endISO = new Date(e.end).toISOString();
          console.log(`Event ${i}: start=${startISO}, end=${endISO}, summary=${e.summary}`);

          return {
            start: startISO,
            end: endISO,
            display: "background",
            color: "#ff0000",
            title: e.summary || "Réservé"
          };
        });

        console.log("Événements envoyés à FullCalendar:", fcEvents);
        success(fcEvents);
      } catch(err){
        console.error("Erreur chargement events:", err);
        failure(err);
      }
    }
  });

  cal.render();
});
