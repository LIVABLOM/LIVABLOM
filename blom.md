---
layout: default
title: BLŌM – Spa privatif et hébergement romantique à Guesnain
description: "Offrez-vous une parenthèse romantique à BLŌM : logement de charme, spa privatif, détente et petit‑déjeuner inclus."
image: "/assets/galerie/blom/blom22.jpg"
permalink: /blom/
---

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

    <p class="text-lg text-center max-w-2xl mx-auto mt-4 animate-fadeIn delay-50">
      Découvrez BLŌM, un refuge romantique où le bien‑être prend tout son sens
      · Au rez-de-chaussée, un salon chaleureux invite à la détente, tandis que le spa privatif vous enveloppe dans une atmosphère paisible. Une table élégamment dressée vous attend pour des moments de partage à deux.
      · À l’étage, un espace dédié au bien-être : une chambre spacieuse et raffinée, une douche moderne et une salle de massage apaisante. Chaque détail est pensé pour offrir sérénité, volupté et moments intimes.
    </p>

    <!-- Bandeau hygiène -->
    <div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-pulse">
      Le spa est vidé, désinfecté et rempli pour chaque client – Vidéo envoyée le jour de votre arrivée 📹
    </div>

    <!-- Bloc 1 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-200 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/image-jacuzzi.png" alt="Jacuzzi privatif"
             class="w-full h-auto max-w-full object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Jacuzzi privatif</h2>
        <p>Chez BLŌM, l’eau de votre spa est totalement vidée et renouvelée pour chaque nouveau client. Vous êtes assurés d’une hygiène parfaite et d’une expérience 100 % privative. Jacuzzi intérieur à température idéale pour un moment de détente à deux. Ambiance tamisée et intimité garantie.</p>
      </div>
    </div>

    <!-- Bloc 2 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-300 transition-all">
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom31.jpg" alt="Table de massage manuelle"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom37.jpg" alt="Table de massage électrique"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Espace Massage</h2>
        <p>Deux types de massage : manuel à partager en duo, ou table de massage électrique avec 16 programmes et fonction chauffante, parfaite pour un moment de détente en solo ou à deux.</p>
      </div>
    </div>

    <!-- Bloc 3 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-400 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom13.jpg" alt="Lit king size et coin salon"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Lit King Size & Salon</h2>
        <p>Un lit spacieux avec coin salon et TV connectée. Idéal pour un séjour romantique dans un cadre cosy.</p>
      </div>
    </div>

    <!-- Bloc 4 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-500 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom10.jpg" alt="Table romantique dressée"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Table Romantique</h2>
        <p>Vous souhaitez apporter votre dîner ? Une table romantique vous attend, dressée avec soin pour sublimer votre soirée.</p>
      </div>
    </div>

    <!-- Bloc témoignages -->
    <div class="mt-20 bg-black text-white">
      <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez BLŌM</h2>
      <div class="relative max-w-3xl mx-auto overflow-hidden">
        <div id="carousel" class="flex transition-transform duration-700">
          {% for avis in site.data.avis_blom %}
          <div class="min-w-full px-4 cursor-pointer" onclick="openModal({{ forloop.index0 }})">
            <p class="italic text-lg truncate">“{{ avis.texte | truncate: 100 }}”</p>
            <span class="block mt-2 text-sm text-gray-400">– {{ avis.auteur }}</span>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>

    <!-- Modal témoignages -->
    <div id="testimonialModal" class="hidden fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div class="bg-black text-white max-w-2xl p-6 rounded-xl relative">
        <button id="closeBtn" class="absolute top-2 right-2 text-white text-xl">✖</button>
        <div id="modalText" class="whitespace-pre-line"></div>
        <div class="flex justify-between mt-4">
          <button id="prevBtn" class="px-4 py-2 bg-gray-700 rounded">◀</button>
          <button id="nextBtn" class="px-4 py-2 bg-gray-700 rounded">▶</button>
        </div>
      </div>
    </div>

    <!-- Scripts carrousel + modal -->
    <script>
    document.addEventListener("DOMContentLoaded", () => {
  initCalendarBlom();
});

      let currentIndex = 0;
      const carousel = document.getElementById("carousel");
      const items = carousel.children;
      const totalItems = items.length;

      const fullTestimonials = [
        {% for temoignage in site.data.avis_blom %}
        `{{ temoignage.texte | strip_newlines | escape }}`,
        {% endfor %}
      ];

      function showCarouselSlide(index) {
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
      }

      setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        showCarouselSlide(currentIndex);
      }, 5000);

      Array.from(items).forEach((item, i) => {
        item.addEventListener("click", () => {
          currentIndex = i;
          updateModalText();
          document.getElementById("testimonialModal").classList.remove("hidden");
          document.getElementById("testimonialModal").classList.add("flex");
        });
      });

      function updateModalText() {
        document.getElementById("modalText").innerText = fullTestimonials[currentIndex];
      }

      document.getElementById("prevBtn").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + fullTestimonials.length) % fullTestimonials.length;
        updateModalText();
      });
      document.getElementById("nextBtn").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % fullTestimonials.length;
        updateModalText();
      });
      document.getElementById("closeBtn").addEventListener("click", () => {
        document.getElementById("testimonialModal").classList.add("hidden");
        document.getElementById("testimonialModal").classList.remove("flex");
      });
    });
    </script>

<!-- Appel à l'action : Réserver BLŌM -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto">
  <h3 class="text-2xl font-bold mb-2">Réservez BLŌM</h3>
  <p class="mb-4">Logement avec spa privatif et prestations bien-être</p>

  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <button id="reserveBlom"
            class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </button>
    {% include share.html %}
  </div>
</div>

<!-- Modal calendrier BLŌM -->
<div id="calendarModalBlom"
     class="fixed inset-0 bg-black bg-opacity-90 hidden items-center justify-center z-50 px-4"
     onclick="closeCalendarBlom(event)">
  <div class="bg-gray-900 text-white rounded-xl shadow-xl relative w-full max-w-5xl mx-auto p-6"
       onclick="event.stopPropagation()">
    <button onclick="closeCalendarBlom()"
            class="absolute top-2 right-4 text-3xl font-bold text-gray-400 hover:text-white">&times;</button>
    <h3 class="text-2xl font-bold text-center mt-2 mb-4">Calendrier BLŌM</h3>

    <!-- Calendrier -->
    <div id="calendar-container-blom" class="w-full h-[500px] md:h-[600px]"></div>

    <!-- Panneau de sélection -->
    <div id="bookingPanelBlom" class="hidden mt-5 bg-gray-800 p-4 rounded-lg">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm mb-1 opacity-80">Arrivée</label>
          <input id="arrivalBlom" type="text" readonly class="w-full px-3 py-2 rounded text-black" />
        </div>
        <div>
          <label class="block text-sm mb-1 opacity-80">Nuits</label>
          <div class="flex items-center gap-2">
            <button type="button" onclick="adjustNightsBlom(-1)" class="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">−</button>
            <input id="nightsBlom" type="number" min="1" value="1" class="w-20 px-3 py-2 rounded text-black" />
            <button type="button" onclick="adjustNightsBlom(1)" class="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">+</button>
          </div>
          <p id="maxInfoBlom" class="text-xs opacity-70 mt-1"></p>
        </div>
        <div>
          <label class="block text-sm mb-1 opacity-80">Départ</label>
          <input id="departureBlom" type="text" readonly class="w-full px-3 py-2 rounded text-black" />
        </div>
        <div class="sm:text-right">
          <button id="confirmBlom" class="w-full sm:w-auto px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 font-semibold">
            Continuer
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FullCalendar -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<style>
/* Style sombre du calendrier */
.fc { background-color: #1a1a1a; color: white; border-radius: 12px; padding: 10px; }
.fc-toolbar-title { font-size: 1.2rem; font-weight: 700; color: white; }
.fc-button { background:#333 !important; color:white !important; border:none !important; border-radius:6px !important; }
.fc-button:hover { background:#555 !important; }
.fc-day-today { background: rgba(59,130,246,.3) !important; border: 2px solid #3b82f6 !important; }
/* curseur main sur toute la cellule */
.fc-daygrid-day-frame { cursor: pointer; }
</style>

<script>
/* ---------- Ouverture/fermeture du modal ---------- */
function openCalendarBlom() {
  const modal = document.getElementById("calendarModalBlom");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (!window.calendars || !window.calendars["BLOM"]) {
    initCalendarBlom();
  }
}
function closeCalendarBlom(event) {
  const modal = document.getElementById("calendarModalBlom");
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/* ---------- Helpers ---------- */
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function ymd(date) {
  const y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,'0'), d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

/* ---------- Init calendrier ---------- */
async function initCalendarBlom() {
  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
    const eventsRaw = await res.json();

    const toISODate = d => {
      const x = new Date(d);
      return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
    };

    // événements "réservé" en fond rouge (end exclusif)
    const events = (eventsRaw || []).map(ev => ({
      title: "Réservé",
      start: toISODate(new Date(ev.start)),
      end: toISODate(new Date(ev.end)),
      allDay: true,
      display: "background",
      backgroundColor: "#e63946"
    }));

    // set des jours bloqués
    window.blockedDatesBlom = new Set();
    for (const ev of events) {
      let d = new Date(ev.start + "T00:00:00");
      const end = new Date(ev.end + "T00:00:00");
      while (d < end) {
        window.blockedDatesBlom.add(ymd(d));
        d = addDays(d, 1);
      }
    }

    const el = document.getElementById("calendar-container-blom");
    if (!el) return;

    window.calendars = window.calendars || {};
    if (window.calendars["BLOM"]) { try { window.calendars["BLOM"].destroy(); } catch(e){} }

    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: { left: "prev,next today", center: "title", right: "" },
      events,
      displayEventTime: false,
      selectable: false,
      navLinks: false,
      dateClick: info => onDateClickBlom(info)
    });
    cal.render();
    window.calendars["BLOM"] = cal;

    // Délégation : clique sur toute la cellule (pas seulement le chiffre)
    el.addEventListener("click", e => {
      if (e.target.closest(".fc-event")) return;
      const cell = e.target.closest("[data-date]");
      if (!cell) return;
      const dateStr = cell.getAttribute("data-date");
      if (!dateStr) return;
      onDateClickBlom({ dateStr });
    });

  } catch (err) {
    console.error("[BLŌM] initCalendarBlom error:", err);
  }
}

/* ---------- Clic sur une date ---------- */
function onDateClickBlom(info) {
  const dateStr = info.dateStr;
  if (window.blockedDatesBlom && window.blockedDatesBlom.has(dateStr)) {
    alert("Cette date est déjà réservée.");
    return;
  }

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  document.getElementById("departureBlom").value = d.toISOString().split("T")[0];

  document.getElementById("bookingPanelBlom").classList.remove("hidden");
}

/* ---------- Ajuster les nuits ---------- */
function adjustNightsBlom(delta) {
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value, 10) + delta;
  if (isNaN(nights) || nights < 1) nights = 1;
  nightsInput.value = nights;

  const arrival = document.getElementById("arrivalBlom").value;
  if (arrival) {
    const d = new Date(arrival);
    d.setDate(d.getDate() + nights);
    document.getElementById("departureBlom").value = d.toISOString().split("T")[0];
  }
}

/* ---------- Brancher le bouton "Réserver maintenant" ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("reserveBlom");
  if (btn) btn.addEventListener("click", openCalendarBlom);
});
</script>
