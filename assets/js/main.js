/* Webb Pediatric Dentistry — landing page behaviour (no dependencies). */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     FORM INTEGRATION
     Set FORM_ENDPOINT to the existing LeadConnector / GHL form action
     or inbound webhook URL used by the current landing page so leads
     keep flowing into the same pipeline. Leave FORM_METHOD as "json"
     for a webhook, or "form" for a classic form-encoded POST.
     ------------------------------------------------------------------ */
  var FORM_ENDPOINT = '';
  var FORM_METHOD = 'json';
  var PHONE_DISPLAY = '704-459-2843';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dev aid: ?markers=1 outlines copy slots still awaiting the source page text. */
  if (/[?&]markers=1/.test(window.location.search)) document.documentElement.classList.add('show-copy-markers');

  function track(event, data) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event }, data || {}));
    } catch (e) { /* tracking must never break the page */ }
  }

  /* ---------- Phone click tracking ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"]');
    if (a) track('phone_click', { location: a.getAttribute('data-location') || 'page' });
  });

  /* ---------- Smooth scroll to the appointment form ---------- */
  var form = document.getElementById('lead-form');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#appointment"]');
    if (!a) return;
    var target = document.getElementById('appointment');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#appointment');
    track('appointment_cta_click', { label: a.textContent.trim() });
    var first = document.getElementById('first_name');
    if (first && window.innerWidth >= 1024) {
      window.setTimeout(function () { first.focus({ preventScroll: true }); }, prefersReducedMotion ? 0 : 500);
    }
  });

  /* ---------- Mobile sticky CTA: show after the visitor starts scrolling ---------- */
  var sticky = document.getElementById('sticky-cta');
  var appointment = document.getElementById('appointment');
  if (sticky) {
    var ticking = false;
    function updateSticky() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var overForm = false;
      if (appointment) {
        var r = appointment.getBoundingClientRect();
        overForm = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.5;
      }
      sticky.classList.toggle('is-visible', y > 320 && !overForm);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateSticky); }
    }, { passive: true });
    updateSticky();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Form validation & submission ---------- */
  if (!form) return;

  var status = document.getElementById('form-status');
  var success = document.getElementById('form-success');

  var validators = {
    first_name: function (v) { return v.trim().length >= 1 || 'Please enter your first name.'; },
    last_name: function (v) { return v.trim().length >= 1 || 'Please enter your last name.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 10 || 'Please enter a valid 10-digit phone number.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
    consent: function (v, el) { return el.checked || 'Please check this box so we can contact you.'; }
  };

  function fieldWrap(el) { return el.closest('.field'); }

  function validate(el) {
    var fn = validators[el.name];
    if (!fn) return true;
    var result = fn(el.value, el);
    var wrap = fieldWrap(el);
    var err = document.getElementById(el.id + '-error');
    if (result === true) {
      wrap.classList.remove('is-invalid');
      if (el.type !== 'checkbox') wrap.classList.add('is-valid');
      el.removeAttribute('aria-invalid');
      if (err) err.textContent = '';
      return true;
    }
    wrap.classList.remove('is-valid');
    wrap.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
    if (err) { err.textContent = result; el.setAttribute('aria-describedby', err.id); }
    return false;
  }

  Array.prototype.forEach.call(form.elements, function (el) {
    if (!validators[el.name]) return;
    el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') validate(el); });
    el.addEventListener('input', function () { if (fieldWrap(el).classList.contains('is-invalid')) validate(el); });
    el.addEventListener('change', function () { validate(el); });
  });

  // Light phone formatting: 704-459-2843
  var phone = form.elements.phone;
  if (phone) {
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 10);
      var out = d;
      if (d.length > 6) out = d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
      else if (d.length > 3) out = d.slice(0, 3) + '-' + d.slice(3);
      phone.value = out;
    });
  }

  function setStatus(msg, isError) {
    status.textContent = msg || '';
    status.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.company && form.elements.company.value) return; // honeypot

    var firstInvalid = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (validators[el.name] && !validate(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      setStatus('Please fix the highlighted fields.', true);
      firstInvalid.focus();
      return;
    }

    setStatus('');
    form.classList.add('is-submitting');

    var fd = new FormData(form);
    fd.delete('company');
    fd.append('source', 'PPC New Patient Landing Page');
    fd.append('page_url', window.location.href);

    var payload = {};
    fd.forEach(function (v, k) { payload[k] = v; });

    if (!FORM_ENDPOINT) {
      form.classList.remove('is-submitting');
      setStatus('Our online form is temporarily unavailable. Please call ' + PHONE_DISPLAY + ' and we will be happy to help.', true);
      track('appointment_form_error', { reason: 'no_endpoint' });
      return;
    }

    var opts = FORM_METHOD === 'json'
      ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      : { method: 'POST', body: fd };

    fetch(FORM_ENDPOINT, opts).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.classList.remove('is-submitting');
      form.hidden = true;
      success.hidden = false;
      success.focus();
      track('appointment_form_submit', { form: 'new_patient_request' });
    }).catch(function () {
      form.classList.remove('is-submitting');
      setStatus('Something went wrong sending your request. Please try again or call ' + PHONE_DISPLAY + '.', true);
      track('appointment_form_error', { reason: 'network' });
    });
  });
})();
