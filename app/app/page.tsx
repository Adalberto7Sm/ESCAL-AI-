// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState } from "react";
import de from "../messages/de.json";
import fr from "../messages/fr.json";
import es from "../messages/es.json";
import en from "../messages/en.json";
import it from "../messages/it.json";

const messages = { de, fr, es, en, it } as const;
type Lang = keyof typeof messages;

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "it", flag: "🇮🇹", label: "IT" },
];

const SLOTS_REMAINING = 33;
const CONSULT_SLOTS = 7;

type ConsultQuestion = {
  block: string;
  q: Record<Lang, string>;
  loss: number;
};

const CONSULT_QUESTIONS: ConsultQuestion[] = [
  // Block 1 — Estadísticas
  { block: "stats", q: { de: "Kennen Sie Ihre genaue Auslastungsquote (% belegte Tische)?", fr: "Connaissez-vous votre taux d'occupation exact (% tables occupées)?", es: "¿Conoce su tasa de ocupación exacta (% mesas ocupadas)?", en: "Do you know your exact occupancy rate (% tables occupied)?", it: "Conosce il suo tasso di occupazione esatto (% tavoli occupati)?" }, loss: 500 },
  { block: "stats", q: { de: "Wissen Sie, wie hoch Ihr durchschnittlicher Bon pro Kunde ist?", fr: "Connaissez-vous votre ticket moyen par client?", es: "¿Sabe cuánto gasta en promedio cada cliente?", en: "Do you know your average spend per customer?", it: "Sa quanto spende in media ogni cliente?" }, loss: 400 },
  { block: "stats", q: { de: "Wissen Sie, wie hoch Ihre Lebensmittelkosten (%) sind?", fr: "Connaissez-vous vos coûts matière (food cost en %)?", es: "¿Conoce su porcentaje de food cost exacto?", en: "Do you know your exact food cost percentage?", it: "Conosce la sua percentuale esatta di food cost?" }, loss: 800 },
  { block: "stats", q: { de: "Wissen Sie, wie viele Neukunden Sie monatlich gewinnen?", fr: "Savez-vous combien de nouveaux clients vous gagnez chaque mois?", es: "¿Sabe cuántos clientes nuevos gana cada mes?", en: "Do you know how many new customers you gain each month?", it: "Sa quanti nuovi clienti acquisisce ogni mese?" }, loss: 350 },
  // Block 2 — Digital
  { block: "digital", q: { de: "Haben Sie eine professionelle Website mit Menü und Reservierung?", fr: "Avez-vous un site web professionnel avec menu et réservation?", es: "¿Tiene un sitio web profesional con menú y reservas?", en: "Do you have a professional website with menu and reservations?", it: "Ha un sito web professionale con menù e prenotazioni?" }, loss: 700 },
  { block: "digital", q: { de: "Sind Sie aktiv auf Google Maps (Google Business Profile)?", fr: "Êtes-vous actif sur Google Maps (Google Business Profile)?", es: "¿Está activo en Google Maps (Google Business Profile)?", en: "Are you active on Google Maps (Google Business Profile)?", it: "È attivo su Google Maps (Google Business Profile)?" }, loss: 600 },
  { block: "digital", q: { de: "Haben Sie ein aktives Social-Media-System (mind. 3x/Woche)?", fr: "Avez-vous un système de réseaux sociaux actif (min. 3x/semaine)?", es: "¿Tiene un sistema de redes sociales activo (mín. 3x/semana)?", en: "Do you have an active social media system (min. 3x/week)?", it: "Ha un sistema di social media attivo (min. 3x/settimana)?" }, loss: 500 },
  { block: "digital", q: { de: "Akzeptieren Sie Online-Reservierungen oder Bestellungen?", fr: "Acceptez-vous les réservations ou commandes en ligne?", es: "¿Acepta reservaciones u órdenes en línea?", en: "Do you accept online reservations or orders?", it: "Accetta prenotazioni o ordini online?" }, loss: 650 },
  { block: "digital", q: { de: "Haben Sie ein digitales Treueprogramm für Stammkunden?", fr: "Avez-vous un programme de fidélité numérique pour vos clients réguliers?", es: "¿Tiene un programa de fidelización digital para clientes frecuentes?", en: "Do you have a digital loyalty program for regular customers?", it: "Ha un programma fedeltà digitale per i clienti abituali?" }, loss: 400 },
  // Block 3 — IA / Automatización
  { block: "ai", q: { de: "Nutzen Sie KI-Tools für Marketing oder Menüentwicklung?", fr: "Utilisez-vous des outils d'IA pour le marketing ou le développement de menu?", es: "¿Usa herramientas de IA para marketing o desarrollo de menú?", en: "Do you use AI tools for marketing or menu development?", it: "Usa strumenti di IA per il marketing o lo sviluppo del menù?" }, loss: 450 },
  { block: "ai", q: { de: "Haben Sie ein automatisiertes WhatsApp-System für Kunden?", fr: "Avez-vous un système WhatsApp automatisé pour les clients?", es: "¿Tiene un sistema de WhatsApp automatizado para clientes?", en: "Do you have an automated WhatsApp system for customers?", it: "Ha un sistema WhatsApp automatizzato per i clienti?" }, loss: 550 },
  { block: "ai", q: { de: "Verwenden Sie digitale Tools für Kostenkontrolle und Analyse?", fr: "Utilisez-vous des outils numériques pour le contrôle des coûts et l'analyse?", es: "¿Usa herramientas digitales para control de costos y análisis?", en: "Do you use digital tools for cost control and analysis?", it: "Usa strumenti digitali per il controllo dei costi e l'analisi?" }, loss: 700 },
  // Block 4 — Actividades
  { block: "events", q: { de: "Organisieren Sie regelmäßig Events (Themenabende, Partys, etc.)?", fr: "Organisez-vous régulièrement des événements (soirées à thème, fêtes, etc.)?", es: "¿Organiza eventos regularmente (noches temáticas, fiestas, etc.)?", en: "Do you regularly organise events (theme nights, parties, etc.)?", it: "Organizza regolarmente eventi (serate a tema, feste, ecc.)?" }, loss: 900 },
  { block: "events", q: { de: "Haben Sie ein System für Firmen- oder Gruppenveranstaltungen?", fr: "Avez-vous un système pour les événements d'entreprise ou de groupe?", es: "¿Tiene un sistema para eventos corporativos o de grupos?", en: "Do you have a system for corporate or group events?", it: "Ha un sistema per eventi aziendali o di gruppo?" }, loss: 600 },
  { block: "events", q: { de: "Nutzen Sie saisonale Aktionen, um Umsatzspitzen zu erzeugen?", fr: "Utilisez-vous des promotions saisonnières pour créer des pics de chiffre d'affaires?", es: "¿Aprovecha fechas especiales y temporadas para generar picos de ventas?", en: "Do you use seasonal promotions to generate revenue peaks?", it: "Usa promozioni stagionali per generare picchi di fatturato?" }, loss: 400 },
  // Block 5 — Escalabilidad
  { block: "scale", q: { de: "Könnten Sie 1 Woche abwesend sein, ohne dass der Betrieb stoppt?", fr: "Pourriez-vous être absent 1 semaine sans que votre établissement s'arrête?", es: "¿Podría estar 1 semana fuera sin que su negocio se detenga?", en: "Could you be away for 1 week without your business stopping?", it: "Potrebbe essere assente 1 settimana senza che il business si fermi?" }, loss: 1200 },
  { block: "scale", q: { de: "Haben Sie ein dokumentiertes Betriebshandbuch für Ihr Team?", fr: "Avez-vous un manuel opérationnel documenté pour votre équipe?", es: "¿Tiene un manual operativo documentado para su equipo?", en: "Do you have a documented operational manual for your team?", it: "Ha un manuale operativo documentato per il suo team?" }, loss: 500 },
  { block: "scale", q: { de: "Haben Sie einen klaren Wachstumsplan für die nächsten 12 Monate?", fr: "Avez-vous un plan de croissance clair pour les 12 prochains mois?", es: "¿Tiene un plan de crecimiento claro para los próximos 12 meses?", en: "Do you have a clear growth plan for the next 12 months?", it: "Ha un piano di crescita chiaro per i prossimi 12 mesi?" }, loss: 750 },
];

const BLOCK_LABELS: Record<string, Record<Lang, string>> = {
  stats:   { de: "📊 STATISTIKEN", fr: "📊 STATISTIQUES", es: "📊 ESTADÍSTICAS", en: "📊 STATISTICS", it: "📊 STATISTICHE" },
  digital: { de: "💻 DIGITALE PRÄSENZ", fr: "💻 PRÉSENCE DIGITALE", es: "💻 PRESENCIA DIGITAL", en: "💻 DIGITAL PRESENCE", it: "💻 PRESENZA DIGITALE" },
  ai:      { de: "🤖 KI & AUTOMATISIERUNG", fr: "🤖 IA & AUTOMATISATION", es: "🤖 IA & AUTOMATIZACIÓN", en: "🤖 AI & AUTOMATION", it: "🤖 IA & AUTOMAZIONE" },
  events:  { de: "🎪 EVENTS & AKTIVITÄTEN", fr: "🎪 ÉVÉNEMENTS & ACTIVITÉS", es: "🎪 EVENTOS & ACTIVIDADES", en: "🎪 EVENTS & ACTIVITIES", it: "🎪 EVENTI & ATTIVITÀ" },
  scale:   { de: "🚀 SKALIERBARKEIT", fr: "🚀 SCALABILITÉ", es: "🚀 ESCALABILIDAD", en: "🚀 SCALABILITY", it: "🚀 SCALABILITÀ" },
};

const planBg: Record<string, string> = {
  free: "bg-[#1A1A1A] border-[#333]",
  once: "bg-[#1A1A1A] border-[#D4AF37]/40",
  monthly: "bg-[#1A1A1A] border-[#333]",
  special: "bg-[#1a0a0a] border-red-900/60",
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("de");
  const [slots] = useState(SLOTS_REMAINING);
  const [quizStep, setQuizStep] = useState(-1);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [formData, setFormData] = useState({ name: "", business: "", city: "", phone: "", plan: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [consultStep, setConsultStep] = useState(-1);
  const [consultAnswers, setConsultAnswers] = useState<("yes"|"no"|"none")[]>([]);
  const [consultDone, setConsultDone] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [consultSlots] = useState(CONSULT_SLOTS);

  const t = messages[lang];

  const getQuizScore = () => {
    if (quizAnswers.length === 0) return 0;
    const total = quizAnswers.reduce((a, b) => a + b, 0);
    const max = quizAnswers.length * 2;
    return Math.round((total / max) * 100);
  };

  const getQuizResult = () => {
    const score = getQuizScore();
    if (score >= 60) return t.quiz.result_high;
    if (score >= 30) return t.quiz.result_mid;
    return t.quiz.result_low;
  };

  const getMonthlyLoss = () => {
    const score = getQuizScore();
    if (score >= 60) return "CHF 3.500";
    if (score >= 30) return "CHF 8.000";
    return "CHF 15.000+";
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    if (quizStep + 1 >= t.quiz.questions.length) {
      setQuizDone(true);
    } else {
      setQuizStep(quizStep + 1);
    }
  };

  const startQuiz = () => {
    setQuizAnswers([]);
    setQuizDone(false);
    setQuizStep(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lang }),
      });
      if (res.ok) setFormSent(true);
      else setFormSent(true);
    } catch {
      setFormSent(true);
    }
    setFormLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const startLabel = lang === "de" ? "Diagnose starten" : lang === "fr" ? "Commencer" : lang === "it" ? "Inizia" : lang === "es" ? "Comenzar" : "Start";
  const restartLabel = lang === "de" ? "Wiederholen" : lang === "fr" ? "Recommencer" : lang === "it" ? "Ricomincia" : lang === "es" ? "Repetir" : "Restart";
  const selectLabel = (free: boolean) => free ? (lang === "de" ? "Jetzt buchen" : lang === "fr" ? "Réserver" : lang === "it" ? "Prenota" : lang === "es" ? "Reservar" : "Book now") : (lang === "de" ? "Auswählen" : lang === "fr" ? "Choisir" : lang === "it" ? "Scegli" : lang === "es" ? "Elegir" : "Select");
  const posLabel = lang === "de" ? "Position" : lang === "fr" ? "Poste" : lang === "it" ? "Posizione" : lang === "es" ? "Posición" : "Position";

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D", color: "#F5F5F5" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#D4AF37]/20" style={{ background: "rgba(13,13,13,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="text-lg font-bold gold-text shrink-0">#MYGASTROIA#</div>

          <div className="hidden md:flex items-center gap-5">
            {(["diagnose","solution","guarantee"] as const).map(k => (
              <button key={k} onClick={() => scrollTo(k)} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">{t.nav[k]}</button>
            ))}
            <button onClick={() => scrollTo("services")} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">
              {lang === "de" ? "Leistungen" : lang === "fr" ? "Services" : lang === "it" ? "Servizi" : lang === "es" ? "Servicios" : "Services"}
            </button>
            <button onClick={() => scrollTo("learning")} className="text-sm text-[#D4AF37] font-bold hover:text-[#FFD700] transition-colors">
              {lang === "de" ? "Lernen" : lang === "fr" ? "Formation" : lang === "it" ? "Formazione" : lang === "es" ? "Aprendizaje" : "Learning"}
            </button>
            <button onClick={() => scrollTo("consultoria")} className="text-sm font-bold text-[#FFD700] border border-[#D4AF37]/60 px-3 py-1 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
              {lang === "de" ? "Beratung" : lang === "fr" ? "Consultation" : lang === "it" ? "Consulenza" : lang === "es" ? "Consultoría" : "Consultation"}
            </button>
            <button onClick={() => scrollTo("contact")} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">{t.nav.contact}</button>
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-end">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-xs px-2 py-1 rounded transition-all ${lang === l.code ? "bg-[#D4AF37] text-black font-bold" : "text-gray-400 hover:text-white"}`}>
                {l.flag} {l.label}
              </button>
            ))}
            <button className="md:hidden ml-1 text-[#D4AF37] text-lg" onClick={() => setNavOpen(!navOpen)}>{navOpen ? "✕" : "☰"}</button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-[#D4AF37]/20 px-4 py-4 flex flex-col gap-4" style={{ background: "rgba(13,13,13,0.98)" }}>
            {(["diagnose","solution","guarantee"] as const).map(k => (
              <button key={k} onClick={() => scrollTo(k)} className="text-left text-gray-300 hover:text-[#D4AF37]">{t.nav[k]}</button>
            ))}
            <button onClick={() => scrollTo("services")} className="text-left text-gray-300 hover:text-[#D4AF37]">
              {lang === "de" ? "Leistungen" : lang === "fr" ? "Services" : lang === "it" ? "Servizi" : lang === "es" ? "Servicios" : "Services"}
            </button>
            <button onClick={() => scrollTo("learning")} className="text-left text-[#D4AF37] font-bold">
              {lang === "de" ? "Lernen" : lang === "fr" ? "Formation" : lang === "it" ? "Formazione" : lang === "es" ? "Aprendizaje" : "Learning"}
            </button>
            <button onClick={() => scrollTo("consultoria")} className="text-left text-[#FFD700] font-bold">
              {lang === "de" ? "Beratung 1:1" : lang === "fr" ? "Consultation 1:1" : lang === "it" ? "Consulenza 1:1" : lang === "es" ? "Consultoría 1:1" : "Consultation 1:1"}
            </button>
            <button onClick={() => scrollTo("contact")} className="text-left text-gray-300 hover:text-[#D4AF37]">{t.nav.contact}</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #FFD700, transparent)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 text-sm mb-8 pulse-gold" style={{ background: "#1A0F00" }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[#D4AF37] font-medium">{t.hero.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="text-white">{t.hero.headline1} </span>
            <span className="gold-text">{t.hero.headline2}</span>
            <br />
            <span className="text-white">{t.hero.headline3}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">{t.hero.sub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => scrollTo("contact")} className="gold-gradient text-black font-black text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold">
              {t.hero.cta_primary}
            </button>
            <button onClick={() => scrollTo("plans")} className="border border-[#D4AF37] text-[#D4AF37] font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#D4AF37]/10 transition-colors">
              {t.hero.cta_secondary}
            </button>
          </div>
          <p className="text-gray-400 text-sm">{t.hero.trust}</p>
        </div>
      </section>

      {/* PAIN */}
      <section id="diagnose" className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 gold-text">{t.pain.title}</h2>
          <div className="grid gap-4 mb-10">
            {t.pain.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl card-premium transition-all">
                <span className="text-2xl text-red-500 mt-0.5 shrink-0">⚠</span>
                <span className="text-lg text-gray-200">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center p-6 rounded-2xl border border-[#D4AF37]/40" style={{ background: "#1A0F00" }}>
            <p className="text-xl font-bold text-[#D4AF37]">{t.pain.conclusion}</p>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section id="quiz" className="py-20 px-4" style={{ background: "#0D0D0D" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 gold-text">{t.quiz.title}</h2>
            <p className="text-gray-400">{t.quiz.subtitle}</p>
          </div>
          <div className="rounded-2xl p-6 md:p-8 card-premium">
            {quizStep === -1 && !quizDone && (
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <p className="text-gray-300 mb-8">{t.quiz.subtitle}</p>
                <button onClick={startQuiz} className="gold-gradient text-black font-black px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity">{startLabel}</button>
              </div>
            )}
            {quizStep >= 0 && !quizDone && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#D4AF37] font-bold text-sm">{quizStep + 1} / {t.quiz.questions.length}</span>
                  <div className="flex-1 mx-4 h-1 rounded-full bg-[#333]">
                    <div className="h-1 rounded-full bg-[#D4AF37] transition-all" style={{ width: `${((quizStep + 1) / t.quiz.questions.length) * 100}%` }} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-6">{t.quiz.questions[quizStep].q}</h3>
                <div className="flex flex-col gap-3">
                  {t.quiz.questions[quizStep].a.map((answer, i) => (
                    <button key={i} onClick={() => handleQuizAnswer(i)}
                      className="text-left px-6 py-4 rounded-xl border border-[#333] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-gray-200 font-medium">
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {quizDone && (
              <div className="text-center">
                <div className="text-5xl mb-4">{getQuizScore() >= 60 ? "📈" : getQuizScore() >= 30 ? "⚡" : "🚨"}</div>
                <h3 className="text-xl font-bold text-white mb-3">{getQuizResult()}</h3>
                <div className="my-6 p-4 rounded-xl" style={{ background: "#1A0F00", border: "1px solid #D4AF37" }}>
                  <p className="text-gray-300 text-sm mb-1">{t.quiz.loss_text}</p>
                  <p className="text-3xl font-black text-[#D4AF37]">{getMonthlyLoss()}</p>
                </div>
                <button onClick={() => scrollTo("contact")} className="gold-gradient text-black font-black px-8 py-4 rounded-xl text-lg w-full hover:opacity-90 transition-opacity mb-3">
                  {t.quiz.cta}
                </button>
                <button onClick={startQuiz} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{restartLabel}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-bold text-[#D4AF37] border border-[#D4AF37]/40 rounded-full mb-4">{t.solution.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black gold-text mb-3">{t.solution.title}</h2>
            <p className="text-xl text-white font-bold mb-2">{t.solution.subtitle}</p>
            <p className="text-[#D4AF37] font-bold tracking-widest text-sm">{t.solution.tagline}</p>
          </div>
          <div className="text-center p-6 rounded-2xl mb-12 card-premium">
            <p className="text-lg text-gray-200">{t.solution.mission}</p>
          </div>
          <div className="grid gap-4 md:gap-6">
            {t.solution.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 p-6 rounded-2xl card-premium transition-all hover:border-[#D4AF37]">
                <div className="text-3xl font-black gold-text shrink-0">{step.n}</div>
                <div>
                  <h3 className="text-lg font-black text-[#D4AF37] mb-1">{step.title}</h3>
                  <p className="text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-20 px-4" style={{ background: "#0D0D0D" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-[0.3em] mb-2" style={{ color: "#D4AF3799" }}>
              {lang === "de" ? "WERTETREPPE" : lang === "fr" ? "ÉCHELLE DE VALEUR" : lang === "it" ? "SCALA DI VALORE" : lang === "es" ? "ESCALERA DE VALOR" : "VALUE LADDER"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-3 gold-text">{t.plans.title}</h2>
            <p className="text-gray-400">{t.plans.subtitle}</p>
          </div>
          <div className="mb-10 p-6 rounded-2xl border border-[#D4AF37]/30 max-w-3xl mx-auto" style={{ background: "#1A0F00" }}>
            <p className="text-[#D4AF37] font-bold text-center mb-4">{t.plans.includes}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {t.plans.included_items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300"><span className="text-[#D4AF37]">✓</span> {item}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.plans.list.map((plan) => (
              <div key={plan.n} className={`relative rounded-2xl border p-5 flex flex-col transition-all ${(plan as {popular?: boolean}).popular ? "plan-popular bg-[#1A0F00]" : (plan as {exclusive?: boolean}).exclusive ? "bg-[#0A0A1A] border-blue-900/60" : planBg[plan.type] || "bg-[#1A1A1A] border-[#333]"}`}>
                {(plan as {popular?: boolean}).popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-black text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">{t.plans.popular}</div>
                )}
                {(plan as {exclusive?: boolean}).exclusive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">{t.plans.exclusive}</div>
                )}
                <div className="text-xs text-gray-500 mb-1">#{plan.n}</div>
                <h3 className="text-sm font-black text-[#D4AF37] mb-2">{plan.name}</h3>
                <div className="text-2xl font-black text-white mb-1">
                  {plan.price}
                  {plan.type === "monthly" && <span className="text-sm text-gray-400 font-normal">{t.plans.per_month}</span>}
                </div>
                {plan.type === "monthly" && <p className="text-xs text-gray-500 mb-3">{t.plans.contract}</p>}
                <p className="text-xs text-gray-400 flex-1 mb-4">{plan.desc}</p>
                <button
                  onClick={() => { setFormData(prev => ({ ...prev, plan: plan.name })); scrollTo("contact"); }}
                  className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${(plan as {popular?: boolean}).popular ? "gold-gradient text-black hover:opacity-90" : "border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/10"}`}>
                  {selectLabel(plan.type === "free")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3 gold-text">{t.compare.title}</h2>
            <p className="text-gray-400">{t.compare.subtitle}</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30">
            <div className="grid grid-cols-3 bg-[#1A0F00] py-3 px-4">
              <div className="text-sm font-bold text-gray-400">{posLabel}</div>
              <div className="text-sm font-bold text-red-400 text-center">{t.compare.col_a}</div>
              <div className="text-sm font-bold text-[#D4AF37] text-center">{t.compare.col_b}</div>
            </div>
            {t.compare.rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 py-3 px-4 border-t border-[#333] ${i % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#111]"}`}>
                <div className="text-sm text-gray-300">{row[0]}</div>
                <div className="text-sm text-red-400 text-center">{row[1]}</div>
                <div className="text-sm text-[#D4AF37] text-center font-bold">{row[2]}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 py-4 px-4 border-t border-[#D4AF37]/40 bg-[#0A0A0A]">
              <div className="text-sm font-black text-white">TOTAL</div>
              <div className="text-sm font-black text-red-400 text-center">{t.compare.total_a}</div>
              <div className="text-sm font-black text-[#D4AF37] text-center">{t.compare.total_b}</div>
            </div>
          </div>
          <div className="mt-6 text-center p-4 rounded-xl gold-gradient">
            <p className="text-black font-black text-xl">{t.compare.saving}</p>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section id="guarantee" className="py-20 px-4" style={{ background: "#0D0D0D" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-8 px-6 py-3 rounded-full border-2 border-[#D4AF37] pulse-gold" style={{ background: "#1A0F00" }}>
            <span className="text-[#D4AF37] font-black text-sm tracking-widest">{t.guarantee.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3 gold-text">{t.guarantee.title}</h2>
          <p className="text-gray-400 mb-10">{t.guarantee.subtitle}</p>
          <div className="grid gap-4">
            {t.guarantee.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl text-left card-premium">
                <span className="text-[#D4AF37] text-xl shrink-0">✓</span>
                <p className="text-gray-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 gold-text">{t.cases.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.cases.list.map((c, i) => (
              <div key={i} className="p-6 rounded-2xl card-premium transition-all">
                <div className="text-[#D4AF37] font-black text-sm mb-3">{c.type}</div>
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-red-400 shrink-0">✗</span>
                  <p className="text-gray-400 text-sm">{c.problem}</p>
                </div>
                <div className="border-t border-[#333] pt-3 flex items-start gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <p className="text-green-300 text-sm font-medium">{c.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 px-4" style={{ background: "#0D0D0D" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black gold-text mb-3">
              {lang === "de" ? "Alle Leistungen" : lang === "fr" ? "Tous les services" : lang === "it" ? "Tutti i servizi" : lang === "es" ? "Todos los servicios" : "All Services"}
            </h2>
            <p className="text-gray-400">
              {lang === "de" ? "Was Sie erhalten — in jedem Plan" : lang === "fr" ? "Ce que vous obtenez — dans chaque plan" : lang === "it" ? "Cosa ottieni — in ogni piano" : lang === "es" ? "Lo que obtienes — en cada plan" : "What you get — in every plan"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: "🤖", title: lang === "de" ? "KI-Diagnose & Strategie" : lang === "fr" ? "Diagnostic IA & Stratégie" : lang === "it" ? "Diagnosi IA & Strategia" : lang === "es" ? "Diagnóstico IA & Estrategia" : "AI Diagnosis & Strategy" },
              { icon: "📢", title: lang === "de" ? "Werbebank 365 Tage" : lang === "fr" ? "Banque Publicitaire 365 jours" : lang === "it" ? "Banca Pubblicitaria 365 giorni" : lang === "es" ? "Banco Publicitario 365 días" : "Advertising Bank 365 Days" },
              { icon: "📱", title: lang === "de" ? "Social Media Management" : lang === "fr" ? "Gestion Réseaux Sociaux" : lang === "it" ? "Gestione Social Media" : lang === "es" ? "Gestión Redes Sociales" : "Social Media Management" },
              { icon: "🔍", title: lang === "de" ? "Lokales SEO & Google" : lang === "fr" ? "SEO Local & Google" : lang === "it" ? "SEO Locale & Google" : lang === "es" ? "SEO Local & Google" : "Local SEO & Google" },
              { icon: "📧", title: lang === "de" ? "E-Mail-Marketing" : lang === "fr" ? "E-mail Marketing" : lang === "it" ? "Email Marketing" : lang === "es" ? "Email Marketing" : "Email Marketing" },
              { icon: "🎪", title: lang === "de" ? "Events & Aktionen (50+)" : lang === "fr" ? "Événements & Actions (50+)" : lang === "it" ? "Eventi & Azioni (50+)" : lang === "es" ? "Eventos & Acciones (50+)" : "Events & Promotions (50+)" },
              { icon: "💬", title: lang === "de" ? "WhatsApp Bot 24/7" : lang === "fr" ? "WhatsApp Bot 24/7" : lang === "it" ? "WhatsApp Bot 24/7" : lang === "es" ? "WhatsApp Bot 24/7" : "WhatsApp Bot 24/7" },
              { icon: "📱", title: lang === "de" ? "Exklusive Restaurant-App" : lang === "fr" ? "App Exclusive Restaurant" : lang === "it" ? "App Esclusiva Ristorante" : lang === "es" ? "App Exclusiva Restaurante" : "Exclusive Restaurant App" },
              { icon: "🏷️", title: lang === "de" ? "Markenregistrierung" : lang === "fr" ? "Enregistrement de Marque" : lang === "it" ? "Registrazione Marchio" : lang === "es" ? "Registro de Marca" : "Brand Registration" },
              { icon: "🎓", title: lang === "de" ? "Gastro-Akademie" : lang === "fr" ? "Académie Gastro" : lang === "it" ? "Accademia Gastro" : lang === "es" ? "Academia Gastro" : "Gastro Academy" },
              { icon: "📊", title: lang === "de" ? "Finanzkontrolle & Kostensenkung" : lang === "fr" ? "Contrôle financier & Réduction coûts" : lang === "it" ? "Controllo finanziario & Riduzione costi" : lang === "es" ? "Control financiero & Reducción costos" : "Financial Control & Cost Reduction" },
              { icon: "🤝", title: lang === "de" ? "Persönliches Coaching" : lang === "fr" ? "Coaching Personnel" : lang === "it" ? "Coaching Personale" : lang === "es" ? "Coaching Personal" : "Personal Coaching" },
              { icon: "🔧", title: lang === "de" ? "Wartung & Updates (ganzes Jahr)" : lang === "fr" ? "Maintenance & Mises à jour (toute l'année)" : lang === "it" ? "Manutenzione & Aggiornamenti (tutto l'anno)" : lang === "es" ? "Mantenimiento & Actualizaciones (todo el año)" : "Maintenance & Updates (all year)" },
              { icon: "⚡", title: lang === "de" ? "Technischer Support in Echtzeit" : lang === "fr" ? "Support technique en temps réel" : lang === "it" ? "Supporto tecnico in tempo reale" : lang === "es" ? "Soporte técnico en tiempo real" : "Real-time Technical Support" },
              { icon: "🏪", title: lang === "de" ? "Franchise & Expansion" : lang === "fr" ? "Franchise & Expansion" : lang === "it" ? "Franchising & Espansione" : lang === "es" ? "Franquicia & Expansión" : "Franchise & Expansion" },
              { icon: "🏠", title: lang === "de" ? "GASTRO-IMMO: Transformation + Verkauf" : lang === "fr" ? "GASTRO-IMMO: Transformation + Vente" : lang === "it" ? "GASTRO-IMMO: Trasformazione + Vendita" : lang === "es" ? "GASTRO-IMMO: Transformación + Venta" : "GASTRO-IMMO: Transformation + Sale" },
              { icon: "🌐", title: lang === "de" ? "Globales Web-Imperium" : lang === "fr" ? "Empire Web Global" : lang === "it" ? "Impero Web Globale" : lang === "es" ? "Imperio Web Global" : "Global Web Empire" },
              { icon: "🎨", title: lang === "de" ? "Professionelles Grafikdesign" : lang === "fr" ? "Design Graphique Avancé" : lang === "it" ? "Design Grafico Avanzato" : lang === "es" ? "Diseño Gráfico Avanzado" : "Advanced Graphic Design" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl card-premium transition-all hover:border-[#D4AF37]">
                <span className="text-2xl shrink-0">{s.icon}</span>
                <span className="text-sm font-medium text-gray-200">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Mission statement */}
          <div className="rounded-2xl p-8 text-center" style={{ background: "#1A0F00", border: "2px solid #D4AF37" }}>
            <div className="gold-text font-black text-xl mb-6 tracking-widest">
              {lang === "de" ? "DIGITALE TRANSFORMATION IN 365 TAGEN" : lang === "fr" ? "TRANSFORMATION DIGITALE EN 365 JOURS" : lang === "it" ? "TRASFORMAZIONE DIGITALE IN 365 GIORNI" : lang === "es" ? "TRANSFORMACIÓN DIGITAL EN 365 DÍAS" : "DIGITAL TRANSFORMATION IN 365 DAYS"}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              {[
                { icon: "💰", text: lang === "de" ? "Erst helfe ich Ihnen zu SPAREN" : lang === "fr" ? "D'abord je vous aide à ÉCONOMISER" : lang === "it" ? "Prima ti aiuto a RISPARMIARE" : lang === "es" ? "Primero te ayudo a AHORRAR" : "First I help you SAVE" },
                { icon: "📈", text: lang === "de" ? "Dann helfe ich Ihnen mehr zu VERDIENEN" : lang === "fr" ? "Ensuite je vous aide à GAGNER PLUS" : lang === "it" ? "Poi ti aiuto a GUADAGNARE DI PIÙ" : lang === "es" ? "Luego te ayudo a GANAR MÁS" : "Then I help you EARN MORE" },
                { icon: "🤝", text: lang === "de" ? "Sie zahlen aus dem Geld, das ich Ihnen spare — WIN-WIN" : lang === "fr" ? "Vous payez avec l'argent que je vous aide à récupérer — WIN-WIN" : lang === "it" ? "Mi paghi con i soldi che ti aiuto a recuperare — WIN-WIN" : lang === "es" ? "Me pagas del dinero que te ayudo a recuperar — WIN-WIN" : "You pay from the money I help you save — WIN-WIN" },
                { icon: "🛡️", text: lang === "de" ? "Wachstumsgarantie-Zertifikat in weniger als 9 Monaten" : lang === "fr" ? "Certificat de garantie de croissance en moins de 9 mois" : lang === "it" ? "Certificato di garanzia di crescita in meno di 9 mesi" : lang === "es" ? "Certificado de garantía de crecimiento en menos de 9 meses" : "Growth guarantee certificate in less than 9 months" },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#0D0D0D" }}>
                  <span className="text-xl shrink-0">{m.icon}</span>
                  <span className="text-gray-200 text-sm font-medium">{m.text}</span>
                </div>
              ))}
            </div>
            <a
              href="https://wa.link/rdddhh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 gold-gradient text-black font-black text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold"
            >
              <span>📱</span> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* LEARNING SECTION */}
      <section id="learning" className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 text-sm font-bold text-[#D4AF37] border border-[#D4AF37]/40 rounded-full mb-6">
            {lang === "de" ? "Bildung & Wachstum" : lang === "fr" ? "Formation & Croissance" : lang === "it" ? "Formazione & Crescita" : lang === "es" ? "Formación & Crecimiento" : "Education & Growth"}
          </span>
          <h2 className="text-3xl md:text-4xl font-black gold-text mb-4">
            {lang === "de" ? "Persönliches Lernen für Inhaber & Team" : lang === "fr" ? "Apprentissage Personnalisé pour Propriétaires & Équipe" : lang === "it" ? "Apprendimento Personalizzato per Titolari & Team" : lang === "es" ? "Aprendizaje Personalizado para Dueños y Equipo de Trabajo" : "Personalised Learning for Owners & Team"}
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            {lang === "de" ? "Praxiswissen direkt von mir — für Sie und Ihr Team. Gastronomie, digitale Tools, Führung und Wachstum." : lang === "fr" ? "Connaissances pratiques directement de moi — pour vous et votre équipe. Gastronomie, outils digitaux, leadership et croissance." : lang === "it" ? "Conoscenze pratiche direttamente da me — per te e il tuo team. Gastronomia, strumenti digitali, leadership e crescita." : lang === "es" ? "Conocimiento práctico directo de mí — para ti y tu equipo de trabajo. Gastronomía, herramientas digitales, liderazgo y crecimiento." : "Practical knowledge directly from me — for you and your team. Gastronomy, digital tools, leadership and growth."}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: "👨‍🍳", text: lang === "de" ? "Gastronomie & Management" : lang === "fr" ? "Gastronomie & Management" : lang === "it" ? "Gastronomia & Management" : lang === "es" ? "Gastronomía & Gestión" : "Gastronomy & Management" },
              { icon: "📲", text: lang === "de" ? "Digitale Tools & KI" : lang === "fr" ? "Outils Digitaux & IA" : lang === "it" ? "Strumenti Digitali & IA" : lang === "es" ? "Herramientas Digitales & IA" : "Digital Tools & AI" },
              { icon: "💡", text: lang === "de" ? "Leadership & Wachstum" : lang === "fr" ? "Leadership & Croissance" : lang === "it" ? "Leadership & Crescita" : lang === "es" ? "Liderazgo & Crecimiento" : "Leadership & Growth" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-5 rounded-xl card-premium">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-gray-200 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <a
            href="https://aprendeconmigo.abacusai.app/ventas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 gold-gradient text-black font-black text-xl px-12 py-5 rounded-xl hover:opacity-90 transition-opacity pulse-gold"
          >
            🎓 {lang === "de" ? "Jetzt mit mir lernen" : lang === "fr" ? "Apprends avec moi aujourd'hui" : lang === "it" ? "Impara con me oggi" : lang === "es" ? "Aprende Conmigo Hoy" : "Learn With Me Today"}
          </a>
          <p className="text-gray-500 text-xs mt-4">
            {lang === "es" || lang === "de" || lang === "fr" || lang === "it" ? "🇪🇸 Disponible en Español" : "🇪🇸 Available in Spanish"}
          </p>
        </div>
      </section>

      {/* CONSULTORÍA 1A1 */}
      <section id="consultoria" className="py-20 px-4" style={{ background: "#0A0500" }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37] mb-6 pulse-gold" style={{ background: "#1A0F00" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[#D4AF37] font-black text-sm">
                {lang === "de" ? `NUR NOCH ${consultSlots} PLÄTZE` : lang === "fr" ? `PLUS QUE ${consultSlots} PLACES` : lang === "it" ? `SOLO ${consultSlots} POSTI RIMASTI` : lang === "es" ? `SOLO QUEDAN ${consultSlots} CUPOS` : `ONLY ${consultSlots} SPOTS LEFT`}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black gold-text mb-3">
              {lang === "de" ? "BERATUNG 1:1" : lang === "fr" ? "CONSULTATION 1:1" : lang === "it" ? "CONSULENZA 1:1" : lang === "es" ? "CONSULTORÍA 1:1" : "CONSULTATION 1:1"}
            </h2>
            <p className="text-2xl font-black text-white mb-2">
              {lang === "de" ? "WACHSTUMSBERATUNG" : lang === "fr" ? "CONSULTATION DE CROISSANCE" : lang === "it" ? "CONSULENZA DI CRESCITA" : lang === "es" ? "CONSULTORÍA DE CRECIMIENTO" : "GROWTH CONSULTATION"}
            </p>
            <div className="inline-block px-6 py-2 rounded-full gold-gradient text-black font-black text-xl mb-4">
              CHF 999 — CASH
            </div>
            <p className="text-gray-300 max-w-lg mx-auto text-sm leading-relaxed">
              {lang === "de" ? "In 60 Minuten zeige ich Ihnen genau, wo Ihr Betrieb täglich Geld verliert — live, vor Ihren Augen, mit echten Zahlen." : lang === "fr" ? "En 60 minutes je vous montre exactement où votre établissement perd de l'argent chaque jour — en direct, sous vos yeux, avec de vrais chiffres." : lang === "it" ? "In 60 minuti le mostro esattamente dove il suo locale perde soldi ogni giorno — dal vivo, davanti ai suoi occhi, con numeri reali." : lang === "es" ? "En 60 minutos le muestro exactamente dónde su negocio pierde dinero cada día — en vivo, frente a sus ojos, con números reales." : "In 60 minutes I show you exactly where your business loses money every day — live, before your eyes, with real numbers."}
            </p>
          </div>

          {/* Wizard */}
          <div className={`rounded-2xl p-6 md:p-8 transition-all duration-300 ${flashRed ? "ring-4 ring-red-500" : "ring-1 ring-[#D4AF37]/40"}`} style={{ background: "#1A0F00" }}>
            {consultStep === -1 && !consultDone && (
              <div className="text-center">
                <div className="text-7xl mb-6">💰</div>
                <h3 className="text-2xl font-black text-white mb-4">
                  {lang === "de" ? "RENTABILITÄTS-DIAGNOSE" : lang === "fr" ? "DIAGNOSTIC DE RENTABILITÉ" : lang === "it" ? "DIAGNOSI DI REDDITIVITÀ" : lang === "es" ? "DIAGNÓSTICO DE RENTABILIDAD" : "PROFITABILITY DIAGNOSIS"}
                </h3>
                <p className="text-gray-300 mb-3">
                  {lang === "de" ? `${CONSULT_QUESTIONS.length} Fragen · 5 Minuten · Ihr tatsächlicher monatlicher Verlust` : lang === "fr" ? `${CONSULT_QUESTIONS.length} questions · 5 minutes · Votre perte mensuelle réelle` : lang === "it" ? `${CONSULT_QUESTIONS.length} domande · 5 minuti · La sua perdita mensile reale` : lang === "es" ? `${CONSULT_QUESTIONS.length} preguntas · 5 minutos · Su pérdida mensual real` : `${CONSULT_QUESTIONS.length} questions · 5 minutes · Your real monthly loss`}
                </p>
                <p className="text-[#D4AF37] text-sm font-bold mb-8">
                  {lang === "de" ? "Antworten Sie ehrlich. Jedes NEIN kostet Sie echtes Geld." : lang === "fr" ? "Répondez honnêtement. Chaque NON vous coûte de l'argent réel." : lang === "it" ? "Risponda onestamente. Ogni NO le costa soldi reali." : lang === "es" ? "Responda con honestidad. Cada NO le cuesta dinero real." : "Answer honestly. Every NO costs you real money."}
                </p>
                <button
                  onClick={() => { setConsultAnswers([]); setConsultDone(false); setConsultStep(0); }}
                  className="gold-gradient text-black font-black text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold"
                >
                  {lang === "de" ? "DIAGNOSE STARTEN" : lang === "fr" ? "COMMENCER LE DIAGNOSTIC" : lang === "it" ? "INIZIA LA DIAGNOSI" : lang === "es" ? "INICIAR DIAGNÓSTICO" : "START DIAGNOSIS"}
                </button>
              </div>
            )}

            {consultStep >= 0 && !consultDone && (() => {
              const q = CONSULT_QUESTIONS[consultStep];
              const totalLoss = consultAnswers.reduce((acc, ans, idx) => ans !== "yes" ? acc + CONSULT_QUESTIONS[idx].loss : acc, 0);
              const currentBlock = q.block;
              return (
                <div>
                  {/* Progress */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#D4AF37] font-bold text-sm">{consultStep + 1} / {CONSULT_QUESTIONS.length}</span>
                    <span className="text-red-400 font-black text-sm">
                      {lang === "de" ? `Verlust: CHF ${totalLoss.toLocaleString()}` : lang === "fr" ? `Perte: CHF ${totalLoss.toLocaleString()}` : lang === "it" ? `Perdita: CHF ${totalLoss.toLocaleString()}` : lang === "es" ? `Pérdida: CHF ${totalLoss.toLocaleString()}` : `Loss: CHF ${totalLoss.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[#333] mb-5">
                    <div className="h-1 rounded-full bg-[#D4AF37] transition-all" style={{ width: `${((consultStep + 1) / CONSULT_QUESTIONS.length) * 100}%` }} />
                  </div>

                  {/* Block label */}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-black text-black gold-gradient mb-4">
                    {BLOCK_LABELS[currentBlock][lang]}
                  </div>

                  {/* Question */}
                  <h3 className="text-xl font-bold text-white mb-6 leading-snug">{q.q[lang]}</h3>

                  {/* Loss indicator */}
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-xl" style={{ background: "#0D0D0D" }}>
                    <span className="text-red-400">⚠</span>
                    <span className="text-sm text-gray-400">
                      {lang === "de" ? `Bei NEIN: +CHF ${q.loss.toLocaleString()}/Monat verloren` : lang === "fr" ? `Si NON: +CHF ${q.loss.toLocaleString()}/mois perdu` : lang === "it" ? `Se NO: +CHF ${q.loss.toLocaleString()}/mese perso` : lang === "es" ? `Si NO: +CHF ${q.loss.toLocaleString()}/mes perdido` : `If NO: +CHF ${q.loss.toLocaleString()}/month lost`}
                    </span>
                  </div>

                  {/* Answer buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    {(["yes","no","none"] as const).map((ans) => {
                      const labels: Record<string, Record<Lang, string>> = {
                        yes:  { de: "✓ JA", fr: "✓ OUI", es: "✓ SÍ", en: "✓ YES", it: "✓ SÌ" },
                        no:   { de: "✗ NEIN", fr: "✗ NON", es: "✗ NO", en: "✗ NO", it: "✗ NO" },
                        none: { de: "— KEIN", fr: "— AUCUN", es: "— NO TENGO", en: "— NONE", it: "— NESSUNO" },
                      };
                      const isNeg = ans !== "yes";
                      return (
                        <button
                          key={ans}
                          onClick={() => {
                            if (isNeg) {
                              setFlashRed(true);
                              setTimeout(() => setFlashRed(false), 600);
                            }
                            const newAnswers = [...consultAnswers, ans];
                            setConsultAnswers(newAnswers);
                            if (consultStep + 1 >= CONSULT_QUESTIONS.length) {
                              setConsultDone(true);
                              setConsultStep(CONSULT_QUESTIONS.length);
                            } else {
                              setConsultStep(consultStep + 1);
                            }
                          }}
                          className={`py-4 rounded-xl font-black text-sm transition-all ${
                            ans === "yes"
                              ? "bg-green-900/40 border border-green-600 text-green-400 hover:bg-green-800/60"
                              : "bg-red-900/30 border border-red-800/60 text-red-400 hover:bg-red-900/60"
                          }`}
                        >
                          {labels[ans][lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {consultDone && (() => {
              const totalLoss = consultAnswers.reduce((acc, ans, idx) => ans !== "yes" ? acc + CONSULT_QUESTIONS[idx].loss : acc, 0);
              const noCount = consultAnswers.filter(a => a !== "yes").length;
              const pct = Math.round((noCount / CONSULT_QUESTIONS.length) * 100);
              const level = pct >= 70 ? "critical" : pct >= 40 ? "warning" : "ok";
              return (
                <div className="text-center">
                  <div className="text-6xl mb-4">{level === "critical" ? "🚨" : level === "warning" ? "⚡" : "📈"}</div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    {lang === "de" ? "DIAGNOSE ABGESCHLOSSEN" : lang === "fr" ? "DIAGNOSTIC COMPLÉTÉ" : lang === "it" ? "DIAGNOSI COMPLETATA" : lang === "es" ? "DIAGNÓSTICO COMPLETADO" : "DIAGNOSIS COMPLETED"}
                  </h3>

                  {/* Total loss box */}
                  <div className="my-6 p-6 rounded-2xl border-2 border-red-500" style={{ background: "#1A0000" }}>
                    <p className="text-gray-400 text-sm mb-1">
                      {lang === "de" ? "Ihr geschätzter monatlicher Verlust:" : lang === "fr" ? "Votre perte mensuelle estimée:" : lang === "it" ? "La sua perdita mensile stimata:" : lang === "es" ? "Su pérdida mensual estimada:" : "Your estimated monthly loss:"}
                    </p>
                    <p className="text-5xl font-black text-red-400">CHF {totalLoss.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {lang === "de" ? `= CHF ${(totalLoss * 12).toLocaleString()} pro Jahr` : lang === "fr" ? `= CHF ${(totalLoss * 12).toLocaleString()} par an` : lang === "it" ? `= CHF ${(totalLoss * 12).toLocaleString()} all'anno` : lang === "es" ? `= CHF ${(totalLoss * 12).toLocaleString()} por año` : `= CHF ${(totalLoss * 12).toLocaleString()} per year`}
                    </p>
                  </div>

                  {/* Score summary */}
                  <div className="mb-6 p-4 rounded-xl" style={{ background: "#0D0D0D" }}>
                    <p className="text-gray-300 text-sm">
                      {lang === "de" ? `${noCount} von ${CONSULT_QUESTIONS.length} Bereichen verlieren Geld` : lang === "fr" ? `${noCount} sur ${CONSULT_QUESTIONS.length} domaines perdent de l'argent` : lang === "it" ? `${noCount} su ${CONSULT_QUESTIONS.length} aree perdono soldi` : lang === "es" ? `${noCount} de ${CONSULT_QUESTIONS.length} áreas perdiendo dinero` : `${noCount} of ${CONSULT_QUESTIONS.length} areas losing money`}
                    </p>
                    <div className="w-full h-3 rounded-full bg-[#333] mt-2">
                      <div className="h-3 rounded-full bg-red-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-5 rounded-2xl border border-[#D4AF37] mb-6" style={{ background: "#1A0F00" }}>
                    <p className="text-[#D4AF37] font-black text-lg mb-2">
                      {lang === "de" ? "PRIVATE BERATUNG — CHF 999 CASH" : lang === "fr" ? "CONSULTATION PRIVÉE — CHF 999 CASH" : lang === "it" ? "CONSULENZA PRIVATA — CHF 999 CASH" : lang === "es" ? "CONSULTORÍA PRIVADA — CHF 999 CASH" : "PRIVATE CONSULTATION — CHF 999 CASH"}
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                      {lang === "de" ? "60 Minuten · Komplette Analyse · Sofortiger Aktionsplan · Geschenke im Wert von CHF 2.000" : lang === "fr" ? "60 minutes · Analyse complète · Plan d'action immédiat · Cadeaux d'une valeur de CHF 2.000" : lang === "it" ? "60 minuti · Analisi completa · Piano d'azione immediato · Regali del valore di CHF 2.000" : lang === "es" ? "60 minutos · Análisis completo · Plan de acción inmediato · Regalos por valor de CHF 2.000" : "60 minutes · Complete analysis · Immediate action plan · Gifts worth CHF 2.000"}
                    </p>
                    <a
                      href="https://wa.link/rdddhh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 gold-gradient text-black font-black text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold w-full justify-center"
                    >
                      📱 {lang === "de" ? "JETZT BUCHEN — WhatsApp" : lang === "fr" ? "RÉSERVER MAINTENANT — WhatsApp" : lang === "it" ? "PRENOTA ORA — WhatsApp" : lang === "es" ? "RESERVAR AHORA — WhatsApp" : "BOOK NOW — WhatsApp"}
                    </a>
                  </div>

                  <button
                    onClick={() => { setConsultAnswers([]); setConsultDone(false); setConsultStep(-1); }}
                    className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
                  >
                    {lang === "de" ? "Neustart" : lang === "fr" ? "Recommencer" : lang === "it" ? "Ricomincia" : lang === "es" ? "Reiniciar" : "Restart"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-4" style={{ background: "#0D0D0D" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 gold-text">{t.contact.title}</h2>
            <p className="text-gray-400 mb-3">{t.contact.subtitle}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 text-sm pulse-gold" style={{ background: "#1A0F00" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[#D4AF37]">{t.contact.slots.replace("{n}", String(slots))}</span>
            </div>
          </div>
          {formSent ? (
            <div className="text-center p-12 rounded-2xl card-premium">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-[#D4AF37] mb-2">{t.contact.success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl card-premium flex flex-col gap-4">
              {[
                { key: "name", placeholder: t.contact.name },
                { key: "business", placeholder: t.contact.business },
                { key: "city", placeholder: t.contact.city },
                { key: "phone", placeholder: t.contact.phone },
              ].map(({ key, placeholder }) => (
                <input key={key} required value={formData[key as keyof typeof formData]}
                  onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#111] border border-[#333] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white outline-none transition-colors" />
              ))}
              <select value={formData.plan} onChange={e => setFormData(p => ({ ...p, plan: e.target.value }))}
                className="w-full bg-[#111] border border-[#333] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-gray-300 outline-none transition-colors">
                <option value="">{t.contact.plan}</option>
                {t.contact.plans_select.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
              <textarea required rows={4} value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                placeholder={t.contact.message}
                className="w-full bg-[#111] border border-[#333] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white outline-none transition-colors resize-none" />
              <button type="submit" disabled={formLoading}
                className="gold-gradient text-black font-black text-lg py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {formLoading ? "..." : t.contact.submit}
              </button>
            </form>
          )}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">{t.contact.or}</p>
            <a href="https://wa.link/rdddhh" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-lg gold-gradient text-black hover:opacity-90 transition-opacity pulse-gold">
              📱 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t border-[#D4AF37]/20 text-center" style={{ background: "#0A0A0A" }}>
        <div className="gold-text font-black text-xl mb-2">#MYGASTROIA#</div>
        <p className="text-gray-500 text-sm mb-1">{t.footer.tagline}</p>
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Adalberto Cirilo Ramos Alfonso · {t.footer.rights}</p>
      </footer>
    </div>
  );
}
