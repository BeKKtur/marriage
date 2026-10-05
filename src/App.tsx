import { useEffect, useMemo, useRef, useState } from 'react'
import { weddingConfig as c } from './config/wedding'

const { bride, groom } = c.couple
const eventDate = new Date(`${c.wedding.date}T${c.wedding.time}:00`)
const prettyDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(eventDate).replace(/\sг\.$/, '')
const numericDate = eventDate.toLocaleDateString('ru-RU')
const initials = `${bride[0]} & ${groom[0]}`

function useCountdown() {
  const get = () => Math.max(0, eventDate.getTime() - Date.now())
  const [left, setLeft] = useState(get)
  useEffect(() => { const id = setInterval(() => setLeft(get()), 1000); return () => clearInterval(id) }, [])
  return { days: Math.floor(left / 86400000), hours: Math.floor(left / 3600000) % 24, minutes: Math.floor(left / 60000) % 60, seconds: Math.floor(left / 1000) % 60 }
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.setProperty('--delay', `${delay}ms`)
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); io.disconnect() } }, { threshold: .12 })
    io.observe(el); return () => io.disconnect()
  }, [delay])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

function Botanical({ className = '' }: { className?: string }) {
  return <svg className={`botanical ${className}`} viewBox="0 0 220 420" aria-hidden="true"><path d="M118 418C114 302 128 212 91 91M101 141C61 126 39 96 30 59M107 175C145 151 165 121 172 83M115 231C66 218 41 181 25 145M120 282C160 254 186 215 191 170M116 337C77 324 53 299 38 266"/><path d="M90 91c-23-8-34-29-29-51 24 5 38 23 29 51Zm81-7c-5-24 9-43 34-50 5 22-8 43-34 50ZM30 59C8 50 0 31 5 10c22 6 32 25 25 49Zm-5 86c-20-4-35-20-35-42 22-1 38 15 35 42Zm166 25c-2-23 13-39 36-43 2 22-12 39-36 43ZM38 266c-21-1-37-16-40-37 22-3 40 12 40 37Z"/></svg>
}

function Intro({ onStart, onComplete }: { onStart: () => void, onComplete: () => void }) {
  const [opening, setOpening] = useState(false)
  const open = () => { if (opening) return; setOpening(true); onStart(); window.setTimeout(onComplete, 3650) }
  return <div className={`curtain-intro ${opening ? 'is-opening' : ''}`} aria-label="Открыть свадебное приглашение">
    <div className="stage-glow"/><div className="curtain curtain-left"><div className="silk-folds"/><div className="curtain-edge"/></div><div className="curtain curtain-right"><div className="silk-folds"/><div className="curtain-edge"/></div>
    <div className="curtain-top"><span/><span/><span/><span/><span/><span/></div>
    <div className="intro-vignette"/><div className="intro-stars"><i/><i/><i/><i/><i/></div>
    <div className="intro-center">
      <p className="intro-overline">A private invitation</p>
      <div className="intro-monogram"><span>{bride[0]}</span><i>&</i><span>{groom[0]}</span></div>
      <p className="intro-names">{bride} <i>and</i> {groom}</p>
      <div className="intro-rule"><span/></div>
      <button className="curtain-open" onClick={open} disabled={opening}><span>Открыть приглашение</span><i className="curtain-arrow" aria-hidden="true" /></button>
      <p className="intro-date">{prettyDate}</p>
    </div>
  </div>
}

function Music({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false)
  const toggle = async () => {
    const a = audioRef.current; if (!a) return
    if (a.paused) {
      try { await a.play(); setPlaying(true) } catch { setPlaying(false) }
    } else { a.pause(); setPlaying(false) }
  }
  return <button className={`music ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Поставить музыку на паузу' : 'Включить музыку'}><span className="music-disc">♫</span><i>{playing ? 'pause' : 'play our song'}</i></button>
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [opening, setOpening] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const countdown = useCountdown()
  const units = useMemo(() => [['дней', countdown.days], ['часов', countdown.hours], ['минут', countdown.minutes], ['секунд', countdown.seconds]] as const, [countdown])
  const startOpening = () => { setOpening(true); audioRef.current?.play().catch(() => {}) }
  const finishOpening = () => setEntered(true)

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [entered])

  useEffect(() => {
    if (!entered || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => { document.documentElement.style.setProperty('--scroll', `${window.scrollY}`); raf = 0 }
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    addEventListener('scroll', scroll, { passive: true }); return () => { removeEventListener('scroll', scroll); cancelAnimationFrame(raf) }
  }, [entered])

  return <>
    {!entered && <Intro onStart={startOpening} onComplete={finishOpening}/>}<audio ref={audioRef} src={c.music.src} loop/>{entered && <Music audioRef={audioRef}/>} 
    <main className={`site${opening ? ' opening-scene' : ''}${entered ? ' entered' : ''}`}>
      <section className="hero">
        <div className="hero-image" style={{ backgroundImage: `url(${c.photos.hero})` }}/><div className="hero-veil"/><div className="hero-frame"/>
        <p className="hero-monogram">{initials}</p><p className="eyebrow">{c.text.heroEyebrow}</p>
        <h1><span>{bride}</span><i>&</i><span>{groom}</span></h1>
        <div className="hero-bottom"><p>{c.text.heroSubtitle}</p><div className="hero-date"><span/>{numericDate}<span/></div></div>
        <a className="scroll-hint" href="#invitation"><span>Откройте нашу историю</span><b>↓</b></a>
      </section>

      <section id="invitation" className="letter section-shell">
        <Botanical className="letter-botanical"/><span className="giant-and">&</span>
        <Reveal className="letter-copy"><p className="section-num">01 — ПРИГЛАШЕНИЕ</p><p className="script">с любовью к вам</p><h2>{c.text.invitationTitle}</h2><div className="draw-line"/><p className="lead">{c.text.invitationBody}</p><p className="signature">{bride} <i>&</i> {groom}</p></Reveal>
        <Reveal className="letter-photo" delay={180}><div className="photo-mat"><img src={c.photos.couple1} alt={`${bride} и ${groom}`} loading="lazy"/><small>{c.text.photoCaption}</small></div><span className="photo-index">I</span></Reveal>
      </section>

      <section className="quote-band"><Reveal><span>“</span><blockquote>{c.text.quote}</blockquote><p>our forever begins here</p></Reveal></section>

      <section className="story section-shell">
        <Reveal className="story-heading"><p className="section-num light">02 — НАША ИСТОРИЯ</p><h2>{c.text.storyTitleFirst}<br/><em>{c.text.storyTitleSecond}</em></h2></Reveal>
        <div className="story-collage">
          <Reveal className="story-photo story-main"><img src={c.photos.couple2} alt={`История ${bride} и ${groom}`} loading="lazy"/><span>01</span></Reveal>
          <Reveal className="story-photo story-small" delay={150}><img src={c.photos.couple3} alt={`${bride} и ${groom} вместе`} loading="lazy"/><span>02</span></Reveal>
          <Reveal className="story-note" delay={260}><p>{c.text.storyBody}</p><i>{initials}</i></Reveal>
        </div>
      </section>

      <section className="date-reveal section-shell">
        <p className="section-num">SAVE THE DATE</p><Reveal className="date-assembly"><span>{String(eventDate.getDate()).padStart(2,'0')}</span><i>/</i><span>{String(eventDate.getMonth()+1).padStart(2,'0')}</span><i>/</i><span>{eventDate.getFullYear()}</span></Reveal>
        <Reveal className="date-caption" delay={250}><p>{c.wedding.weekday}</p><span>{c.wedding.city}</span><p>{c.wedding.time}</p></Reveal>
      </section>

      <section className="countdown section-shell"><Reveal><p className="script">До нашей свадьбы</p><div className="count-grid">{units.map(([label,value],i)=><div key={label} style={{'--i':i} as React.CSSProperties}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}</div></Reveal></section>

      <section className="schedule section-shell"><div className="schedule-visual"><div className="schedule-photo"><img src={c.photos.couple1} alt="Детали свадебного дня" loading="lazy"/></div><p>the wedding day</p><span>{numericDate}</span></div>
        <div className="schedule-content"><Reveal><p className="section-num">03 — ПРОГРАММА</p><h2>{c.text.scheduleTitleFirst}<br/><em>{c.text.scheduleTitleSecond}</em></h2></Reveal><div className="timeline">{c.schedule.map((item,i)=><Reveal key={`${item.time}-${item.title}`} delay={i*75}><article><span>{String(i+1).padStart(2,'0')}</span><time>{item.time}</time><h3>{item.title}</h3><i/></article></Reveal>)}</div></div>
      </section>

      <section className="venue"><div className="venue-image" style={{backgroundImage:`url(${c.photos.couple2})`}}/><div className="venue-shade"/><Botanical className="venue-branch"/><Reveal className="venue-card"><p className="section-num light">04 — МЕСТО</p><p className="script">будем ждать вас</p><h2>{c.location.name}</h2><div className="fine-rule"/><p>{c.location.address}</p><p>{prettyDate} · {c.wedding.time}</p><a className="map-link" href={c.location.twoGisUrl} target="_blank" rel="noopener noreferrer">Открыть в 2ГИС <span>↗</span></a></Reveal></section>

      <section className="dress section-shell"><Reveal className="dress-title"><p className="section-num">05 — ДРЕСС-КОД</p><p className="script">details matter</p><h2>Палитра<br/><em>вечера</em></h2></Reveal><Reveal className="dress-info" delay={180}><p>{c.dressCode.text}</p><div className="swatches">{c.dressCode.colors.map((color,i)=><span key={color} style={{backgroundColor:color}}><i>{String(i+1).padStart(2,'0')}</i></span>)}</div><small>{c.dressCode.colorNames}</small></Reveal></section>

      <footer><div className="footer-photo" style={{backgroundImage:`url(${c.photos.hero})`}}/><div className="footer-overlay"/><div className="footer-frame"/><Reveal className="footer-content"><p className="section-num light">{c.text.footerTitle}</p><h2><span>{bride}</span><i>&</i><span>{groom}</span></h2><div className="footer-date">{prettyDate}</div><p>{c.text.footerMessage}</p><span className="footer-mark">{initials}</span></Reveal></footer>
    </main>
  </>
}
