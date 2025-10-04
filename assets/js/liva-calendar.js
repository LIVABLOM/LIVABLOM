document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    height: "100%",
    displayEventTime: false,

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },

    // ✅ Chargement des réservations iCal (LIVA)
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch(
          "https://livablom-stripe-production.up.railway.app/api/calendar/liva"
        );
        if (!response.ok) throw new Error("Erreur réseau");

        const reservations = await response.json();

        const events = reservations.map((r) => ({
          title: "Réservé",
          start: r.start,
          end: r.end,
          color: "red",
          allDay: true,
        }));

        successCallback(events);
      } catch (error) {
        console.error("Erreur de chargement du calendrier :", error);
        failureCallback(error);
      }
    },

    // ✅ Lorsqu’on clique sur une date libre
    dateClick: async function (info) {
      const clickedDate = new Date(info.dateStr);
      const now = new Date();

      if (clickedDate < now) {
        alert("Impossible de réserver une date passée.");
        return;
      }

      // ✅ Vérifier si la date est déjà réservée
      const events = calendar.getEvents();
      const isBooked = events.some((event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        return clickedDate >= start && clickedDate < end;
      });

      if (isBooked) {
        alert("Cette date est déjà réservée.");
        return;
      }

      // ✅ Demande du nombre de personnes
      const guests = prompt(
        "Combien de personnes séjourneront ? (minimum 2 personnes)"
      );
      if (!guests || isNaN(guests) || guests < 2) {
        alert("Veuillez entrer un nombre valide (minimum 2 personnes).");
        return;
      }

      // ✅ Calcul du tarif
      const basePrice = 79;
      const extraPrice = Math.max(0, guests - 2) * 20; // +20€ par personne supplémentaire
      const totalPrice = basePrice + extraPrice;

      const confirmMsg = `Réservation pour le ${info.dateStr}\nNombre de personnes : ${guests}\nTarif total : ${totalPrice} €\n\nSouhaitez-vous procéder au paiement ?`;

      if (confirm(confirmMsg)) {
        try {
          const checkoutResponse = await fetch(
            "https://livablom-stripe-production.up.railway.app/api/checkout",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lodging: "LIVA",
                date: info.dateStr,
                guests: parseInt(guests),
                amount: totalPrice * 100, // Stripe en centimes
              }),
            }
          );

          const data = await checkoutResponse.json();
          if (data.url) {
            window.location.href = data.url; // Redirection vers Stripe Checkout
          } else {
            alert("Une erreur est survenue pendant la redirection Stripe.");
          }
        } catch (error) {
          console.error("Erreur Stripe :", error);
          alert("Impossible de démarrer le paiement. Vérifiez votre connexion.");
        }
      }
    },
  });

  calendar.render();
});
