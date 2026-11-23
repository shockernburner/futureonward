(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Header background + hero sunrise driven by scroll
  var hdr = document.getElementById('hdr');
  var hero = document.getElementById('top');
  var truck = document.querySelector('.truck');
  function onScroll() {
    var y = window.scrollY || 0;
    hdr.classList.toggle('scrolled', y > 30);
    if (hero && !reduce) {
      var h = hero.offsetHeight || 1;
      var rise = Math.min(1, Math.max(0, 0.35 + y / h));
      hero.style.setProperty('--rise', rise.toFixed(3));
      if (truck) truck.setAttribute('transform', 'translate(' + (120 + rise * 1100).toFixed(0) + ' 0)');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (!reduce) {
    // Gentle sunrise on load before the user scrolls
    var t0 = null;
    var intro = function (t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 1600);
      if ((window.scrollY || 0) < 5) {
        var rise = 0.35 * (1 - Math.pow(1 - k, 3));
        hero.style.setProperty('--rise', rise.toFixed(3));
        if (truck) truck.setAttribute('transform', 'translate(' + (-140 + k * 260).toFixed(0) + ' 0)');
      }
      if (k < 1) requestAnimationFrame(intro);
    };
    requestAnimationFrame(intro);
  } else if (hero) {
    hero.style.setProperty('--rise', '0.6');
    if (truck) truck.setAttribute('transform', 'translate(400 0)');
  }
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Chapter rail
  var rail = document.querySelectorAll('.rail a');
  if (rail.length && 'IntersectionObserver' in window) {
    var map = {};
    rail.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          rail.forEach(function (a) { a.classList.remove('on'); });
          map[e.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) ro.observe(s); });
  }

  // Savings calculator
  var YIELD = 1250;        // kWh per kWp per year (conservative assumption)
  var DEGRADE = 0.005;     // per year
  var YEARS = 25;
  var kwp = document.getElementById('kwp');
  var tariff = document.getElementById('tariff');
  function taka(n) {
    if (n >= 1e7) return 'Tk ' + (n / 1e7).toFixed(n >= 1e9 ? 0 : 1) + ' crore';
    if (n >= 1e5) return 'Tk ' + (n / 1e5).toFixed(1) + ' lakh';
    return 'Tk ' + Math.round(n).toLocaleString('en-IN');
  }
  function calc() {
    var k = +kwp.value, t = +tariff.value;
    var gen = k * YIELD;
    var year = gen * t;
    var factor = (1 - Math.pow(1 - DEGRADE, YEARS)) / DEGRADE;
    document.getElementById('kwpOut').textContent = k.toLocaleString('en-IN') + ' kWp';
    document.getElementById('tariffOut').textContent = 'Tk ' + t.toFixed(2) + ' /unit';
    document.getElementById('rGen').textContent = Math.round(gen).toLocaleString('en-IN') + ' kWh';
    document.getElementById('rYear').textContent = taka(year);
    document.getElementById('r25').textContent = taka(year * factor);
    document.getElementById('rRoof').textContent = (k * 80).toLocaleString('en-IN') + '–' + (k * 100).toLocaleString('en-IN') + ' sq ft';
  }
  if (kwp && tariff) { kwp.addEventListener('input', calc); tariff.addEventListener('input', calc); calc(); }

  // EraseAI demo loop: typed -> held -> sanitized
  var demo = document.getElementById('demo');
  if (demo) {
    var marks = demo.querySelectorAll('mark');
    var orig = Array.prototype.map.call(marks, function (m) { return m.textContent; });
    var title = document.getElementById('gateTitle');
    var text = document.getElementById('gateText');
    var state = 0;
    var step = function () {
      demo.classList.remove('held', 'clean');
      if (state === 0) {
        marks.forEach(function (m, i) { m.textContent = orig[i]; });
      } else if (state === 1) {
        demo.classList.add('held');
        title.textContent = 'EraseAI held this message';
        text.textContent = 'Found: a card number and a password.';
      } else {
        demo.classList.add('clean');
        marks.forEach(function (m) { m.textContent = m.getAttribute('data-clean'); });
        title.textContent = 'Sanitized and sent';
        text.textContent = 'Placeholders replaced the card number and password.';
      }
      state = (state + 1) % 3;
    };
    if (reduce) { state = 1; step(); }
    else if ('IntersectionObserver' in window) {
      var timer = null;
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && !timer) { step(); timer = setInterval(step, 2600); }
        else if (!e[0].isIntersecting && timer) { clearInterval(timer); timer = null; }
      }, { threshold: 0.3 }).observe(demo);
    }
  }

  // Contact brief -> email or WhatsApp
  var form = document.getElementById('brief');
  if (form) {
    var via = 'email';
    form.querySelectorAll('button[data-via]').forEach(function (b) {
      b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements;
      if (!f.company.value.trim() || !f.name.value.trim()) {
        (f.company.value.trim() ? f.name : f.company).focus();
        return;
      }
      var lines = [
        'Company: ' + f.company.value.trim(),
        'Name: ' + f.name.value.trim(),
        'Interested in: ' + f.service.value,
        f.location.value.trim() ? 'Location: ' + f.location.value.trim() : '',
        f.bill.value.trim() ? 'Monthly electricity bill: ' + f.bill.value.trim() : '',
        f.msg.value.trim() ? '\n' + f.msg.value.trim() : ''
      ].filter(Boolean).join('\n');
      if (via === 'wa') {
        window.open('https://wa.me/8801746653647?text=' + encodeURIComponent('Hello Future Onward,\n\n' + lines), '_blank', 'noopener');
      } else {
        var subject = 'B2B enquiry: ' + f.service.value + ' - ' + f.company.value.trim();
        window.location.href = 'mailto:director@futureonward.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Hello Future Onward,\n\n' + lines + '\n');
      }
    });
  }
})();
