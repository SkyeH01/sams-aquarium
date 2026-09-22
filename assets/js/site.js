/* ==========================================================================
   Sam's Aquarium — site.js
   Plain JavaScript, no dependencies. Everything degrades gracefully: the
   site reads fine with this file removed.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. WhatsApp
     Change WHATSAPP_NUMBER to the shop's WhatsApp line. Country code first,
     digits only, no plus sign or spaces. Every link with a data-wa attribute
     is built from this number, so it only needs changing here.

     Campaign links: send people to any page with ?c=some-campaign-name and
     every WhatsApp message on the site will start with that campaign name,
     so the shop can see which ad or post the message came from.
     Example: https://samsaquarium.co.za/fish.html?c=betta-weekend
     ------------------------------------------------------------------------ */
  var WHATSAPP_NUMBER = '27682265378';
  var GREETING = "Hi Sam's Aquarium! ";

  function campaignTag() {
    try {
      var params = new URLSearchParams(window.location.search);
      var c = params.get('c') || params.get('utm_campaign') || params.get('campaign');
      if (c) { sessionStorage.setItem('sams_campaign', c); return c; }
      return sessionStorage.getItem('sams_campaign') || '';
    } catch (e) { return ''; }
  }

  function buildWhatsAppLinks() {
    var tag = campaignTag();
    var links = document.querySelectorAll('a[data-wa]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var body = a.getAttribute('data-wa') || "I'd like to ask about what you have in stock.";
      var msg = GREETING + (tag ? '[' + tag + '] ' : '') + body;
      a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    }
  }

  /* ------------------------------------------------------------------------
     2. Navigation: solid bar after scrolling, mobile menu
     ------------------------------------------------------------------------ */
  var nav = document.querySelector('.nav');
  var menu = document.querySelector('.menu');
  var burger = document.querySelector('.nav__burger');

  var waFloat = document.querySelector('.wa-float');
  var heroEl = document.querySelector('.home-hero, .page-hero');
  function onScrollNav() {
    if (nav) { if (window.scrollY > 40) nav.classList.add('is-scrolled'); else nav.classList.remove('is-scrolled'); }
    // The floating WhatsApp button waits until the hero (which has its own button) has scrolled past
    if (waFloat && heroEl) {
      var past = window.scrollY > heroEl.offsetHeight - 120;
      waFloat.classList.toggle('is-hidden', !past);
    }
  }

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ------------------------------------------------------------------------
     3. Parallax: any element with data-parallax="0.15" moves at that fraction
     of the scroll, relative to its parent. Skipped for reduced motion.
     ------------------------------------------------------------------------ */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paraEls = [];
  var ticking = false;

  function collectParallax() {
    paraEls = [];
    var els = document.querySelectorAll('[data-parallax]');
    for (var i = 0; i < els.length; i++) {
      paraEls.push({ el: els[i], box: els[i].parentElement, f: parseFloat(els[i].getAttribute('data-parallax')) || 0.15 });
    }
  }

  function updateParallax() {
    ticking = false;
    var vh = window.innerHeight;
    for (var i = 0; i < paraEls.length; i++) {
      var p = paraEls[i];
      var r = p.box.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
      var progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1 across the viewport
      var offset = -progress * p.f * r.height;
      p.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    }
  }

  function requestParallax() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateParallax); }
  }

  /* ------------------------------------------------------------------------
     4. Tanks switch their light on as they scroll into view
     ------------------------------------------------------------------------ */
  function watchTanks() {
    var tanks = document.querySelectorAll('.tank');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < tanks.length; i++) tanks[i].classList.add('is-lit');
      return;
    }
    var t0 = Date.now();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        // tanks in the same wall light up one after another, like walking down the aisle
        var group = en.target.closest ? (en.target.closest('.tank-wall, .wall__row, .gcards') || en.target.parentElement) : en.target.parentElement;
        var sibs = group.querySelectorAll('.tank');
        var k = Array.prototype.indexOf.call(sibs, en.target);
        var delay = (reduceMotion || Date.now() - t0 < 300) ? 0 : Math.min(k, 5) * 120;
        setTimeout(function () { en.target.classList.add('is-lit'); }, delay);
      });
    }, { threshold: 0.25 });
    for (var j = 0; j < tanks.length; j++) io.observe(tanks[j]);
  }

  /* ------------------------------------------------------------------------
     6. Opening hours, live. Times are South African Standard Time.
     ------------------------------------------------------------------------ */
  var HOURS = {
    1: [['08:30', '17:30']],
    2: [['08:30', '17:30']],
    3: [['08:30', '17:30']],
    4: [['08:30', '17:30']],
    5: [['08:30', '12:00'], ['14:00', '17:30']],
    6: [['08:30', '15:45']],
    0: [['08:30', '13:45']]
  };
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function nowInCapeTown() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
      return { day: wd, mins: parseInt(map.hour, 10) % 24 * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function toMins(s) { var p = s.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fmt(s) { var p = s.split(':'); return String(parseInt(p[0], 10)) + ':' + p[1]; }

  function openStatus() {
    var now = nowInCapeTown();
    var today = HOURS[now.day] || [];
    for (var i = 0; i < today.length; i++) {
      var o = toMins(today[i][0]), c = toMins(today[i][1]);
      if (now.mins >= o && now.mins < c) return { open: true, text: 'Open now, closes at ' + fmt(today[i][1]) };
      if (now.mins < o) {
        return { open: false, text: (i === 0 ? 'Opens today at ' : 'Closed for lunch, back at ') + fmt(today[i][0]) };
      }
    }
    // closed for the rest of today, find next opening
    for (var k = 1; k <= 7; k++) {
      var d = (now.day + k) % 7;
      if (HOURS[d] && HOURS[d].length) {
        return { open: false, text: 'Closed now, opens ' + (k === 1 ? 'tomorrow' : DAY_NAMES[d]) + ' at ' + fmt(HOURS[d][0][0]) };
      }
    }
    return { open: false, text: 'Closed' };
  }

  function renderHours() {
    var els = document.querySelectorAll('[data-open-now]');
    if (els.length) {
      var st = openStatus();
      for (var i = 0; i < els.length; i++) {
        els[i].textContent = st.text;
        els[i].classList.add(st.open ? 'is-open' : 'is-closed');
      }
    }
    var day = nowInCapeTown().day;
    var rows = document.querySelectorAll('.hours tr[data-day]');
    for (var j = 0; j < rows.length; j++) {
      if (parseInt(rows[j].getAttribute('data-day'), 10) === day) rows[j].classList.add('is-today');
    }
  }

  /* ------------------------------------------------------------------------
     7. The review chart: bars grow and counts count up when it comes into view
     ------------------------------------------------------------------------ */
  function countUp() {
    var shelf = document.querySelector('.shelf');
    if (!shelf) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { shelf.classList.add('is-in'); return; }
    var nums = shelf.querySelectorAll('b[data-n]');
    function run() {
      shelf.classList.add('is-in');
      Array.prototype.forEach.call(nums, function (b) {
        var target = parseInt(b.getAttribute('data-n'), 10);
        if (isNaN(target)) return;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / 1200);
          var e = 1 - Math.pow(1 - p, 3);
          b.textContent = String(Math.round(target * e));
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); run(); }
    }, { threshold: 0.4 });
    io.observe(shelf);
  }

  /* ------------------------------------------------------------------------
     9. Page transitions: fade out on the way to another page of the site
     ------------------------------------------------------------------------ */
  function pageTransitions() {
    if (reduceMotion) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/i.test(href) || !/\.html(#.*)?$/.test(href)) return;
      e.preventDefault();
      document.documentElement.classList.add('is-leaving');
      setTimeout(function () { window.location.href = href; }, 220);
    });
    window.addEventListener('pageshow', function () { document.documentElement.classList.remove('is-leaving'); });
  }

  /* ------------------------------------------------------------------------
     9b. The wall: the two rows of tanks slide opposite ways as the page
     scrolls, by driving each row's own scroll position. The moment someone
     scrolls a row by hand it is theirs and the page leaves it alone.
     ------------------------------------------------------------------------ */
  function wall() {
    var rows = document.querySelectorAll('.wall__row');
    if (!rows.length || reduceMotion) return;
    var sec = rows[0].parentElement.parentElement;
    var placed = [], manual = [], raf = 0;
    Array.prototype.forEach.call(rows, function (row, i) {
      placed[i] = -1; manual[i] = false;
      row.addEventListener('scroll', function () {
        if (placed[i] >= 0 && Math.abs(row.scrollLeft - placed[i]) > 2) manual[i] = true;
      }, { passive: true });
    });
    function place() {
      raf = 0;
      var r = sec.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      for (var i = 0; i < rows.length; i++) {
        if (manual[i]) continue;
        var row = rows[i], max = row.scrollWidth - row.clientWidth;
        if (max <= 0) continue;
        var travel = Math.min(max, 0.55 * (vh + r.height));
        var x = row.getAttribute('data-drift') === '1' ? max - p * travel : p * travel;
        row.scrollLeft = Math.round(x);
        placed[i] = row.scrollLeft;
      }
    }
    function queue() { if (!raf) raf = requestAnimationFrame(place); }
    place();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
  }

  /* ------------------------------------------------------------------------
     9c. Section headings on a phone: shrink to sit on one line where that
     keeps them at 24px or more, otherwise let them wrap as normal
     ------------------------------------------------------------------------ */
  function fitHeadings() {
    var hs = document.querySelectorAll('.h-fit');
    if (!hs.length) return;
    function fit() {
      var phone = window.innerWidth <= 600;
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];
        h.style.fontSize = '';
        h.classList.remove('is-fit');
        if (!phone) continue;
        var avail = h.parentElement.clientWidth;
        h.classList.add('is-fit');
        var need = h.scrollWidth;
        if (need <= avail) continue;
        var size = parseFloat(getComputedStyle(h).fontSize) * avail / need - 0.3;
        if (size >= 24) h.style.fontSize = size.toFixed(1) + 'px';
        else h.classList.remove('is-fit');
      }
    }
    fit();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  /* ------------------------------------------------------------------------
     10. Small things
     ------------------------------------------------------------------------ */
  function markCurrentPage() {
    var here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var section = (document.body.getAttribute('data-section') || '').toLowerCase();
    var links = document.querySelectorAll('.nav__links a, .menu a');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').toLowerCase();
      if (href === here || (section && href === section) || (here === 'index.html' && (href === './' || href === '/' || href === 'index.html'))) links[i].setAttribute('aria-current', 'page');
    }
  }
  function setYear() {
    var y = document.querySelectorAll('[data-year]');
    for (var i = 0; i < y.length; i++) y[i].textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    buildWhatsAppLinks();
    markCurrentPage();
    setYear();
    renderHours();
    watchTanks();
    countUp();
    pageTransitions();
    wall();
    fitHeadings();
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });
    if (!reduceMotion) {
      collectParallax();
      updateParallax();
      window.addEventListener('scroll', requestParallax, { passive: true });
      window.addEventListener('resize', function () { collectParallax(); requestParallax(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
