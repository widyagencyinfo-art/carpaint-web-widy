/* =====================================================================
   CarPaint Tavernes — comportamiento
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.CP || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- datos de contacto en toda la página ---------- */
  function waURL(txt) {
    return "https://wa.me/" + CFG.whatsapp + (txt ? "?text=" + encodeURIComponent(txt) : "");
  }
  var WA_DEF = "Hola, os escribo desde la web. Quería pedir presupuesto para mi vehículo.";
  $$(".js-wa").forEach(function (a) {
    a.href = waURL(a.getAttribute("data-msg") || WA_DEF);
    a.target = "_blank"; a.rel = "noopener";
  });
  $$(".js-tel").forEach(function (a) { a.href = "tel:" + CFG.telefonoTel; });
  $$(".js-tel-txt").forEach(function (el) { el.textContent = CFG.telefono; });
  $$(".js-ig").forEach(function (a) { a.href = CFG.instagram; a.target = "_blank"; a.rel = "noopener"; });
  $$(".js-igdm").forEach(function (a) { a.href = CFG.instagramDM || CFG.instagram; a.target = "_blank"; a.rel = "noopener"; });

  var mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.mapsQ || "");
  $$(".js-maps").forEach(function (a) { a.href = mapsLink; a.target = "_blank"; a.rel = "noopener"; });
  $$(".js-calle").forEach(function (el) { el.textContent = CFG.calle; });
  $$(".js-ciudad").forEach(function (el) { el.textContent = CFG.ciudad; });

  /* ---------- horario ---------- */
  var hoursEl = $("#hours");
  if (hoursEl && CFG.horario) {
    hoursEl.innerHTML = CFG.horario.map(function (d) {
      return '<li' + (d.cerrado ? ' class="is-closed"' : '') + '><span>' + d.dia + "</span><span>" + d.h + "</span></li>";
    }).join("");
  }

  /* ---------- mapa ---------- */
  var map = $("#map");
  if (map && CFG.lat) {
    var d = 0.0035;
    var bbox = [CFG.lon - d * 1.8, CFG.lat - d, CFG.lon + d * 1.8, CFG.lat + d].join("%2C");
    map.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox +
              "&layer=mapnik&marker=" + CFG.lat + "%2C" + CFG.lon;
  }

  /* ---------- mapa: no roba el scroll hasta que lo tocas ---------- */
  var mapBox = $(".shop__map");
  if (mapBox) {
    mapBox.addEventListener("click", function () { mapBox.classList.add("is-live"); });
    window.addEventListener("scroll", function () { mapBox.classList.remove("is-live"); }, { passive: true });
  }

  /* ---------- header ---------- */
  var hdr = $("#hdr");
  function onScroll() { hdr.classList.toggle("hdr--stuck", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = $("#burger"), nav = $("#nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- antes / después ---------- */
  var ba = $("#ba");
  if (ba) {
    var clip = $(".ba__clip", ba), bar = $(".ba__bar", ba), knob = $(".ba__knob", ba);
    var imgA = $("#ba-a"), imgB = $("#ba-b"), cap = $("#ba-cap");

    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      clip.style.width = pct + "%";
      bar.style.left = pct + "%";
      knob.style.left = pct + "%";
      knob.setAttribute("aria-valuenow", Math.round(pct));
    }
    function fromEvent(e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      setPos((x / r.width) * 100);
    }
    function sizeClip() { clip.style.setProperty("--sw", ba.getBoundingClientRect().width + "px"); }
    sizeClip();
    window.addEventListener("resize", sizeClip);

    var dragging = false;
    function down(e) { dragging = true; fromEvent(e); }
    function move(e) { if (dragging) { fromEvent(e); if (e.cancelable) e.preventDefault(); } }
    function up() { dragging = false; }
    ba.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    ba.addEventListener("touchstart", down, { passive: true });
    ba.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    knob.addEventListener("keydown", function (e) {
      var cur = parseFloat(clip.style.width) || 50;
      if (e.key === "ArrowLeft")  { setPos(cur - 4); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(cur + 4); e.preventDefault(); }
    });

    /* casos */
    $$(".ba__tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".ba__tab").forEach(function (b) { b.classList.toggle("is-on", b === btn); });
        imgA.src = btn.getAttribute("data-a");
        imgB.src = btn.getAttribute("data-b");
        cap.textContent = btn.getAttribute("data-cap");
        setPos(50);
      });
    });
    setPos(50);
  }

  /* ---------- presupuesto ---------- */
  var qOut = $("#q-send");
  if (qOut) {
    var pick = { dano: "", veh: "", plazo: "" };

    function pintar(id, lista, clave) {
      var box = $(id);
      if (!box) return;
      box.innerHTML = lista.map(function (t) {
        return '<button type="button" class="q__opt" data-v="' + t + '">' + t + "</button>";
      }).join("");
      $$(".q__opt", box).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".q__opt", box).forEach(function (o) { o.classList.toggle("is-on", o === b); });
          pick[clave] = b.getAttribute("data-v");
          refrescar();
        });
      });
    }
    var P = CFG.presupuesto || {};
    pintar("#q-dano", P.danos || [], "dano");
    pintar("#q-veh", P.vehiculos || [], "veh");
    pintar("#q-plazo", P.plazos || [], "plazo");

    function refrescar() {
      var modelo = ($("#q-modelo") || {}).value || "";
      var t = "Hola, os escribo desde la web de CarPaint.\n\n";
      if (pick.veh)   t += "• Vehículo: " + pick.veh + (modelo ? " (" + modelo + ")" : "") + "\n";
      else if (modelo) t += "• Vehículo: " + modelo + "\n";
      if (pick.dano)  t += "• Necesito: " + pick.dano + "\n";
      if (pick.plazo) t += "• Cuándo: " + pick.plazo + "\n";
      t += "\nOs mando una foto y me decís presupuesto, ¿vale?";
      qOut.href = waURL(t);
    }
    var modeloIn = $("#q-modelo");
    if (modeloIn) modeloIn.addEventListener("input", refrescar);
    qOut.target = "_blank"; qOut.rel = "noopener";
    refrescar();
  }

  /* ---------- galería + lightbox ---------- */
  var lb = $("#lb"), lbImg = $("#lb-img");
  var fotos = $$(".work__i"), idx = 0;
  function abrir(i) {
    idx = (i + fotos.length) % fotos.length;
    var im = $("img", fotos[idx]);
    lbImg.src = im.getAttribute("data-full") || im.src;
    lbImg.alt = im.alt;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function cerrar() { lb.hidden = true; document.body.style.overflow = ""; }
  fotos.forEach(function (b, i) { b.addEventListener("click", function () { abrir(i); }); });
  if (lb) {
    $("#lb-x").addEventListener("click", cerrar);
    $("#lb-p").addEventListener("click", function (e) { e.stopPropagation(); abrir(idx - 1); });
    $("#lb-n").addEventListener("click", function (e) { e.stopPropagation(); abrir(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) cerrar(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowLeft") abrir(idx - 1);
      if (e.key === "ArrowRight") abrir(idx + 1);
    });
  }

  /* ---------- aparición al hacer scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.04 });
    $$(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(el);
    });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
