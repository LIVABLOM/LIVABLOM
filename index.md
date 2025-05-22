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
    margin-top: 120px; /* Réduction du décalage haut */
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
    m
