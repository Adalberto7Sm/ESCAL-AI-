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
            <p className="text-xs font-black tracking-[0.3em] text-[#D4AF37]/60 mb-2">ESCALERA DE VALOR</p>
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
