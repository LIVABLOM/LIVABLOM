---
layout: default
id: index
---

<style>
  .logements-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding: 40px 20px;
    text-align: center;
  }

  .logement {
    flex: 1 1 300px;
    max-width: 450px;
  }

  .logement img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0,0,0,0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .logement img:hover {
    transform: scale(1.03);
    box-shadow: 0 0 18px rgba(37, 211, 102, 0.6);
  }

  .logement h2 {
    margin-top: 15px;
    color: #25D366;
  }

  .logement p {
    font-size: 0.95rem;
    color: #ccc;
    margin: 10px 0;
  }

  .logement a.bouton {
    display: inline-block;
    margin-top: 10px;
    background-color: #25D366;
    color: black;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .logement a.bouton:hover {
    background-color: #1da955;
  }

  @media (max-width: 600px) {
    .logement {
      max-width: 100%;
    }

    .logement p {
      font-size: 0.9rem;
    }
  }
</style>

<section class="logements-container" style="margin-top: 160px;">

  <!-- LIVA -->
  <div class="logement">
    <a href="/LIVABLOM/liva">
      <img src="/LIVABLOM/assets/images/salon1.jpg" alt="LIVA appartement">
    </a>
    <h2>🔹 LIVA</h2>
    <p>Appartement cosy et tout équipé, parfait pour les familles, couples ou télétravailleurs.</p>
    <a href="/LIVABLOM/liva" class="bouton">Réserver LIVA</a>
  </div>

  <!-- BLOM -->
  <div class="logement">
    <a href="/LIVABLOM/blom">
      <img src="/LIVABLOM/assets/images/image-jacuzzi.png" alt="BLŌM maison d’hôtes">
    </a>
    <h2>🔹 BLŌM</h2>
    <p>Maison d’hôtes détente avec spa, lit king size, petit déjeuner et bien-être assuré.</p>
    <a href="/LIVABLOM/blom" class="bouton">Réserver BLŌM</a>
  </div>

</section>
