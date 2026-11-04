/* =====================================================================
   CONFIG — lo único que hay que tocar.
   Cambia estos datos y toda la web se actualiza sola.
   ===================================================================== */
window.CP = {

  /* ---------- contacto ---------- */
  telefono:      "636 57 25 58",
  telefonoTel:   "+34636572558",
  whatsapp:      "34636572558",          // sin + ni espacios
  instagram:     "https://www.instagram.com/carpaint.chapapintura",
  instagramDM:   "https://ig.me/m/carpaint.chapapintura",
  email:         "",                      // ⚠️ PENDIENTE: si tenéis correo, aquí

  /* ---------- taller ---------- */
  calle:   "Carrer Marjaletes, 20",
  ciudad:  "46760 Tavernes de la Valldigna · Valencia",
  mapsQ:   "Car Paint, Carrer Marjaletes 20, Tavernes de la Valldigna",
  lat: 39.0725555,
  lon: -0.2600772,

  /* ⚠️ PENDIENTE: confirmar el horario real (Google dice que cerráis a las 18:30
     y abrís a las 8:00). Cambia aquí y se actualiza la tabla entera. */
  horario: [
    { dia: "Lunes a viernes", h: "8:00 – 13:30 · 15:00 – 18:30" },
    { dia: "Sábado",          h: "Cerrado", cerrado: true },
    { dia: "Domingo",         h: "Cerrado", cerrado: true }
  ],

  /* ---------- presupuesto por WhatsApp ---------- */
  presupuesto: {
    danos: ["Golpe o bollo", "Arañazos", "Parachoques", "Pintura completa",
            "Cambio de color", "Llantas", "Faros", "Moto o scooter", "Pulido / detailing"],
    vehiculos: ["Coche", "Moto", "Furgoneta", "Autocaravana"],
    plazos: ["Cuanto antes", "Esta semana", "Sin prisa", "Es parte de seguro"]
  }
};
