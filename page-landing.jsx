// Landing page — editorial hero, value props, event-type selector

const VALUES = [
{ num: '01', title: 'Personally vetted, not paid for.', body: 'Every vendor is reviewed by our team before they ever appear here. There is no pay-to-list, and no vendor buys their way onto the network.' },
{ num: '02', title: 'Standards, not guesswork.', body: 'We evaluate reliability, communication, and consistency of delivery, not just a polished portfolio. A good photo gallery is not the same as showing up on time.' },
{ num: '03', title: 'Curated, not crowdsourced.', body: 'No paid ranking, no advertising slots. Order reflects performance, not who spent the most to be seen first.' },
{ num: '04', title: 'A standard we are building, not a badge we are selling.', body: 'We are working toward a full certification framework for Ghana\'s event industry. Every vendor here today is vetted directly by our team while that standard is built.' }];

// One copy of the marquee content (rendered twice for seamless loop)
function MarqueeCopy() {
  const items = window.OA_DATA.CATEGORIES.map(c => c.plural);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 60, flexShrink: 0, paddingRight: 60 }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--ink-2)' }}>{item}</span>
          <span style={{ color: 'var(--accent)', fontSize: 18, lineHeight: 1 }}>✦</span>
        </React.Fragment>
      ))}
    </span>
  );
}

// Scroll-reveal hook: fires IntersectionObserver and adds .visible to trigger CSS animations
function useScrollReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function VendorInfoModal({ onClose }) {
  const BENEFITS = [
    { num: '01', title: 'Vetted, not ranked', body: 'We review every applicant personally. There is no pay-to-list, and no vendor buys their place on the register.' },
    { num: '02', title: 'Quality clients', body: 'Our users are planning events that matter — and they have the budget for vendors who deliver.' },
    { num: '03', title: 'No subscription fee', body: 'Listing is free for all approved vendors during our founding period.' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div className="eyebrow eyebrow-gold" style={{ marginBottom: 12 }}>— Join the Register —</div>
        <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.1 }}>
          Are you a vendor?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-3)', margin: '0 0 32px', maxWidth: 480 }}>
          If your work meets a high standard, we want to know about it. Apply to be listed and connect with clients planning events that matter.
        </p>

        <div style={{ borderTop: '0.5px solid var(--rule)', marginBottom: 32 }}>
          {BENEFITS.map(b => (
            <div key={b.num} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16, padding: '20px 0', borderBottom: '0.5px solid var(--rule)' }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', paddingTop: 3 }}>— {b.num}</span>
              <div>
                <h4 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 6px', lineHeight: 1.1 }}>{b.title}</h4>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: 0, lineHeight: 1.55 }}>{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#/vendor-apply" className="btn gold" onClick={onClose}>
            Proceed to application <Icon name="arrow" size={14} />
          </a>
          <button className="btn ghost" onClick={onClose}>Not now</button>
        </div>
      </div>
    </div>
  );
}

function EventInquiryModal({ user, onSignIn, onClose, onSubmit }) {
  const [form, setForm] = React.useState({
    eventType: window.OA_DATA.EVENT_TYPES[0]?.id || '',
    eventDate: '', city: '', guestCount: '', budget: '', categories: [], details: '',
  });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleCat = (id) => set('categories',
    form.categories.includes(id) ? form.categories.filter(x => x !== id) : [...form.categories, id]
  );

  const BUDGET_OPTIONS = [
    { value: '', label: 'Prefer not to say' },
    { value: 'under-5k', label: 'Under GHS 5,000' },
    { value: '5k-20k', label: 'GHS 5,000 – 20,000' },
    { value: '20k-50k', label: 'GHS 20,000 – 50,000' },
    { value: '50k-100k', label: 'GHS 50,000 – 100,000' },
    { value: 'above-100k', label: 'Above GHS 100,000' },
  ];

  if (!user) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460, textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ marginBottom: 16 }}>— Sign in required —</div>
          <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, fontStyle: 'italic', margin: '0 0 16px' }}>Tell us about your event.</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-3)', margin: '0 0 32px' }}>
            Sign in to submit your event details and receive a curated list of vendors tailored to your occasion.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn gold" onClick={() => { onClose(); onSignIn(); }}>Sign in <Icon name="arrow" size={14} /></button>
            <button className="btn ghost" onClick={onClose}>Not now</button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460, textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ marginBottom: 16 }}>— Received —</div>
          <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, fontStyle: 'italic', margin: '0 0 16px' }}>We're on it.</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-3)', margin: '0 0 32px' }}>
            Your event details have been submitted. We'll review and send you a curated shortlist — check <strong>My Events</strong> in your account for updates.
          </p>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.city.trim()) e.city = 'Please enter a city or location.';
    if (!form.categories.length) e.categories = 'Please select at least one vendor type.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({
      id: 'inq' + Date.now().toString(36),
      userEmail: user.email,
      userName: user.name || user.email,
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'pending',
      curatedVendorIds: [],
      adminNote: '',
      ...form,
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="eyebrow eyebrow-gold" style={{ marginBottom: 12 }}>— Event Enquiry —</div>
        <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, fontStyle: 'italic', margin: '0 0 8px' }}>Tell us about your event.</h3>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '0 0 28px', lineHeight: 1.55 }}>
          Share the details and we'll put together a curated list of vendors for your occasion.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <InqField label="Event type">
            <select className="field" value={form.eventType} onChange={e => set('eventType', e.target.value)} style={{ width: '100%' }}>
              {window.OA_DATA.EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </InqField>
          <InqField label="Event date (if known)">
            <input type="date" className="field" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} style={{ width: '100%' }} />
          </InqField>
          <InqField label="City / Location *" error={errors.city}>
            <input className="field" value={form.city}
                   onChange={e => { set('city', e.target.value); setErrors(p => ({ ...p, city: '' })); }}
                   placeholder="e.g. Accra" style={{ width: '100%' }} />
          </InqField>
          <InqField label="Approximate guest count">
            <input type="number" className="field" value={form.guestCount}
                   onChange={e => set('guestCount', e.target.value)}
                   placeholder="e.g. 150" style={{ width: '100%' }} />
          </InqField>
          <InqField label="Budget range" colSpan={2}>
            <select className="field" value={form.budget} onChange={e => set('budget', e.target.value)} style={{ width: '100%' }}>
              {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </InqField>
          <InqField label="Vendor types needed *" error={errors.categories} colSpan={2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {window.OA_DATA.CATEGORIES.map(c => (
                <button key={c.id} type="button"
                        className={`chip${form.categories.includes(c.id) ? ' active' : ''}`}
                        onClick={() => { toggleCat(c.id); setErrors(p => ({ ...p, categories: '' })); }}>
                  {c.label}
                </button>
              ))}
            </div>
          </InqField>
          <InqField label="Anything else we should know?" colSpan={2}>
            <textarea className="field" value={form.details} onChange={e => set('details', e.target.value)}
                      placeholder="Style, tone, specific requirements…"
                      style={{ width: '100%', height: 100, padding: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, resize: 'vertical' }} />
          </InqField>
        </div>
        {Object.keys(errors).length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', border: '0.5px solid var(--burgundy)', color: 'var(--burgundy)', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
            Please complete the required fields before submitting.
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 24, borderTop: '0.5px solid var(--rule)' }}>
          <button className="btn gold" onClick={handleSubmit}>Submit <Icon name="arrow" size={14} /></button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function InqField({ label, children, error, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan === 2 ? 'span 2' : 'auto' }}>
      <label className="field-label">{label}</label>
      {children}
      {error && <p style={{ fontSize: 12, color: 'var(--burgundy)', margin: '6px 0 0', fontFamily: 'var(--mono)' }}>{error}</p>}
    </div>
  );
}

function Landing({ navigate, user, onSignIn, onSubmitInquiry }) {
  useScrollReveal();
  const [vendorModal, setVendorModal] = React.useState(false);
  const [inquiryModal, setInquiryModal] = React.useState(false);

  return (
    <main className="page-fade">
      {/* HERO ─────────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div className="eyebrow eyebrow-gold hero-anim" style={{ animationDelay: '0.15s', marginBottom: 32 }}>
              — Ghana's Vetted Event Vendor Network —
            </div>
            <h1 className="display hero-anim" style={{ animationDelay: '0.3s', fontSize: 'clamp(56px, 8vw, 124px)', margin: 0 }}>
              You paid<br />for<em> excellence.</em><br />
              <span style={{ fontStyle: 'normal', letterSpacing: '-0.02em' }}>Now,</span> <em>make sure</em><br />
              <span style={{ fontStyle: 'normal', letterSpacing: '-0.02em' }}>you get it.</span>
            </h1>
            <hr className="h-rule hero-anim" style={{ animationDelay: '0.5s', margin: '40px 0 28px', maxWidth: 460 }} />
            <p className="hero-anim" style={{ animationDelay: '0.55s', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 460, margin: 0 }}>
              Oikos Arete is a personally vetted network of Ghana's most reliable event vendors, built for people who refuse to gamble on their most important days.
            </p>
            <div className="hero-anim" style={{ animationDelay: '0.7s', display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
              <a href="#/browse" className="btn">
                Browse Vetted Vendors <Icon name="arrow" size={14} />
              </a>
              <button className="btn ghost" onClick={() => setVendorModal(true)}>
                Register as a Vendor
              </button>
            </div>
          </div>

          <aside className="hero-anim" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Tile colors={['#0E0E0C', '#A88A4A']} monogram="OA" style={{ aspectRatio: '4/5' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Tile colors={['#5C1A2B', '#A88A4A']} style={{ aspectRatio: '1/1' }} />
              <Tile colors={['#1a1612', '#C9A95F']} style={{ aspectRatio: '1/1' }} />
            </div>
            <div style={{ borderTop: '0.5px solid var(--accent)', paddingTop: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pl. I — Frontispiece</span>
              <span>Composed MMXXV</span>
            </div>
          </aside>
        </div>
      </section>

      {/* MARQUEE ──────────────────────────────────────── */}
      <section style={{ borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', padding: '24px 0', overflow: 'hidden', background: 'var(--bg-2)' }}>
        <div className="marquee-track">
          <MarqueeCopy />
          <MarqueeCopy />
        </div>
      </section>

      {/* VALUES ──────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div className="reveal">
          <SectionMark num="I" label="The Argument" />
        </div>
        <h2 className="display reveal" style={{ animationDelay: '0.12s', fontSize: 'clamp(40px, 5vw, 68px)', margin: '0 0 80px', maxWidth: 900 }}>
          Why we check <em>before</em> you have to.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 60, columnGap: 80 }}>
          {VALUES.map((v, i) =>
            <div key={v.num} className="reveal" style={{ animationDelay: `${i * 0.1}s`, borderTop: '0.5px solid var(--rule)', paddingTop: 24, display: 'grid', gridTemplateColumns: '60px 1fr', gap: 20 }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', paddingTop: 4 }}>— {v.num}</span>
              <div>
                <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.1 }}>{v.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-3)', margin: 0 }}>{v.body}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EVENT TYPE SELECTOR ─────────────────────────── */}
      <section id="event-types" className="shell" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="reveal">
          <SectionMark num="II" label="Choose the Occasion" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 60, alignItems: 'end' }}>
          <h2 className="display reveal" style={{ animationDelay: '0.12s', fontSize: 'clamp(40px, 5vw, 68px)', margin: 0 }}>
            What is the <em>occasion?</em>
          </h2>
          <p className="reveal" style={{ animationDelay: '0.24s', fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>
            Choose the occasion to filter the register to vendors who specialise in it. You can refine by city, category, and price thereafter.
          </p>
        </div>

        <div style={{ borderTop: '0.5px solid var(--ink)' }}>
          {window.OA_DATA.EVENT_TYPES.map((e, i) =>
            <a key={e.id} href={`#/browse?event=${e.id}`}
              className="reveal"
              style={{
                display: 'grid', gridTemplateColumns: '80px 1.4fr 2fr 60px',
                alignItems: 'center', gap: 32, padding: '32px 0',
                borderBottom: '0.5px solid var(--rule)',
                cursor: 'pointer',
                transition: 'background .25s, padding .25s',
                animationDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e2) => { e2.currentTarget.style.paddingLeft = '24px'; e2.currentTarget.style.background = 'var(--accent-soft)'; }}
              onMouseLeave={(e2) => { e2.currentTarget.style.paddingLeft = '0'; e2.currentTarget.style.background = 'transparent'; }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--accent)' }}>— {e.num}</span>
              <h3 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, margin: 0, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                {e.label}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: 0, lineHeight: 1.45 }}>{e.sub}</p>
              <span style={{ justifySelf: 'end', color: 'var(--accent)' }}><Icon name="arrow" size={20} stroke={1} /></span>
            </a>
          )}
        </div>
      </section>

      {/* HOW IT WORKS ───────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 120, paddingBottom: 100 }}>
        <div className="reveal">
          <SectionMark num="III" label="How It Works" />
        </div>
        <h2 className="display reveal" style={{ animationDelay: '0.12s', fontSize: 'clamp(40px, 5vw, 68px)', margin: '0 0 80px', maxWidth: 700 }}>
          From search to <em>booked,</em> simply.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { num: '01', title: 'Tell us what you need' },
            { num: '02', title: 'Connect directly',     body: "Reach out through the vendor's profile — no middleman, no markup." },
            { num: '03', title: 'Book with confidence', body: 'Every vendor you see has already passed our review. The hard part is done before you even start looking.' },
          ].map((step, i) => (
            <div key={step.num} className="reveal" style={{ animationDelay: `${i * 0.12}s`, borderTop: '0.5px solid var(--rule)', borderRight: i < 2 ? '0.5px solid var(--rule)' : 'none', paddingTop: 32, paddingRight: i < 2 ? 48 : 0, paddingLeft: i > 0 ? 48 : 0 }}>
              <span className="mono" style={{ display: 'block', fontSize: 11, letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 28 }}>— {step.num}</span>
              <h3 className="serif" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 500, margin: '0 0 16px', lineHeight: 1.1 }}>{step.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-3)', margin: 0 }}>
                {step.num === '01'
                  ? <span>Browse vetted vendors by category, or{' '}
                      <button onClick={() => setInquiryModal(true)}
                              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>
                        tell us your event details
                      </button>
                      {' '}and we'll point you in the right direction.
                    </span>
                  : step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE / TESTIMONY ───────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 100, borderTop: '0.5px solid var(--rule)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <div className="reveal-left">
            <Tile colors={['#5C1A2B', '#A88A4A']} monogram="—" style={{ aspectRatio: '3/4', maxWidth: 320 }} />
          </div>
          <div className="reveal-right" style={{ animationDelay: '0.18s' }}>
            <span className="eyebrow eyebrow-gold">— Letter, A. Mensah —</span>
            <p className="serif" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.18, margin: '24px 0 28px', color: 'var(--ink)' }}>
              <span style={{ fontSize: '1.4em', color: 'var(--accent)', verticalAlign: '-0.1em' }}>"</span>
              I did not have to wonder if they would show up. That is the whole point of a vetted vendor.
              <span style={{ color: 'var(--accent)' }}>"</span>
            </p>
            <hr className="h-rule" style={{ maxWidth: 100, marginBottom: 16 }} />
            <p className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: 0 }}>
              Wedding, Accra · 2025 · 180 guests
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA ─────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="shell reveal-scale" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 28 }}>— Excellence, vetted —</div>
          <h2 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: '0 0 40px', color: 'var(--bg)' }}>
            Find a vendor <em style={{ color: 'var(--accent)' }}>you can trust.</em>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--bg)', opacity: 0.7, maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.5 }}>
            Browse our network of personally vetted vendors and build a shortlist for your event, no guesswork required.
          </p>
          <a href="#/browse" className="btn gold">
            Browse Vendors <Icon name="arrow" size={14} />
          </a>
        </div>
      </section>

      {vendorModal && <VendorInfoModal onClose={() => setVendorModal(false)} />}
      {inquiryModal && <EventInquiryModal user={user} onSignIn={onSignIn} onClose={() => setInquiryModal(false)} onSubmit={(inq) => { onSubmitInquiry(inq); }} />}
    </main>);

}

window.Landing = Landing;
