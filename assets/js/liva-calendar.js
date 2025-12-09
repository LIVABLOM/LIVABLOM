// ========================================================
// 🌿 LIVA Calendar JS - Version Corrigée (départ réservable)
// ========================================================

(async function () {

  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc { background: #fff !important; color: #000 !important; }
    #calendar .fc-daygrid-day { background: #fdfdfd !important; border-color: #ddd !important; }
    #calendar .fc-daygrid-day[data-reserved="true"] {
      background: #ffcccc !important;
      opacity: 0.85;
      pointer-events: none !important;
    }
  `;

  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  function formatDate(d) {
    const date = new Date(d);
    return date.toISOString().split("T")[0];
  }

  document.addEventListener("DOMContentLoaded", async () => {

    const el = document.getElementById("calendar");
    if (!el) return;

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    let reservedRanges = [];

    // ***********************************************
    // CORRECTION : ne jamais bloquer le jour de départ
    // ***********************************************
    function isReservedDay(date) {
      return reservedRanges.some(r => {
        const start = new Date(r.start);
        const endMinusOne = new Date(r.end);
        endMinusOne.setDate(endMinusOne.getDate() - 1); // correction ici

        return date >= start && date <= endMinusOne;
      });
    }

    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      firstDay: 1,
      locale: "fr",
      selectable: true,

      selectAllow(sel) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel.start < today) return false;

        return !reservedRanges.some(r => sel.start < r.end && sel.end > r.start);
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data = await res.json();

          // On stocke les ranges brut
          reservedRanges = data.map(e => ({
            start: new Date(e.start),
            end: new Date(e.end)
          }));

          // On crée les événements FullCalendar
          success(
            reservedRanges.map(r => ({
              title: "Réservé",
              start: r.start,
              end: r.end, // FullCalendar affiche bien end comme non réservé
              display: "background",
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              allDay: true
            }))
          );

        } catch (err) {
          failure(err);
        }
      },

      dayCellDidMount(info) {
        // ***********************************************
        // CORRECTION : on colore du start au end-1 seulement
        // ***********************************************
        if (isReservedDay(info.date)) {
          info.el.setAttribute("data-reserved", "true");
        }
      },

      select(info) {
        const startStr = info.startStr.split("T")[0];
        const endStr = info.endStr.split("T")[0];

        document.getElementById("modal-dates").textContent =
          `Du ${formatDate(startStr)} au ${formatDate(endStr)}`;

        document.getElementById("reservationModal").style.display = "flex";
      }
    });

    cal.render();

    // Fermeture modal
    document.getElementById("res-cancel").addEventListener("click", () => {
      document.getElementById("reservationModal").style.display = "none";
      cal.unselect();
    });

  });

})();
