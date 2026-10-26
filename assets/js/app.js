/* =========================================================
   Cebu Dental Care Center — booking app
   Pure vanilla JS. Data persists in localStorage.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- data ---------------- */
  var SERVICES = [
    { id: 'checkup', name: 'Check-up & consultation', dur: 30, note: 'Exam, advice, treatment plan', icon: 'clipboard' },
    { id: 'cleaning', name: 'Cleaning & polishing', dur: 45, note: 'Scaling, stain removal', icon: 'sparkle' },
    { id: 'crown', name: 'CEREC crown (single visit)', dur: 120, note: 'Scanned, milled & fitted', icon: 'crown' },
    { id: 'bonding', name: 'Dental bonding / veneers', dur: 90, note: 'Close gaps, reshape teeth', icon: 'tooth' },
    { id: 'rct', name: 'Root canal treatment', dur: 90, note: 'Relieve deep tooth pain', icon: 'shield' },
    { id: 'filling', name: 'Tooth-coloured filling', dur: 45, note: 'Cavities, chipped edges', icon: 'drop' },
    { id: 'extraction', name: 'Extraction / wisdom tooth', dur: 60, note: 'Simple and surgical', icon: 'minus' },
    { id: 'whitening', name: 'Whitening & smile design', dur: 60, note: 'Brighter, even shade', icon: 'sun' },
    { id: 'kids', name: "Children's dentistry", dur: 30, note: 'Gentle first visits', icon: 'heart' },
    { id: 'emergency', name: 'Emergency / toothache', dur: 30, note: 'Same-day priority', icon: 'alert', emg: true }
  ];

  var DOCTORS = [
    { id: 'any', name: 'Any available dentist', note: 'Fastest appointment', initials: '★' },
    { id: 'nida', name: 'Dr. Fredinida Ygnacio-Nemenzo', note: '“Doc Nida” · bonding & restorative', initials: 'FN' },
    { id: 'antonio', name: 'Dr. Antonio Alfredo Nemenzo', note: 'General dentistry', initials: 'AN' }
  ];

  var GALLERY = [
    { src: 'assets/img/facility-chair.jpg', alt: 'Dental treatment room with modern chair, instrument tray and overhead monitor', cls: 'tall' },
    { src: 'assets/img/smile-result.jpg', alt: 'Patient smiling after dental bonding treatment', cls: 'wide' },
    { src: 'assets/img/patient-blue.jpg', alt: 'Patient standing by the clinic door with the Cebu Dental Care Center sign', cls: '' },
    { src: 'assets/img/teeth-before.jpg', alt: 'Front teeth before bonding, showing a gap', cls: '' },
    { src: 'assets/img/teeth-after.jpg', alt: 'Front teeth after bonding, gap closed', cls: '' },
    { src: 'assets/img/patient-chair.jpg', alt: 'Patient seated in the dental chair with the dentist in purple scrubs', cls: '' },
    { src: 'assets/img/family-group.jpg', alt: 'Three patients smiling in front of the clinic glass doors', cls: 'wide' },
    { src: 'assets/img/patient-dentist-1.jpg', alt: 'Patient posing with the dentist beside the clinic sign', cls: '' },
    { src: 'assets/img/patient-dentist-2.jpg', alt: 'Patient with the dental team in front of the CEREC sign', cls: '' },
    { src: 'assets/img/sign-cerec.jpg', alt: 'CEREC single visit dentistry sign on the clinic door', cls: 'tall' }
  ];

  var REVIEWS = [
    { n: 'joshua maragni', c: '#0f766e', r: 5, when: '5 months ago', meta: '1 review', t: 'Dr. Fredinida is an exceptional dentist and has been my trusted dentist for 18 wonderful years at Cebu Dental Care Center. I recently had my teeth cleaned before flying to the US and…', reply: 'we appreciate your review, sir', by: 'Cebu Dental Care Center (Owner)' },
    { n: 'Jec Sharlene Cubarol Hills', c: '#b45309', r: 5, when: 'a year ago', meta: 'Local Guide · 54 reviews', t: 'I had an excellent experience at Cebu Dental Care Center! The service is outstanding, the prices are reasonable, and all the staff are incredibly friendly and respectful. Dr. Nida went above…' },
    { n: 'Heidelene Cisneros', c: '#c2410c', r: 5, when: '3 years ago', meta: '8 reviews', t: 'Dr. Fredinida did an amazing job with my dental bonding and cleaning. Now, I have a great smile. Thank you so much again doc!' },
    { n: 'Zineddine', c: '#475569', r: 5, when: '11 months ago', meta: '4 reviews', t: 'I had a deep teeth cleaning with Dr. Fredinida Ignacio, and it was an excellent experience! The procedure was smooth and painless, and Dr. Ignacio was kind, caring, and made sure I…' },
    { n: 'Sharon M.', c: '#0e7490', r: 5, when: '2 years ago', meta: '8 reviews', t: 'My partner and I had a very nice experience here! Dr. Fredinida was super kind and did a proper checkup on both me and my boyfriend. We both had quite a few cavities to fill and a lot…' },
    { n: 'Joey Bag-ao', c: '#be185d', r: 5, when: 'a year ago', meta: '2 reviews', t: 'This is by far the best dental care service and clinic I have ever had! We are from Sacramento, California, and were desperate to find a good dental Clinic that would accommodate my fa…' },
    { n: 'Anita 孟婕', c: '#6d28d9', r: 5, when: 'a year ago', meta: 'Local Guide · 22 reviews', t: "I've visited this centre back in October 2024 when my root-canal tooth filling came out and I needed an emergency care. Though, the clinic seemed very busy they managed to call up a roo…" },
    { n: 'Ritik', c: '#15803d', r: 5, when: '8 months ago', meta: 'Google review', t: "I'm very happy with Cebu Dental Care C… Fredinida Ygnacio. S…" },
    { n: 'Christian Miles Ubalde', c: '#0369a1', r: 5, when: 'a year ago', meta: '1 review', t: 'I am still a student relying on my elder sister’s support. My front teeth have always been ugly that makes me inferior, but I have very limited budget….' },
    { n: 'Spinning Satellites', c: '#78350f', r: 5, when: '9 months ago', meta: '12 reviews in Cebu City', t: 'Recurrent visitor here.' }
  ];

  var ICONS = {
    clipboard: '<path d="M6 3.5h9.5L20 8v12.5H6z"/><path d="M9 12h7M9 16h5"/>',
    sparkle: '<path d="m12 3.5 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    crown: '<path d="M4 17.5h16l-1.4-9-4.1 3.5L12 6l-2.5 6-4.1-3.5z"/>',
    tooth: '<path d="M12 5.5c-2.6 0-4 1.5-4 3.9 0 1.7.6 2.6.6 4.3 0 2.6.8 5.8 2 5.8.9 0 .9-2.6 1.4-2.6s.5 2.6 1.4 2.6c1.2 0 2-3.2 2-5.8 0-1.7.6-2.6.6-4.3 0-2.4-1.4-3.9-4-3.9Z"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.2-3 7.3-7 9-4-1.7-7-4.8-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    drop: '<path d="M12 3.5s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10Z"/>',
    minus: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.2A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19 10.8C19 15.6 12 20 12 20Z"/>',
    alert: '<path d="M12 8.5v4.5M12 16.4v.2"/><path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/>'
  };

  var KEY = 'cdcc_bookings_v1';
  var THEME_KEY = 'cdcc_theme';
  var OPEN_H = 9, CLOSE_H = 17, STEP_MIN = 30;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function svg(path, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) +
      '" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
  }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function todayISO() { var d = new Date(); d.setHours(0, 0, 0, 0); return iso(d); }
  function prettyDate(s) {
    var d = parseISO(s);
    return DOW[d.getDay()].slice(0, 3) + ', ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function longDate(s) {
    var d = parseISO(s);
    return DOW[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function to12(t) {
    var p = t.split(':'), h = +p[0], m = p[1];
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ':' + m + ' ' + ap;
  }
  function money() { return ''; }

  function toast(msg, icon) {
    var box = $('#toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = svg(icon || '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>', 2.2) + '<span>' + msg + '</span>';
    box.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s, transform .3s';
      el.style.opacity = '0'; el.style.transform = 'translateY(8px)';
      setTimeout(function () { el.remove(); }, 320);
    }, 3400);
  }

  /* ---------------- storage ---------------- */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { toast('Storage is unavailable in this browser.', '<path d="M12 8.5v4.5M12 16.4v.2"/><circle cx="12" cy="12" r="8.5"/>'); }
  }
  function addBooking(b) { var l = load(); l.push(b); save(l); }
  function updateBooking(ref, patch) {
    var l = load();
    for (var i = 0; i < l.length; i++) { if (l[i].ref === ref) { for (var k in patch) l[i][k] = patch[k]; } }
    save(l);
    if (fbDb && fbAuth && fbAuth.currentUser && patch.status === 'cancelled') {
      fbDb.collection('bookings').doc(ref).update({ status: 'cancelled' }).catch(function () {});
    }
  }
  function findByRef(ref) {
    var l = load();
    for (var i = 0; i < l.length; i++) if (l[i].ref === ref) return l[i];
    return null;
  }

  /* ---------------- state ---------------- */
  var state = {
    step: 1,
    service: null,
    doctor: 'any',
    date: null,
    time: null,
    view: new Date()
  };

  function svcById(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return null;
  }
  function docById(id) {
    for (var i = 0; i < DOCTORS.length; i++) if (DOCTORS[i].id === id) return DOCTORS[i];
    return null;
  }

  /* ---------------- render: services grid ---------------- */
  function renderServices() {
    var host = $('#serviceGrid');
    host.innerHTML = SERVICES.map(function (s) {
      return '<article class="svc reveal">' +
        (s.emg ? '<span class="tag-emg">Priority</span>' : '') +
        '<div class="svc-ico' + (s.emg ? ' gold' : '') + '">' + svg(ICONS[s.icon], 1.8) + '</div>' +
        '<h3>' + s.name + '</h3>' +
        '<p>' + s.note + '</p>' +
        '<div class="svc-foot"><span class="svc-time">' + s.dur + ' min</span>' +
        '<a class="svc-book" href="#book" data-pick="' + s.id + '">Book ' + svg('<path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5"/>', 2.2) + '</a></div>' +
        '</article>';
    }).join('');
  }

  /* ---------------- render: reviews + gallery ---------------- */
  function renderReviews() {
    $('#revGrid').innerHTML = REVIEWS.map(function (r) {
      var initials = r.n.trim().charAt(0).toUpperCase();
      return '<figure class="rev reveal">' +
        '<div class="rev-h">' +
        '<span class="avatar" style="background:' + r.c + '">' + initials + '</span>' +
        '<div><div class="rn">' + r.n + '</div><div class="rm">' + r.meta + '</div></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
        '<span class="stars" aria-label="' + r.r + ' out of 5">' + '★★★★★' + '</span>' +
        '<span class="excerpt">' + r.when + '</span></div>' +
        '<span class="quote-mark" aria-hidden="true">“</span>' +
        '<blockquote style="margin:0"><p style="font-size:.9rem;color:var(--ink-soft);line-height:1.62">' + r.t + '</p></blockquote>' +
        (r.reply ? '<div class="owner-reply"><b>' + r.by + ' · replied</b>' + r.reply + '</div>' : '') +
        '</figure>';
    }).join('');
  }

  var lbIndex = 0;
  function renderGallery() {
    $('#galGrid').innerHTML = GALLERY.map(function (g, i) {
      return '<button class="' + g.cls + '" data-i="' + i + '" aria-label="Open photo: ' + g.alt + '">' +
        '<img src="' + g.src + '" alt="' + g.alt + '" loading="lazy"></button>';
    }).join('');
    $$('#galGrid button').forEach(function (b) {
      b.addEventListener('click', function () { openLB(+b.dataset.i); });
    });
  }
  function openLB(i) {
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    var g = GALLERY[lbIndex];
    $('#lbImg').src = g.src; $('#lbImg').alt = g.alt;
    $('#lightbox').classList.add('on');
    document.body.classList.add('no-scroll');
  }
  function closeLB() {
    $('#lightbox').classList.remove('on');
    document.body.classList.remove('no-scroll');
  }

  /* ---------------- booking step 1 + 2 ---------------- */
  function renderOptions() {
    $('#svcOptions').innerHTML = SERVICES.map(function (s) {
      return '<button type="button" class="opt' + (state.service === s.id ? ' sel' : '') + '" data-svc="' + s.id + '">' +
        '<span class="oi">' + svg(ICONS[s.icon], 1.8) + '</span>' +
        '<span><span class="on">' + s.name + '</span><span class="om">' + s.dur + ' min · ' + s.note + '</span></span>' +
        '<span class="check"></span></button>';
    }).join('');
    $$('#svcOptions .opt').forEach(function (b) {
      b.addEventListener('click', function () {
        state.service = b.dataset.svc;
        renderOptions(); syncSummary(); $('#btnS1').disabled = false;
      });
    });

    $('#docOptions').innerHTML = DOCTORS.map(function (d) {
      return '<button type="button" class="opt' + (state.doctor === d.id ? ' sel' : '') + '" data-doc="' + d.id + '">' +
        '<span class="oi" style="font-weight:800;font-size:.82rem">' + d.initials + '</span>' +
        '<span><span class="on">' + d.name + '</span><span class="om">' + d.note + '</span></span>' +
        '<span class="check"></span></button>';
    }).join('');
    $$('#docOptions .opt').forEach(function (b) {
      b.addEventListener('click', function () {
        state.doctor = b.dataset.doc;
        renderOptions(); syncSummary();
      });
    });

    $('#btnS1').disabled = !state.service;
  }

  /* ---------------- calendar ---------------- */
  function bookedSlots() {
    // returns map date -> array of times (only active bookings)
    var map = {};
    load().forEach(function (b) {
      if (b.status === 'cancelled') return;
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b.time);
    });
    return map;
  }

  function slotsFor(dateStr) {
    // clinic: 9:00 – 17:00, closed Sundays
    var out = [];
    var d = parseISO(dateStr);
    if (d.getDay() === 0) return out;
    for (var h = OPEN_H; h < CLOSE_H; h++) {
      for (var m = 0; m < 60; m += STEP_MIN) {
        out.push(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
      }
    }
    return out;
  }

  function seedUnavailable(dateStr, time) {
    // deterministic pseudo-availability so the calendar feels real between sessions
    var s = dateStr + time;
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
    return h % 100 < 34; // ~34% pre-taken by other patients
  }

  function renderCalendar() {
    var view = state.view;
    var y = view.getFullYear(), m = view.getMonth();
    $('#calMonth').textContent = MONTHS[m] + ' ' + y;
    var first = new Date(y, m, 1);
    var startPad = first.getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var today = todayISO();
    var bk = bookedSlots();
    var html = '';
    for (var i = 0; i < startPad; i++) html += '<button class="day empty" disabled tabindex="-1"></button>';
    for (var d = 1; d <= daysInMonth; d++) {
      var ds = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var date = new Date(y, m, d);
      var isPast = ds < today;
      var isSunday = date.getDay() === 0;
      var isSel = state.date === ds;
      var cls = 'day' + (isSel ? ' sel' : '') + (ds === today ? ' today' : '') + (bk[ds] ? ' has-bk' : '');
      html += '<button class="' + cls + '" data-date="' + ds + '"' + ((isPast || isSunday) ? ' disabled' : '') +
        ' aria-label="' + longDate(ds) + (isSunday ? ' — closed' : '') + '">' + d + '</button>';
    }
    $('#calGrid').innerHTML = html;
    $$('#calGrid .day[data-date]').forEach(function (b) {
      if (b.disabled) return;
      b.addEventListener('click', function () {
        state.date = b.dataset.date;
        state.time = null;
        renderCalendar(); renderSlots(); syncSummary();
        $('#btnS3').disabled = true;
      });
    });
    // month nav limits
    var nowM = new Date(); nowM.setDate(1); nowM.setHours(0, 0, 0, 0);
    var viewM = new Date(y, m, 1);
    $('#calPrev').disabled = viewM <= nowM;
    var maxM = new Date(nowM.getFullYear(), nowM.getMonth() + 6, 1);
    $('#calNext').disabled = viewM >= maxM;
  }

  function renderSlots() {
    var area = $('#slotArea');
    if (!state.date) {
      $('#slotDateLabel').textContent = '';
      area.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3.5v3M16 3.5v3M3.5 10h17"/></svg><div>Choose a date above to see open times.</div></div>';
      return;
    }
    $('#slotDateLabel').innerHTML = '· <span>' + prettyDate(state.date) + '</span>';
    var all = slotsFor(state.date);
    var bk = bookedSlots()[state.date] || [];
    var dur = state.service ? svcById(state.service).dur : 30;
    var html = '<div class="slot-grid">';
    all.forEach(function (t) {
      var taken = bk.indexOf(t) > -1 || seedUnavailable(state.date, t);
      var endH = (+t.slice(0, 2)) + Math.floor((+t.slice(3, 5) + dur) / 60);
      var tooLate = (+t.slice(0, 2) * 60 + +t.slice(3, 5) + dur) > (CLOSE_H * 60);
      if (tooLate) taken = true;
      html += '<button class="slot' + (state.time === t ? ' sel' : '') + '" data-time="' + t + '"' + (taken ? ' disabled' : '') +
        ' aria-label="' + to12(t) + (taken ? ' unavailable' : '') + '">' + to12(t) +
        (taken ? '<small>taken</small>' : '') + '</button>';
    });
    html += '</div>';
    if (all.length === 0) {
      html = '<div class="empty-state"><div>The clinic is closed on Sundays. Please pick another day.</div></div>';
    }
    area.innerHTML = html;
    $$('#slotArea .slot').forEach(function (b) {
      if (b.disabled) return;
      b.addEventListener('click', function () {
        state.time = b.dataset.time;
        renderSlots(); syncSummary(); $('#btnS3').disabled = false;
      });
    });
    if (!state.time) {
      area.insertAdjacentHTML('beforeend', '<p class="cal-note">' + svg('<path d="M12 11v5.5M12 7.8v.2"/><circle cx="12" cy="12" r="8.5"/>', 2) +
        ' Times shown are clinic-local (PHT). Greyed slots are already taken.</p>');
    }
  }

  /* ---------------- summary ---------------- */
  function syncSummary() {
    var s = state.service ? svcById(state.service) : null;
    var d = docById(state.doctor);
    $('#sumSvc').textContent = s ? s.name : 'Not chosen';
    $('#sumSvc').classList.toggle('empty', !s);
    $('#sumDoc').textContent = d ? d.name : 'Any available';
    $('#sumDoc').classList.toggle('empty', !d);
    $('#sumDate').textContent = state.date ? prettyDate(state.date) : '—';
    $('#sumDate').classList.toggle('empty', !state.date);
    $('#sumTime').textContent = state.time ? to12(state.time) : '—';
    $('#sumTime').classList.toggle('empty', !state.time);
    $('#sumDur').textContent = s ? s.dur + ' minutes' : '—';
    $('#sumDur').classList.toggle('empty', !s);
  }

  /* ---------------- steps ---------------- */
  function goStep(n) {
    state.step = n;
    $$('.pane').forEach(function (p) { p.classList.toggle('on', +p.dataset.pane === n); });
    $$('#stepBar .step').forEach(function (s) {
      var sn = +s.dataset.s;
      s.classList.toggle('active', sn === n);
      s.classList.toggle('done', sn < n);
    });
    var card = $('.book-card');
    if (card && window.innerWidth < 1080) {
      var y = card.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /* ---------------- validation ---------------- */
  function validPhone(v) {
    var digits = v.replace(/[^\d]/g, '');
    return digits.length >= 7 && digits.length <= 13;
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function setErr(input, msgEl, bad) {
    input.classList.toggle('err', bad);
    msgEl.classList.toggle('on', bad);
  }

  function submitBooking(e) {
    e.preventDefault();
    if (!currentUser()) { openAuth({ stay: true }); return; }
    var name = $('#fName'), phone = $('#fPhone'), email = $('#fEmail'), consent = $('#fConsent');
    var bad = false;
    if (!name.value.trim()) { setErr(name, $('#eName'), true); bad = true; } else setErr(name, $('#eName'), false);
    if (!validPhone(phone.value)) { setErr(phone, $('#ePhone'), true); bad = true; } else setErr(phone, $('#ePhone'), false);
    if (!validEmail(email.value.trim())) { setErr(email, $('#eEmail'), true); bad = true; } else setErr(email, $('#eEmail'), false);
    if (!consent.checked) { $('#eConsent').classList.add('on'); bad = true; } else $('#eConsent').classList.remove('on');
    if (bad) { toast('Please check the highlighted fields.', '<path d="M12 8.5v4.5M12 16.4v.2"/><circle cx="12" cy="12" r="8.5"/>'); return; }
    if (!state.service || !state.date || !state.time) {
      toast('Please complete the treatment, date and time steps.', '<path d="M12 11v5.5M12 7.8v.2"/><circle cx="12" cy="12" r="8.5"/>');
      return;
    }

    var ref = 'CDCC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + String(Date.now()).slice(-3);
    var booking = {
      ref: ref,
      service: state.service,
      serviceName: svcById(state.service).name,
      dur: svcById(state.service).dur,
      doctor: state.doctor,
      doctorName: docById(state.doctor).name,
      date: state.date,
      time: state.time,
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      ptype: $('#fType').value,
      notes: $('#fNotes').value.trim(),
      status: 'pending',
      created: new Date().toISOString()
    };
    addBooking(booking);
    saveBookingRemote(booking);
    showConfirmation(booking);
    renderCalendar();
    goStep(5);
    toast('Request saved — reference ' + ref, '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>');
  }

  function saveBookingRemote(b) {
    var u = fbAuth && fbAuth.currentUser;
    if (!fbDb || !u) return;
    var doc = {};
    for (var k in b) doc[k] = b[k];
    doc.uid = u.uid;
    doc.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
    fbDb.collection('bookings').doc(b.ref).set(doc).catch(function () {
      toast('Saved on this device, but the clinic could not be reached online. Please call (032) 253 3206 to confirm.', '<path d="M12 8.5v4.5M12 16.4v.2"/><circle cx="12" cy="12" r="8.5"/>');
    });
  }

  function showConfirmation(b) {
    $('#refCode').textContent = b.ref;
    var rows = [
      ['Reference', b.ref],
      ['Treatment', b.serviceName],
      ['Dentist', b.doctorName],
      ['Date', longDate(b.date)],
      ['Time', to12(b.time) + ' (PHT)'],
      ['Chair time', b.dur + ' minutes'],
      ['Patient', b.name],
      ['Mobile', b.phone],
      ['Status', 'Awaiting clinic confirmation']
    ];
    $('#receipt').innerHTML = rows.map(function (r) {
      return '<div class="receipt-row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
    }).join('');
    $('#addCal').href = makeICS(b);
    $('#addCal').setAttribute('download', b.ref + '.ics');
    $('#addGcal').href = gcalUrl(b);
    lastBooking = b;
    var box = $('#qrBox');
    if (window.cdccQR) { box.classList.remove('hidden'); try { window.cdccQR.draw($('#qrCanvas'), qrText(b), 220); } catch (e) { box.classList.add('hidden'); } }
    else box.classList.add('hidden');
  }

  var lastBooking = null;
  var CLINIC_ADDR = 'Unit 13, R Aboitiz St, Cebu City, 6000 Cebu';

  // what the QR code contains: a link staff can open (admin page, searches this booking) or just the reference offline
  function qrText(b) {
    if (/^https?:$/.test(window.location.protocol)) return window.location.origin + '/admin.html?ref=' + encodeURIComponent(b.ref);
    return 'CDCC:' + b.ref;
  }

  function calTimes(b) {
    var d = parseISO(b.date), pad = function (n) { return String(n).padStart(2, '0'); };
    var sh = +b.time.slice(0, 2), sm = +b.time.slice(3, 5), endMin = sh * 60 + sm + b.dur;
    var day = '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    return { start: day + 'T' + pad(sh) + pad(sm) + '00', end: day + 'T' + pad(Math.floor(endMin / 60)) + pad(endMin % 60) + '00' };
  }
  function gcalUrl(b) {
    var t = calTimes(b), e = encodeURIComponent;
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + e(b.serviceName + ' — Cebu Dental Care Center') +
      '&dates=' + t.start + '/' + t.end + '&ctz=' + e('Asia/Manila') +
      '&details=' + e('Reference ' + b.ref + ' with ' + b.doctorName + '. Call (032) 253 3206 to confirm or reschedule.') +
      '&location=' + e(CLINIC_ADDR);
  }

  // draws the receipt (details + QR) on a canvas and downloads it as a PNG
  function saveReceiptPng(b) {
    var W = 760, S = 2, pad = 44;
    var status = b.status === 'cancelled' ? 'Cancelled' : (b.status === 'confirmed' ? 'Confirmed' : (b.status === 'completed' ? 'Completed' : 'Awaiting clinic confirmation'));
    var rows = [['Treatment', b.serviceName], ['Dentist', b.doctorName], ['Date', longDate(b.date)], ['Time', to12(b.time) + ' (PHT)'],
      ['Chair time', b.dur + ' minutes'], ['Patient', b.name], ['Mobile', b.phone], ['Status', status]];
    var qrSize = 250, top = 250, rowsTop = top + qrSize + 70, H = rowsTop + rows.length * 46 + 110;
    var cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S;
    var c = cv.getContext('2d'); c.scale(S, S);
    var F = '"Plus Jakarta Sans", "Segoe UI", Arial, sans-serif';
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#0b5d55'; c.fillRect(0, 0, W, 124);
    c.fillStyle = '#ffffff'; c.font = '800 30px ' + F; c.textAlign = 'left'; c.fillText('Cebu Dental Care Center', pad, 60);
    c.fillStyle = '#9fe6d6'; c.font = '600 17px ' + F; c.fillText('Appointment receipt', pad, 92);
    c.fillStyle = '#0a1f1c'; c.textAlign = 'center'; c.font = '700 34px ui-monospace, Menlo, Consolas, monospace'; c.fillText(b.ref, W / 2, 186);
    if (window.cdccQR) {
      var tmp = document.createElement('canvas');
      window.cdccQR.draw(tmp, qrText(b), qrSize * S);
      c.drawImage(tmp, (W - qrSize) / 2, top, qrSize, qrSize);
    }
    c.fillStyle = '#4b5f5c'; c.font = '600 15px ' + F; c.fillText('Show this QR code or reference at the front desk', W / 2, top + qrSize + 32);
    c.textAlign = 'left';
    rows.forEach(function (r, i) {
      var y = rowsTop + i * 46;
      c.strokeStyle = '#dfe7e4'; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(pad, y - 14); c.lineTo(W - pad, y - 14); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#6c807d'; c.font = '600 16px ' + F; c.textAlign = 'left'; c.fillText(r[0], pad, y + 10);
      var size = 17, txt = String(r[1]);
      do { c.font = '700 ' + size + 'px ' + F; size--; } while (c.measureText(txt).width > W - pad * 2 - 150 && size > 10);
      c.fillStyle = '#0a1f1c'; c.textAlign = 'right'; c.fillText(txt, W - pad, y + 10);
    });
    c.textAlign = 'center'; c.fillStyle = '#6c807d'; c.font = '600 14px ' + F;
    c.fillText(CLINIC_ADDR + ' · (032) 253 3206', W / 2, H - 52);
    c.fillText('The slot is final only after the clinic confirms.', W / 2, H - 28);
    cv.toBlob(function (blob) {
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = b.ref + '-receipt.png'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      toast('Receipt saved.');
    }, 'image/png');
  }

  function makeICS(b) {
    var d = parseISO(b.date);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var sh = +b.time.slice(0, 2), sm = +b.time.slice(3, 5);
    var start = '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(sh) + pad(sm) + '00';
    var endMin = sh * 60 + sm + b.dur;
    var eh = Math.floor(endMin / 60), em = endMin % 60;
    var end = '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(eh) + pad(em) + '00';
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cebu Dental Care Center//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + b.ref + '@cebudentalcare.com',
      'DTSTAMP:' + start + 'Z',
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:' + b.serviceName + ' — Cebu Dental Care Center',
      'LOCATION:Unit 13\\, R Aboitiz St\\, Cebu City\\, 6000 Cebu',
      'DESCRIPTION:Reference ' + b.ref + ' with ' + b.doctorName + '. Call (032) 253 3206 to confirm or reschedule.',
      'END:VEVENT', 'END:VCALENDAR'
    ];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }

  /* ---------------- pick a service from anywhere ---------------- */
  function pickService(id) {
    if (!svcById(id)) return;
    state.service = id;
    renderOptions(); syncSummary();
    goStep(1);
    $('#btnS1').disabled = false;
  }

  /* ---------------- my bookings ---------------- */
  function renderMyList(filter) {
    var host = $('#myList');
    var all = load();
    if (filter) {
      var f = filter.toLowerCase().replace(/\s/g, '');
      all = all.filter(function (b) {
        return b.ref.toLowerCase().indexOf(f) > -1 || b.phone.replace(/\s/g, '').indexOf(f) > -1;
      });
    }
    all.sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
    if (!all.length) {
      host.innerHTML = '<p class="rev-note" style="margin-top:6px">' + svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>', 2) +
        (filter ? ' No booking matched that reference or number.' : ' No bookings saved on this device yet.') + '</p>';
      return;
    }
    host.innerHTML = all.map(function (b) {
      var cancelled = b.status === 'cancelled', st = b.status || 'pending';
      return '<div class="my-item">' +
        '<div><div class="mi-t">' + b.serviceName + '<span class="status ' + st + '">' + st + '</span></div>' +
        '<div class="mi-m">' + longDate(b.date) + ' · ' + to12(b.time) + ' · ' + b.doctorName + '</div>' +
        '<div class="mi-r">' + b.ref + '</div></div>' +
        '<div style="display:flex;gap:6px">' +
        (cancelled ? '<button class="btn btn-soft btn-sm" data-rebook="' + b.ref + '">Rebook</button>' :
          '<button class="btn btn-ghost btn-sm" data-cancel="' + b.ref + '">Cancel</button>') +
        '</div></div>';
    }).join('');
    $$('#myList [data-cancel]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Cancel this appointment request?')) return;
        updateBooking(btn.dataset.cancel, { status: 'cancelled' });
        toast('Appointment cancelled.', '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>');
        renderMyList($('#lookupInput').value.trim()); renderCalendar(); renderAdmin(); renderSlots();
      });
    });
    $$('#myList [data-rebook]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var b = findByRef(btn.dataset.rebook);
        if (!b) return;
        state.service = b.service; state.doctor = b.doctor;
        renderOptions(); syncSummary(); goStep(1);
        document.querySelector('#book').scrollIntoView({ behavior: 'smooth' });
        toast('Loaded that treatment — pick a new date.', '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>');
      });
    });
  }

  /* ---------------- admin ---------------- */
  function renderAdmin() {
    var all = load();
    var t = todayISO();
    $('#adTotal').textContent = all.length;
    $('#adToday').textContent = all.filter(function (b) { return b.date === t && b.status !== 'cancelled'; }).length;
    var upcoming = all.filter(function (b) { return b.status !== 'cancelled' && (b.date + b.time) >= (t + '00:00'); })
      .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
    $('#adNext').textContent = upcoming.length ? prettyDate(upcoming[0].date).replace(/, \d{4}$/, '') + ' ' + to12(upcoming[0].time) : '—';
    $('#adList').innerHTML = all.length ? all.slice().sort(function (a, b) { return (b.date + b.time).localeCompare(a.date + a.time); }).map(function (b) {
      return '<div class="ad-row"><div><div class="ai-t">' + b.name + ' · ' + b.serviceName + '</div>' +
        '<div class="ai-m">' + longDate(b.date) + ' ' + to12(b.time) + ' · ' + b.doctorName + ' · ' + b.phone + ' · ' + b.ref +
        (b.status === 'cancelled' ? ' · <b style="color:#dc2626">cancelled</b>' : '') + '</div></div>' +
        '<div class="ai-a">' + (b.status === 'cancelled' ?
          '<button class="btn btn-soft btn-sm" data-restore="' + b.ref + '">Restore</button>' :
          '<button class="btn btn-ghost btn-sm" data-kill="' + b.ref + '">Cancel</button>') + '</div></div>';
    }).join('') : '<p class="rev-note">No bookings yet. Use “Add sample bookings” to preview the schedule.</p>';

    $$('#adList [data-kill]').forEach(function (b) {
      b.addEventListener('click', function () {
        updateBooking(b.dataset.kill, { status: 'cancelled' }); renderAdmin(); renderCalendar(); renderMyList($('#lookupInput').value.trim());
      });
    });
    $$('#adList [data-restore]').forEach(function (b) {
      b.addEventListener('click', function () {
        updateBooking(b.dataset.restore, { status: 'pending' }); renderAdmin(); renderCalendar(); renderMyList($('#lookupInput').value.trim());
      });
    });
  }

  function exportCSV() {
    var all = load();
    if (!all.length) { toast('Nothing to export yet.'); return; }
    var head = ['Reference', 'Status', 'Date', 'Time', 'Treatment', 'Minutes', 'Dentist', 'Patient', 'Phone', 'Email', 'Patient type', 'Notes'];
    var rows = all.map(function (b) {
      return [b.ref, b.status, b.date, b.time, b.serviceName, b.dur, b.doctorName, b.name, b.phone, b.email, b.ptype,
        (b.notes || '').replace(/[\r\n]+/g, ' ')].map(function (v) {
          return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
        }).join(',');
    });
    var csv = head.join(',') + '\n' + rows.join('\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = 'cebu-dental-bookings.csv'; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    toast('CSV exported.', '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>');
  }

  function seedSamples() {
    var t = new Date();
    var mk = function (offset, time, svc, doc, name, phone) {
      var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset);
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);
      return {
        ref: 'CDCC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-9' + String(offset + 10).slice(-2),
        service: svc.id, serviceName: svc.name, dur: svc.dur,
        doctor: doc.id, doctorName: doc.name,
        date: iso(d), time: time, name: name, phone: phone,
        email: name.split(' ')[0].toLowerCase() + '@example.com',
        ptype: 'New patient', notes: '', status: 'pending', created: new Date().toISOString()
      };
    };
    var list = load();
    list.push(mk(0, '10:00', SERVICES[1], DOCTORS[1], 'Maria Santos', '0917 555 0142'));
    list.push(mk(1, '14:00', SERVICES[2], DOCTORS[1], 'Daniel Reyes', '0918 442 7781'));
    list.push(mk(1, '11:30', SERVICES[0], DOCTORS[2], 'Grace Lim', '032 253 8899'));
    list.push(mk(2, '15:30', SERVICES[3], DOCTORS[1], 'Anna Villar', '0920 771 4432'));
    save(list);
    renderAdmin(); renderCalendar(); renderMyList($('#lookupInput').value.trim());
    toast('Sample bookings added.', '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>');
  }

  /* ---------------- theme ---------------- */
  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    var icon = $('#themeIcon');
    if (mode === 'dark') {
      icon.innerHTML = '<path d="M20.5 14.8A8.5 8.5 0 0 1 9.2 3.5a8.5 8.5 0 1 0 11.3 11.3Z"/>';
    } else {
      icon.innerHTML = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"/>';
    }
  }

  /* ---------------- open status ---------------- */
  function openStatus() {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = day !== 0 && mins >= OPEN_H * 60 && mins < CLOSE_H * 60;
    var el = $('#openState'), dot = $('#openDot');
    if (open) {
      el.textContent = 'Open now';
      dot.style.background = '#16a34a'; dot.style.boxShadow = '0 0 0 4px rgba(22,163,74,.16)';
    } else {
      el.textContent = day === 0 ? 'Closed today' : (mins < OPEN_H * 60 ? 'Opens 9 AM' : 'Closed now');
      dot.style.background = '#dc2626'; dot.style.boxShadow = '0 0 0 4px rgba(220,38,38,.14)';
    }
    $('#hoursLine').textContent = (day === 0 ? 'Closed today' : (open ? 'Open now' : 'Closed')) + ' · 9:00 AM – 5:00 PM, Mon–Sat';
  }

  /* ---------------- before / after ---------------- */
  function initBA() {
    var wrap = $('#baWrap');
    if (!wrap) return;
    var after = $('#baAfter'), handle = $('#baHandle');
    var dragging = false;
    function set(x) {
      var r = wrap.getBoundingClientRect();
      var p = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
      after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
      handle.style.left = p + '%';
      wrap.setAttribute('aria-valuenow', Math.round(p));
    }
    wrap.addEventListener('pointerdown', function (e) { dragging = true; set(e.clientX); wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', function (e) { if (dragging) set(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
    wrap.addEventListener('keydown', function (e) {
      var cur = +wrap.getAttribute('aria-valuenow');
      if (e.key === 'ArrowLeft') { set(wrap.getBoundingClientRect().left + (wrap.getBoundingClientRect().width * (cur - 4) / 100)); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(wrap.getBoundingClientRect().left + (wrap.getBoundingClientRect().width * (cur + 4) / 100)); e.preventDefault(); }
    });
  }

  /* ---------------- reveal ---------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e, i) {
      e.style.transitionDelay = Math.min(i % 6 * 55, 220) + 'ms';
      io.observe(e);
    });
  }

  /* ---------------- login / create account ---------------- */
  var USERS_KEY = 'cdcc_users_v1';
  var SESSION_KEY = 'cdcc_session_v1';
  var auth = { mode: 'signup', pending: null, lastFocus: null };
  var AUTH_ICON = '<svg id="authIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } }
  function saveUsers(l) { try { localStorage.setItem(USERS_KEY, JSON.stringify(l)); } catch (e) {} }
  function currentUser() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; } }
  function setSession(u) {
    try { if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u)); else localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // demo-only hashing (client side). Replace with a real backend / Firebase Auth for production.
  function hashPw(pw, salt) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      });
    }
    var s = salt + pw, h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return Promise.resolve('x' + h);
  }

  /* ---------------- Firebase Auth ---------------- */
  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCLB6d4iiSid4dmGa09l2SMo47rKKC0CtY',
    authDomain: 'cebu-dental-care-center-f7017.firebaseapp.com',
    projectId: 'cebu-dental-care-center-f7017',
    storageBucket: 'cebu-dental-care-center-f7017.firebasestorage.app',
    messagingSenderId: '901285525297',
    appId: '1:901285525297:web:da20d945aaa1d6ddf2a210',
    measurementId: 'G-7B0W5JXQFS'
  };
  var ADMIN_EMAIL = 'admin@gmail.com'; // admin account -> opens admin.html after login
  var fbAuth = null;
  var fbDb = null;
  function initFirebase() {
    try {
      if (window.firebase && window.firebase.auth) {
        if (!window.firebase.apps.length) window.firebase.initializeApp(FIREBASE_CONFIG);
        fbAuth = window.firebase.auth();
        if (window.firebase.firestore) fbDb = window.firebase.firestore();
      }
    } catch (e) { fbAuth = null; }
  }
  function fbUserToSession(u, provider) {
    var email = (u.email || '').toLowerCase();
    return { name: u.displayName || email.split('@')[0] || 'Patient', email: email, provider: provider || 'email' };
  }
  function isAdminUser(u) { return !!(fbAuth && u && u.provider === 'email' && String(u.email).toLowerCase() === ADMIN_EMAIL); }
  function fbErrMsg(err) {
    var c = err && err.code || '';
    var map = {
      'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'Incorrect email or password.',
      'auth/wrong-password': 'Incorrect email or password.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
      'auth/network-request-failed': 'Network problem. Check your internet connection and try again.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
      'auth/popup-blocked': 'Your browser blocked the Google popup. Allow popups for this site and try again.',
      'auth/unauthorized-domain': 'This website address is not authorized in Firebase yet (Authentication → Settings → Authorized domains).',
      'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase yet (Authentication → Sign-in method).'
    };
    return map[c] || 'Something went wrong. Please try again.';
  }

  function setAuthMode(mode) {
    auth.mode = mode;
    var login = mode === 'login';
    $('#tabLogin').classList.toggle('on', login);
    $('#tabSignup').classList.toggle('on', !login);
    $('#tabLogin').setAttribute('aria-selected', login ? 'true' : 'false');
    $('#tabSignup').setAttribute('aria-selected', login ? 'false' : 'true');
    $('#fgName').classList.toggle('hidden', login);
    $('#forgotBtn').classList.toggle('hidden', !login);
    $('#authSubmit').textContent = login ? 'Log in' : 'Create account';
    $('#authSub').textContent = login
      ? 'Welcome back — log in to reserve your chair and see your appointments.'
      : 'Create an account to reserve your check-up, cleaning, or CEREC visit.';
    $('#aPass').setAttribute('autocomplete', login ? 'current-password' : 'new-password');
    $('#authErr').classList.remove('on');
  }

  function showAuthErr(msg) { var el = $('#authErr'); el.textContent = msg; el.classList.add('on'); }

  function openAuth(pending) {
    auth.pending = pending || null;
    auth.lastFocus = document.activeElement;
    var seen = false; try { seen = !!localStorage.getItem('cdcc_has_acct'); } catch (e) {}
    setAuthMode(getUsers().length || seen ? 'login' : 'signup');
    $('#authForm').reset();
    document.body.classList.remove('menu-open');
    $('#authModal').classList.add('on');
    document.body.classList.add('no-scroll');
    setTimeout(function () { ($('#fgName').classList.contains('hidden') ? $('#aEmail') : $('#aName')).focus(); }, 60);
  }
  function closeAuth() {
    $('#authModal').classList.remove('on');
    document.body.classList.remove('no-scroll');
    auth.pending = null;
    if (auth.lastFocus && auth.lastFocus.focus) { try { auth.lastFocus.focus(); } catch (e) {} }
  }

  function updateAuthUI() {
    var btn = $('#authBtn'), u = currentUser();
    if (!btn) return;
    if (u) {
      btn.innerHTML = '<span class="auth-ini">' + esc((u.name || u.email).trim().charAt(0).toUpperCase()) + '</span>';
      btn.classList.add('in');
      btn.title = 'Signed in as ' + u.email + ' — click to log out';
      btn.setAttribute('aria-label', 'Signed in as ' + u.email + '. Click to log out');
    } else {
      btn.innerHTML = AUTH_ICON;
      btn.classList.remove('in');
      btn.title = 'Log in';
      btn.setAttribute('aria-label', 'Log in');
    }
  }

  function prefillForm() {
    var u = currentUser();
    if (!u) return;
    if (!$('#fName').value) $('#fName').value = u.name || '';
    if (!$('#fEmail').value) $('#fEmail').value = u.email || '';
  }

  function finishLogin(user, msg) {
    var p = auth.pending;
    try { localStorage.setItem('cdcc_has_acct', '1'); } catch (e) {}
    setSession(user);
    closeAuth();
    updateAuthUI();
    prefillForm();
    toast(msg);
    if (isAdminUser(user)) {
      setTimeout(function () { window.location.href = 'admin.html'; }, 450);
      return;
    }
    if (p && p.staff) { toast('This account is not a staff account.', '<path d="M12 8.5v4.5M12 16.4v.2"/><circle cx="12" cy="12" r="8.5"/>'); return; }
    if (p && !p.stay) {
      if (p.pick) pickService(p.pick);
      var t = $('#book');
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    }
  }

  function googleSignIn() {
    if (fbAuth) {
      fbAuth.signInWithPopup(new window.firebase.auth.GoogleAuthProvider()).then(function (res) {
        var s = fbUserToSession(res.user, 'google');
        finishLogin(s, 'Signed in with Google — welcome, ' + esc(s.name.split(' ')[0]) + '!');
      }).catch(function (err) { showAuthErr(fbErrMsg(err)); });
      return;
    }
    var p;
    if (typeof window.CDCC_GOOGLE_SIGNIN === 'function') {
      p = Promise.resolve(window.CDCC_GOOGLE_SIGNIN()); // plug in Firebase / Google Identity here
    } else {
      var em = window.prompt('Demo Google sign-in (no Google project connected yet).\nEnter your Gmail address:');
      if (!em) return;
      em = em.trim();
      if (!validEmail(em)) { showAuthErr('Enter a valid Gmail address.'); return; }
      p = Promise.resolve({ name: em.split('@')[0], email: em });
    }
    p.then(function (u) {
      if (!u || !u.email) return;
      finishLogin({ name: u.name || u.email.split('@')[0], email: u.email.toLowerCase(), provider: 'google' }, 'Signed in with Google.');
    }).catch(function () { showAuthErr('Google sign-in was cancelled or failed.'); });
  }

  function forgotPassword() {
    var email = $('#aEmail').value.trim().toLowerCase();
    $('#authErr').classList.remove('on');
    if (!fbAuth) { showAuthErr('Password reset is not available right now. Please call (032) 253 3206.'); return; }
    if (!validEmail(email)) { showAuthErr('Type your email above first, then tap Forgot password.'); return; }
    fbAuth.sendPasswordResetEmail(email).then(function () {
      toast('If ' + esc(email) + ' has an account, a reset link is on its way. Check your inbox and spam folder.');
    }).catch(function (err) { showAuthErr(fbErrMsg(err)); });
  }

  function submitAuth(e) {
    e.preventDefault();
    var name = $('#aName').value.trim();
    var email = $('#aEmail').value.trim().toLowerCase();
    var pw = $('#aPass').value;
    var signup = auth.mode === 'signup';
    $('#authErr').classList.remove('on');

    if (signup && !name) { showAuthErr('Please enter your full name.'); return; }
    if (!validEmail(email)) { showAuthErr('Enter a valid email address.'); return; }
    if (pw.length < 6) { showAuthErr('Password must be at least 6 characters.'); return; }

    if (fbAuth) {
      var fbBtn = $('#authSubmit'); fbBtn.disabled = true;
      var job = signup
        ? fbAuth.createUserWithEmailAndPassword(email, pw).then(function (cred) {
            return cred.user.updateProfile({ displayName: name }).then(function () { return cred.user; });
          })
        : fbAuth.signInWithEmailAndPassword(email, pw).then(function (cred) { return cred.user; });
      job.then(function (user) {
        fbBtn.disabled = false;
        var s = fbUserToSession(user, 'email');
        if (signup) s.name = name;
        finishLogin(s, (signup ? 'Account created — welcome, ' : 'Welcome back, ') + esc(s.name.split(' ')[0]) + '!');
      }).catch(function (err) { fbBtn.disabled = false; showAuthErr(fbErrMsg(err)); });
      return;
    }

    var users = getUsers(), found = null;
    users.forEach(function (u) { if (u.email === email) found = u; });
    var btn = $('#authSubmit'); btn.disabled = true;

    if (signup) {
      if (found) { btn.disabled = false; showAuthErr('An account with this email already exists. Try logging in.'); return; }
      var salt = Math.random().toString(36).slice(2, 10);
      hashPw(pw, salt).then(function (hash) {
        users.push({ name: name, email: email, salt: salt, hash: hash });
        saveUsers(users);
        btn.disabled = false;
        finishLogin({ name: name, email: email, provider: 'email' }, 'Account created — welcome, ' + esc(name.split(' ')[0]) + '!');
      });
    } else {
      if (!found) { btn.disabled = false; showAuthErr('No account found with that email. Create one instead.'); return; }
      hashPw(pw, found.salt).then(function (hash) {
        btn.disabled = false;
        if (hash !== found.hash) { showAuthErr('Incorrect password. Please try again.'); return; }
        finishLogin({ name: found.name, email: email, provider: 'email' }, 'Welcome back, ' + esc(found.name.split(' ')[0]) + '!');
      });
    }
  }

  var unsubMine = null;
  function syncMyBookings(u) {
    if (unsubMine) { unsubMine(); unsubMine = null; }
    if (!fbDb || !u) return;
    unsubMine = fbDb.collection('bookings').where('uid', '==', u.uid).onSnapshot(function (snap) {
      var list = load(), changed = false;
      snap.docs.forEach(function (d) {
        var r = d.data(); r.ref = d.id;
        delete r.uid; delete r.createdAt; delete r.updatedAt;
        var found = null;
        for (var i = 0; i < list.length; i++) if (list[i].ref === r.ref) found = list[i];
        if (!found) { list.push(r); changed = true; }
        else if (r.status && found.status !== r.status) { found.status = r.status; changed = true; }
      });
      if (changed) { save(list); renderMyList($('#lookupInput').value.trim()); renderCalendar(); renderSlots(); }
    }, function () {});
  }

  function initAuth() {
    // Capture phase: any "Book" link/button opens the login first if the visitor is not signed in.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#book"], [data-pick]');
      if (!a || currentUser()) return;
      e.preventDefault();
      e.stopPropagation();
      openAuth({ pick: a.getAttribute('data-pick') });
    }, true);

    $('#authBtn').addEventListener('click', function () {
      var u = currentUser();
      if (u) {
        if (confirm('Log out of ' + u.email + '?')) { if (fbAuth) fbAuth.signOut(); setSession(null); updateAuthUI(); toast('Logged out.'); }
      } else openAuth(null);
    });
    $('#authClose').addEventListener('click', closeAuth);
    $('#authModal').addEventListener('click', function (e) { if (e.target.id === 'authModal') closeAuth(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#authModal').classList.contains('on')) closeAuth();
    });
    $('#tabLogin').addEventListener('click', function () { setAuthMode('login'); });
    $('#tabSignup').addEventListener('click', function () { setAuthMode('signup'); });
    $('#googleBtn').addEventListener('click', googleSignIn);
    $('#forgotBtn').addEventListener('click', forgotPassword);
    $('#authForm').addEventListener('submit', submitAuth);
    initFirebase();
    if (fbAuth) {
      // keeps the header icon + form prefill in sync with Firebase (also restores the session after a page reload)
      fbAuth.onAuthStateChanged(function (u) {
        var cur = currentUser();
        if (u) {
          var s = fbUserToSession(u, cur && cur.provider);
          if (cur && cur.email === s.email && cur.name && u.displayName == null) s.name = cur.name;
          setSession(s);
        } else if (cur) setSession(null);
        updateAuthUI();
        prefillForm();
        syncMyBookings(u);
      });
    }
    updateAuthUI();
    prefillForm();
  }

  /* ---------------- init ---------------- */
  function init() {
    // theme
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) saved = 'dark';
    setTheme(saved || 'light');
    $('#themeBtn').addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    renderServices();
    renderReviews();
    renderGallery();
    renderOptions();
    renderCalendar();
    renderSlots();
    syncSummary();
    renderMyList('');
    renderAdmin();
    openStatus();
    initBA();
    $('#year').textContent = new Date().getFullYear();

    // header scroll + burger
    var header = $('#header');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var burger = $('#burger');
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-open'); }); });

    // step buttons
    $$('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () { goStep(+b.dataset.next); });
    });
    $$('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () { goStep(+b.dataset.back); });
    });
    $('#detailForm').addEventListener('submit', submitBooking);

    // calendar nav
    $('#calPrev').addEventListener('click', function () {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() - 1, 1); renderCalendar();
    });
    $('#calNext').addEventListener('click', function () {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 1); renderCalendar();
    });

    // deep links to a service
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-pick]');
      if (!a) return;
      e.preventDefault();
      pickService(a.dataset.pick);
      var t = $('#book');
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });

    // lightbox
    $('#lbClose').addEventListener('click', closeLB);
    $('#lbPrev').addEventListener('click', function () { openLB(lbIndex - 1); });
    $('#lbNext').addEventListener('click', function () { openLB(lbIndex + 1); });
    $('#lightbox').addEventListener('click', function (e) { if (e.target.id === 'lightbox') closeLB(); });
    document.addEventListener('keydown', function (e) {
      if ($('#lightbox').classList.contains('on')) {
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') openLB(lbIndex - 1);
        if (e.key === 'ArrowRight') openLB(lbIndex + 1);
      }
      if (e.key === 'Escape' && $('#adminModal').classList.contains('on')) $('#adminModal').classList.remove('on');
    });

    // save receipt as image
    $('#saveReceipt').addEventListener('click', function () { if (lastBooking) saveReceiptPng(lastBooking); });

    // copy ref
    $('#copyRef').addEventListener('click', function () {
      var txt = $('#refCode').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('Reference copied.', '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>'); });
      else toast('Reference: ' + txt);
    });

    // book another
    $('#bookAnother').addEventListener('click', function () {
      state.service = null; state.date = null; state.time = null; state.doctor = 'any';
      $('#detailForm').reset();
      $$('.input').forEach(function (i) { i.classList.remove('err'); });
      $$('.err-msg').forEach(function (m) { m.classList.remove('on'); });
      renderOptions(); renderCalendar(); renderSlots(); syncSummary(); goStep(1);
    });

    // my bookings
    $('#lookupBtn').addEventListener('click', function () {
      renderMyList($('#lookupInput').value.trim());
    });
    $('#lookupInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); renderMyList($('#lookupInput').value.trim()); }
    });

    // admin
    $('#adminOpen').addEventListener('click', function () {
      if (!fbAuth) { renderAdmin(); $('#adminModal').classList.add('on'); return; } // offline demo fallback
      if (isAdminUser(currentUser())) { window.location.href = 'admin.html'; return; }
      openAuth({ staff: true });
      setAuthMode('login');
    });
    $('#adminClose').addEventListener('click', function () { $('#adminModal').classList.remove('on'); });
    $('#adminModal').addEventListener('click', function (e) { if (e.target.id === 'adminModal') $('#adminModal').classList.remove('on'); });
    $('#adExport').addEventListener('click', exportCSV);
    $('#adSeed').addEventListener('click', seedSamples);
    $('#clearAll').addEventListener('click', function () {
      if (!confirm('Clear all locally saved bookings?')) return;
      save([]); renderAdmin(); renderCalendar(); renderSlots(); renderMyList('');
      toast('Demo data cleared.');
    });

    initReveal();
    initAuth();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
