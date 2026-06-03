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
            {(["diagnose","solution","guarantee","contact"] as const).map(k => (
              <button key={k} onClick={() => scrollTo(k)} className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">{t.nav[k]}</button>
            ))}
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
            {(["diagnose","solution","guarantee","contact"] as const).map(k => (
              <button key={k} onClick={() => scrollTo(k)} className="text-left text-gray-300 hover:text-[#D4AF37]">{t.nav[k]}</button>
            ))}
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
            <a href="https://wa.me/4915123456789" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-600 text-green-400 hover:bg-green-900/20 transition-colors font-medium">
              📱 {t.contact.whatsapp}
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
