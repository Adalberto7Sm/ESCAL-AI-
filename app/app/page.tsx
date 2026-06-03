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
  // BLOQUE 0 — Análisis en tiempo real
  { block: "realtime", q: { de: "Analysieren Sie Ihr Geschäft in Echtzeit?", fr: "Analysez-vous votre business en temps réel?", es: "¿Analizas tu negocio en tiempo real?", en: "Do you analyse your business in real time?", it: "Analizza il suo business in tempo reale?" }, loss: 800 },
  { block: "realtime", q: { de: "Analysieren Sie Ihre Konkurrenz in Echtzeit?", fr: "Analysez-vous votre concurrence en temps réel?", es: "¿Analizas tu competencia en tiempo real?", en: "Do you analyse your competition in real time?", it: "Analizza la sua concorrenza in tempo reale?" }, loss: 600 },
  { block: "realtime", q: { de: "Überprüfen Sie regelmäßig Ihre eigenen Ausgaben?", fr: "Vérifiez-vous régulièrement vos propres dépenses?", es: "¿Revisas tus propios gastos regularmente?", en: "Do you regularly review your own expenses?", it: "Controlla regolarmente le sue spese?" }, loss: 700 },
  { block: "realtime", q: { de: "Kontrollieren Sie täglich den Verbrauch Ihres Teams?", fr: "Contrôlez-vous la consommation de votre équipe chaque jour?", es: "¿Revisas lo que consume tu equipo de trabajo diariamente?", en: "Do you check what your team consumes daily?", it: "Controlla quotidianamente cosa consuma il suo team?" }, loss: 650 },
  { block: "realtime", q: { de: "Überprüfen Sie Ihre Bestände und korrigieren Sie Fehler sofort?", fr: "Vérifiez-vous vos stocks et corrigez-vous les erreurs immédiatement?", es: "¿Revisas tus inventarios y corriges los errores al momento?", en: "Do you check your inventory and fix errors immediately?", it: "Controlla le scorte e corregge gli errori immediatamente?" }, loss: 750 },
  // BLOQUE 1 — Estadísticas
  { block: "stats", q: { de: "Wissen Sie genau, wie viel Sie pro Tag verdienen (brutto und netto)?", fr: "Savez-vous exactement combien vous gagnez par jour (brut et net)?", es: "¿Sabes exactamente cuánto ganas al día (bruto y neto)?", en: "Do you know exactly how much you earn per day (gross and net)?", it: "Sa esattamente quanto guadagna al giorno (lordo e netto)?" }, loss: 900 },
  { block: "stats", q: { de: "Wissen Sie, wie viel Sie pro Woche verdienen (brutto und netto)?", fr: "Savez-vous combien vous gagnez par semaine (brut et net)?", es: "¿Sabes cuánto ganas a la semana (bruto y neto)?", en: "Do you know your weekly earnings (gross and net)?", it: "Sa quanto guadagna a settimana (lordo e netto)?" }, loss: 800 },
  { block: "stats", q: { de: "Wissen Sie, wie viel Sie pro Monat verdienen (brutto und netto)?", fr: "Savez-vous combien vous gagnez par mois (brut et net)?", es: "¿Sabes cuánto ganas al mes (bruto y neto)?", en: "Do you know your monthly earnings (gross and net)?", it: "Sa quanto guadagna al mese (lordo e netto)?" }, loss: 1000 },
  { block: "stats", q: { de: "Wissen Sie, wie viel Sie im Jahr 2025 verdient haben (brutto und netto)?", fr: "Savez-vous combien vous avez gagné en 2025 (brut et net)?", es: "¿Sabes cuánto ganaste en el 2025 (bruto y neto)?", en: "Do you know your 2025 annual earnings (gross and net)?", it: "Sa quanto ha guadagnato nel 2025 (lordo e netto)?" }, loss: 900 },
  { block: "stats", q: { de: "Haben Sie ein System, um jede Woche neue Kunden zu gewinnen?", fr: "Avez-vous un système pour attirer de nouveaux clients chaque semaine?", es: "¿Tienes un sistema activo para captar clientes nuevos cada semana?", en: "Do you have an active system to attract new customers every week?", it: "Ha un sistema attivo per acquisire nuovi clienti ogni settimana?" }, loss: 700 },
  { block: "stats", q: { de: "Haben Sie eine aktive E-Mail-Liste Ihrer Kunden?", fr: "Avez-vous une liste d'e-mails active de vos clients?", es: "¿Tienes una lista de e-mails activa de tus clientes?", en: "Do you have an active email list of your customers?", it: "Ha una lista email attiva dei suoi clienti?" }, loss: 600 },
  { block: "stats", q: { de: "Haben Sie eine Telefon-/WhatsApp-Liste Ihrer Kunden?", fr: "Avez-vous une liste de téléphones/WhatsApp de vos clients?", es: "¿Tienes una lista de teléfonos/WhatsApp de tus clientes?", en: "Do you have a phone/WhatsApp list of your customers?", it: "Ha una lista di telefoni/WhatsApp dei suoi clienti?" }, loss: 550 },
  // BLOQUE 2 — Qué te falta
  { block: "tools", q: { de: "Haben Sie eine digitale Visitenkarte?", fr: "Avez-vous une carte de visite numérique?", es: "¿Tienes una tarjeta de visita digital?", en: "Do you have a digital business card?", it: "Ha un biglietto da visita digitale?" }, loss: 300 },
  { block: "tools", q: { de: "Haben Sie eine Mini-Website?", fr: "Avez-vous un mini site web?", es: "¿Tienes una mini página web?", en: "Do you have a mini website?", it: "Ha un mini sito web?" }, loss: 500 },
  { block: "tools", q: { de: "Haben Sie eine Micro-Website mit virtuellem Mini-Shop für Ihre Angebote?", fr: "Avez-vous un micro site web avec mini boutique virtuelle pour vos offres?", es: "¿Tienes micro página web con mini tienda virtual conectada para tus ofertas?", en: "Do you have a micro website with a connected virtual mini-shop for your offers?", it: "Ha un micro sito web con mini negozio virtuale per le sue offerte?" }, loss: 700 },
  { block: "tools", q: { de: "Haben Sie aktive QR-Codes in Ihrem Betrieb?", fr: "Avez-vous des codes QR actifs dans votre établissement?", es: "¿Tienes códigos QR activos en tu negocio?", en: "Do you have active QR codes in your business?", it: "Ha codici QR attivi nel suo locale?" }, loss: 400 },
  { block: "tools", q: { de: "Haben Sie eine professionelle und aktuelle Website?", fr: "Avez-vous un site web professionnel et à jour?", es: "¿Tienes una página web profesional y actualizada?", en: "Do you have a professional and up-to-date website?", it: "Ha un sito web professionale e aggiornato?" }, loss: 800 },
  { block: "tools", q: { de: "Haben Sie einen Sales Funnel (Verkaufstrichter)?", fr: "Avez-vous un entonnoir de vente (Sales Funnel)?", es: "¿Tienes un embudo de ventas (Sales Funnel)?", en: "Do you have a sales funnel?", it: "Ha un funnel di vendita?" }, loss: 1000 },
  { block: "tools", q: { de: "Haben Sie aktives E-Mail-Marketing?", fr: "Avez-vous un email marketing actif?", es: "¿Tienes email marketing activo?", en: "Do you have active email marketing?", it: "Ha un email marketing attivo?" }, loss: 600 },
  { block: "tools", q: { de: "Haben Sie Gift-Marketing (Geschenk-Marketing)?", fr: "Avez-vous du marketing cadeau (gift marketing)?", es: "¿Tienes marketing de regalo?", en: "Do you have gift marketing?", it: "Ha un marketing regalo?" }, loss: 400 },
  { block: "tools", q: { de: "Haben Sie ein Kundenbindungs-Marketing?", fr: "Avez-vous un marketing de fidélisation client?", es: "¿Tienes marketing de fidelización de clientes?", en: "Do you have customer loyalty marketing?", it: "Ha un marketing di fidelizzazione clienti?" }, loss: 700 },
  { block: "tools", q: { de: "Haben Sie Geschenkgutscheine für Kunden?", fr: "Avez-vous des bons cadeaux pour vos clients?", es: "¿Tienes bonos de regalo para clientes?", en: "Do you have gift vouchers for customers?", it: "Ha buoni regalo per i clienti?" }, loss: 350 },
  { block: "tools", q: { de: "Haben Sie aktive Rabattgutscheine?", fr: "Avez-vous des coupons de réduction actifs?", es: "¿Tienes cupones de descuento activos?", en: "Do you have active discount coupons?", it: "Ha coupon di sconto attivi?" }, loss: 400 },
  { block: "tools", q: { de: "Haben Sie einen automatisierten WhatsApp-ChatBot?", fr: "Avez-vous un ChatBot WhatsApp automatisé?", es: "¿Tienes un ChatBot de WhatsApp automatizado?", en: "Do you have an automated WhatsApp ChatBot?", it: "Ha un ChatBot WhatsApp automatizzato?" }, loss: 650 },
  { block: "tools", q: { de: "Haben Sie mehrsprachige KI-Coaches in Ihrem Betrieb?", fr: "Avez-vous des AI-Coaches multilingues dans votre business?", es: "¿Tienes AI-Coaches multilingüe en tu negocio?", en: "Do you have multilingual AI-Coaches in your business?", it: "Ha AI-Coach multilingua nel suo business?" }, loss: 500 },
  { block: "tools", q: { de: "Haben Sie einen KI-Virtual-Assistenten?", fr: "Avez-vous un assistant virtuel IA?", es: "¿Tienes un asistente virtual IA?", en: "Do you have a virtual AI assistant?", it: "Ha un assistente virtuale IA?" }, loss: 550 },
  { block: "tools", q: { de: "Haben Sie einen KI-Agenten, der auf Ihr Geschäftsmodell zugeschnitten ist?", fr: "Avez-vous un agent IA personnalisé à votre modèle d'entreprise?", es: "¿Tienes un agente IA personalizado a tu modelo de negocio?", en: "Do you have an AI agent personalised to your business model?", it: "Ha un agente IA personalizzato al suo modello di business?" }, loss: 800 },
  // BLOQUE 3 — Uso de IA
  { block: "ai", q: { de: "Arbeiten Sie täglich mit ChatGPT?", fr: "Travaillez-vous avec ChatGPT tous les jours?", es: "¿Trabajas con ChatGPT todos los días?", en: "Do you work with ChatGPT every day?", it: "Lavora con ChatGPT tutti i giorni?" }, loss: 700 },
  { block: "ai", q: { de: "Arbeitet Ihr Team täglich mit ChatGPT?", fr: "Votre équipe travaille-t-elle avec ChatGPT tous les jours?", es: "¿Tu equipo trabaja con ChatGPT todos los días?", en: "Does your team work with ChatGPT every day?", it: "Il suo team lavora con ChatGPT tutti i giorni?" }, loss: 600 },
  { block: "ai", q: { de: "Ist Ihr Geschäftsmodell für 2026 aktualisiert?", fr: "Votre modèle d'entreprise est-il mis à jour pour 2026?", es: "¿Tu modelo de negocio está actualizado al 2026?", en: "Is your business model updated for 2026?", it: "Il suo modello di business è aggiornato al 2026?" }, loss: 800 },
  { block: "ai", q: { de: "Ist Ihr Betrieb digitalisiert?", fr: "Votre établissement est-il numérisé?", es: "¿Tu negocio está digitalizado?", en: "Is your business digitalised?", it: "Il suo locale è digitalizzato?" }, loss: 900 },
  { block: "ai", q: { de: "Haben Sie heute aktive Automatisierungen in Ihrem Betrieb?", fr: "Avez-vous des automatisations actives dans votre business aujourd'hui?", es: "¿Tienes automatizaciones activas en tu negocio hoy?", en: "Do you have active automations in your business today?", it: "Ha automazioni attive nel suo business oggi?" }, loss: 750 },
  { block: "ai", q: { de: "Verwenden Sie heute KI-Tools in Ihrem Betrieb?", fr: "Utilisez-vous des outils d'IA dans votre business aujourd'hui?", es: "¿Estás usando herramientas de IA en tu negocio hoy?", en: "Are you using AI tools in your business today?", it: "Sta usando strumenti IA nel suo business oggi?" }, loss: 700 },
  // BLOQUE 4 — Actividades
  { block: "events", q: { de: "Machen Sie jede Woche Verkostungen für Ihre Kunden?", fr: "Organisez-vous des dégustations pour vos clients toutes les semaines?", es: "¿Haces degustaciones para tus clientes todas las semanas?", en: "Do you do tastings for your customers every week?", it: "Fa degustazioni per i suoi clienti ogni settimana?" }, loss: 500 },
  { block: "events", q: { de: "Bieten Sie Ihren Kunden Gourmet-Erlebnisse an?", fr: "Organisez-vous des expériences gastronomiques pour vos clients?", es: "¿Haces experiencias gourmet para tus clientes?", en: "Do you create gourmet experiences for your customers?", it: "Crea esperienze gourmet per i suoi clienti?" }, loss: 600 },
  { block: "events", q: { de: "Organisieren Sie wöchentliche Events in Ihrem Betrieb?", fr: "Organisez-vous des événements hebdomadaires dans votre établissement?", es: "¿Organizas eventos semanales en tu negocio?", en: "Do you organise weekly events in your business?", it: "Organizza eventi settimanali nel suo locale?" }, loss: 700 },
  { block: "events", q: { de: "Haben Sie Ihr eigenes Netzwerk, das jede Woche Zusatzeinnahmen generiert?", fr: "Avez-vous votre propre réseau qui génère des revenus supplémentaires chaque semaine?", es: "¿Tienes tu propio Networking que genera ingresos extra cada semana?", en: "Do you have your own networking system that generates extra income every week?", it: "Ha il suo networking personale che genera reddito extra ogni settimana?" }, loss: 800 },
  { block: "events", q: { de: "Veranstalten Sie Kinderaktivitäten und -events in Ihrem Betrieb?", fr: "Organisez-vous des activités et événements pour enfants dans votre établissement?", es: "¿Creas actividades y eventos infantiles en tu negocio?", en: "Do you create children's activities and events in your business?", it: "Crea attività ed eventi per bambini nel suo locale?" }, loss: 600 },
  { block: "events", q: { de: "Organisieren Sie jeden Monat kulturelle Aktivitäten?", fr: "Organisez-vous des activités culturelles chaque mois?", es: "¿Organizas actividades culturales todos los meses?", en: "Do you organise cultural activities every month?", it: "Organizza attività culturali ogni mese?" }, loss: 500 },
  // BLOQUE 5 — Escalabilidad / Publicidad
  { block: "scale", q: { de: "Verwenden Sie Wertleitern, um Ihr Geschäft zu wachsen und zu skalieren?", fr: "Utilisez-vous des échelles de valeur pour faire croître et scaler votre business?", es: "¿Usas escaleras de valor para crecer y escalar tu negocio?", en: "Do you use value ladders to grow and scale your business?", it: "Usa scale di valore per crescere e scalare il suo business?" }, loss: 900 },
  { block: "scale", q: { de: "Bezahlen Sie heute für digitale Werbung?", fr: "Payez-vous pour de la publicité numérique aujourd'hui?", es: "¿Estás pagando por publicidad digital hoy?", en: "Are you paying for digital advertising today?", it: "Sta pagando per pubblicità digitale oggi?" }, loss: 700 },
  { block: "scale", q: { de: "Veröffentlichen Sie täglich Inhalte in sozialen Medien?", fr: "Publiez-vous du contenu sur les réseaux sociaux tous les jours?", es: "¿Publicas contenido en redes sociales todos los días?", en: "Do you publish content on social media every day?", it: "Pubblica contenuti sui social media ogni giorno?" }, loss: 600 },
  { block: "scale", q: { de: "Haben Sie jemanden, der Ihre sozialen Medien professionell verwaltet?", fr: "Avez-vous quelqu'un qui gère vos réseaux sociaux professionnellement?", es: "¿Tienes a alguien gestionando tus redes sociales profesionalmente?", en: "Do you have someone managing your social media professionally?", it: "Ha qualcuno che gestisce i suoi social media professionalmente?" }, loss: 650 },
  { block: "scale", q: { de: "Aktualisieren Sie Ihre Speisekarte regelmäßig, um sie an den Markt anzupassen?", fr: "Mettez-vous à jour votre menu régulièrement pour l'adapter au marché?", es: "¿Actualizas tu menú regularmente para adaptarlo al mercado?", en: "Do you regularly update your menu to adapt to the market?", it: "Aggiorna regolarmente il suo menu per adattarlo al mercato?" }, loss: 500 },
  { block: "scale", q: { de: "Halten Sie Ihr Geschäft heute für rentabel?", fr: "Considérez-vous que votre business est rentable aujourd'hui?", es: "¿Consideras que tu negocio es rentable hoy?", en: "Do you consider your business profitable today?", it: "Considera il suo business redditizio oggi?" }, loss: 1200 },
  { block: "scale", q: { de: "Sind Sie bereit, Ihr Geschäft wachsen zu lassen?", fr: "Êtes-vous prêt(e) à faire croître votre business?", es: "¿Estás dispuesto a hacer crecer tu negocio?", en: "Are you willing to grow your business?", it: "È disposto a far crescere il suo business?" }, loss: 1000 },
  { block: "scale", q: { de: "Wissen Sie, was Sie tun würden, wenn Ihr Betrieb nicht rentabel wäre?", fr: "Savez-vous ce que vous feriez si votre business n'était pas rentable?", es: "¿Sabes qué harías si tu negocio no fuera rentable?", en: "Do you know what you would do if your business was not profitable?", it: "Sa cosa farebbe se il suo business non fosse redditizio?" }, loss: 800 },
  { block: "scale", q: { de: "Würden Sie professionelle Hilfe in Anspruch nehmen, um Ihr Geschäft zu retten?", fr: "Feriez-vous appel à une aide professionnelle pour sauver votre business?", es: "¿Pedirías ayuda profesional para salvar tu negocio?", en: "Would you seek professional help to save your business?", it: "Chiederebbe aiuto professionale per salvare il suo business?" }, loss: 700 },
  { block: "scale", q: { de: "Sind Sie bereit zu investieren, um Ihren Umsatz zu verdoppeln?", fr: "Êtes-vous prêt(e) à investir pour doubler vos ventes?", es: "¿Estás dispuesto a invertir para duplicar tus ventas?", en: "Are you willing to invest to double your sales?", it: "È disposto a investire per raddoppiare le sue vendite?" }, loss: 900 },
  { block: "scale", q: { de: "Wissen Sie, dass Sie ohne zu investieren Ihren Umsatz nie verdoppeln werden?", fr: "Savez-vous que sans investir vous ne doublerez jamais vos ventes?", es: "¿Sabes que sin invertir nunca duplicarás tus ventas?", en: "Do you know that without investing you will never double your sales?", it: "Sa che senza investire non raddoppierà mai le sue vendite?" }, loss: 800 },
  { block: "scale", q: { de: "Nutzen Sie täglich KI, um Ihren Umsatz zu verdoppeln?", fr: "Utilisez-vous l'IA tous les jours pour doubler vos ventes?", es: "¿Usas la IA todos los días para duplicar tus ventas?", en: "Do you use AI every day to double your sales?", it: "Usa l'IA tutti i giorni per raddoppiare le sue vendite?" }, loss: 750 },
];

const BLOCK_LABELS: Record<string, Record<Lang, string>> = {
  realtime: { de: "🔍 ECHTZEIT-ANALYSE", fr: "🔍 ANALYSE EN TEMPS RÉEL", es: "🔍 ANÁLISIS EN TIEMPO REAL", en: "🔍 REAL-TIME ANALYSIS", it: "🔍 ANALISI IN TEMPO REALE" },
  stats:    { de: "📊 STATISTIKEN", fr: "📊 STATISTIQUES", es: "📊 ESTADÍSTICAS", en: "📊 STATISTICS", it: "📊 STATISTICHE" },
  tools:    { de: "🛠️ WAS FEHLT IHNEN?", fr: "🛠️ QU'EST-CE QUI VOUS MANQUE?", es: "🛠️ ¿QUÉ TE FALTA?", en: "🛠️ WHAT ARE YOU MISSING?", it: "🛠️ COSA LE MANCA?" },
  ai:       { de: "🤖 KI & AUTOMATISIERUNG", fr: "🤖 IA & AUTOMATISATION", es: "🤖 USO DE IA", en: "🤖 AI USAGE", it: "🤖 USO DELL'IA" },
  events:   { de: "🎪 AKTIVITÄTEN", fr: "🎪 ACTIVITÉS", es: "🎪 ACTIVIDADES", en: "🎪 ACTIVITIES", it: "🎪 ATTIVITÀ" },
  scale:    { de: "🚀 SKALIERBARKEIT & WERBUNG", fr: "🚀 SCALABILITÉ & PUBLICITÉ", es: "🚀 ESCALABILIDAD & PUBLICIDAD", en: "🚀 SCALABILITY & ADVERTISING", it: "🚀 SCALABILITÀ & PUBBLICITÀ" },
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
                <div className="text-7xl mb-4">💰</div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {lang === "de" ? "CONSULTORÍA FÜR IHREN BETRIEB" : lang === "fr" ? "CONSULTATION POUR VOTRE BUSINESS" : lang === "it" ? "CONSULENZA PER IL SUO BUSINESS" : lang === "es" ? "CONSULTORÍA PARA TU NEGOCIO" : "CONSULTATION FOR YOUR BUSINESS"}
                </h3>
                <p className="text-[#D4AF37] font-black text-sm tracking-widest mb-4">
                  {lang === "de" ? "HIER · JETZT · IN ECHTZEIT ANALYSIERE ICH IHR GESCHÄFT" : lang === "fr" ? "ICI · MAINTENANT · EN TEMPS RÉEL J'ANALYSE VOTRE BUSINESS" : lang === "it" ? "QUI · ORA · IN TEMPO REALE ANALIZZO IL SUO BUSINESS" : lang === "es" ? "AQUÍ · AHORA · EN TIEMPO REAL TE ENSEÑO A ANALIZAR TU NEGOCIO" : "HERE · NOW · IN REAL TIME I ANALYSE YOUR BUSINESS"}
                </p>
                <p className="text-gray-300 mb-2 text-sm">
                  {lang === "de" ? `${CONSULT_QUESTIONS.length} Fragen · 10 Minuten · Ihr tatsächlicher monatlicher Verlust` : lang === "fr" ? `${CONSULT_QUESTIONS.length} questions · 10 minutes · Votre perte mensuelle réelle` : lang === "it" ? `${CONSULT_QUESTIONS.length} domande · 10 minuti · La sua perdita mensile reale` : lang === "es" ? `${CONSULT_QUESTIONS.length} preguntas · 10 minutos · Tu pérdida mensual real` : `${CONSULT_QUESTIONS.length} questions · 10 minutes · Your real monthly loss`}
                </p>
                <p className="text-red-400 text-sm font-black mb-6 p-3 rounded-xl" style={{ background: "#1A0000" }}>
                  {lang === "de" ? "⚠ Antworten Sie ehrlich. Jedes NEIN bedeutet echtes verlorenes Geld." : lang === "fr" ? "⚠ Répondez honnêtement. Chaque NON signifie de l'argent réellement perdu." : lang === "it" ? "⚠ Risponda onestamente. Ogni NO significa soldi realmente persi." : lang === "es" ? "⚠ Responde con honestidad. Cada NO significa dinero real que estás perdiendo." : "⚠ Answer honestly. Every NO means real money being lost."}
                </p>
                <button
                  onClick={() => { setConsultAnswers([]); setConsultDone(false); setConsultStep(0); }}
                  className="gold-gradient text-black font-black text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold"
                >
                  {lang === "de" ? "CONSULTORÍA STARTEN" : lang === "fr" ? "COMMENCER LA CONSULTATION" : lang === "it" ? "INIZIA LA CONSULENZA" : lang === "es" ? "INICIAR CONSULTORÍA" : "START CONSULTATION"}
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
                    {lang === "de" ? "CONSULTORÍA ABGESCHLOSSEN" : lang === "fr" ? "CONSULTATION TERMINÉE" : lang === "it" ? "CONSULENZA COMPLETATA" : lang === "es" ? "CONSULTORÍA COMPLETADA" : "CONSULTATION COMPLETED"}
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

      {/* POR QUÉ CONTRATARME */}
      <section className="py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 text-sm font-bold text-[#D4AF37] border border-[#D4AF37]/40 rounded-full mb-4">
              {lang === "de" ? "Der Experte" : lang === "fr" ? "L'Expert" : lang === "it" ? "L'Esperto" : lang === "es" ? "El Experto" : "The Expert"}
            </span>
            <h2 className="text-3xl md:text-4xl font-black gold-text mb-3">
              {lang === "de" ? "WARUM SIE MICH BEAUFTRAGEN SOLLTEN" : lang === "fr" ? "POURQUOI VOUS DEVRIEZ ME CHOISIR" : lang === "it" ? "PERCHÉ DOVREBBE SCEGLIERMI" : lang === "es" ? "¿POR QUÉ LOS DUEÑOS DE NEGOCIOS DEBEN CONTRATARME?" : "WHY BUSINESS OWNERS SHOULD HIRE ME"}
            </h2>
          </div>

          {/* Bio card */}
          <div className="rounded-2xl p-8 mb-10 card-premium border-[#D4AF37]/60" style={{ borderWidth: 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-2xl font-black text-black shrink-0">A</div>
              <div>
                <p className="font-black text-[#D4AF37] text-lg">Adalberto Cirilo Ramos Alfonso</p>
                <p className="text-gray-400 text-sm">
                  {lang === "de" ? "Gastronomieberater & KI-Experte · Basel" : lang === "fr" ? "Consultant Gastronomique & Expert IA · Bâle" : lang === "it" ? "Consulente Gastronomico & Esperto IA · Basilea" : lang === "es" ? "Consultor Gastronómico & Asesor IA · Basel" : "Gastronomy Consultant & AI Advisor · Basel"}
                </p>
              </div>
            </div>
            <div className="text-gray-200 text-sm leading-relaxed space-y-4">
              <p>Soy un profesional multidisciplinario con certificaciones avanzadas (en español y en alemán) en Marketing, Tráfico Web, SEO Local, Gestión de Redes Sociales, Copywriting, redacción de ofertas, cartas de ventas y presentaciones vendedoras.</p>
              <p>Soy desarrollador y diseñador web/gráfico, optimizador y posicionador SEO, redactor de contenido para plataformas digitales y experto en Consultoría Gastronómica y Asesoría en Inteligencia Artificial.</p>
              <p>Estoy especializado en el desarrollo de aplicaciones con IA diseñadas específicamente para optimizar la rentabilidad del sector HORECA. Vivo en Alemania desde 1984 y me mantengo activo en la gastronomía desde 1996. Además, soy organizador de eventos afro-latinoamericanos desde 1997.</p>
              <p className="text-[#D4AF37] font-black">FUI GERENTE Y DUEÑO DE MIS PROPIOS NEGOCIOS: CATERING, DELIVERY, BARES, IMBISS Y UNA DISCOTECA. ¡SÉ LO QUE ES SER UN DUEÑO DE NEGOCIO!</p>
              <p>Gané dinero, perdí dinero, cometí errores y logré grandes aciertos. Entendí que debía dominar el marketing, la inteligencia artificial y las nuevas tecnologías para no depender de nadie. Lo aprendí, lo apliqué y hoy soy consultor porque poseo lo que a la mayoría de los dueños de negocios les falta.</p>
              <p>Soy consultor gastronómico y asesor de IA: sé cómo ayudarte. Mi misión es fusionar la hospitalidad tradicional con la vanguardia tecnológica para transformar establecimientos estancados en negocios de alto rendimiento.</p>
              <div className="mt-4 p-4 rounded-xl" style={{ background: "#1A0F00" }}>
                <p className="text-[#D4AF37] font-black">PRIMERO TE AYUDO A ECONOMIZAR Y DESPUÉS TE AYUDO A GANAR MÁS DINERO TODOS LOS DÍAS. ESA ES MI META.</p>
                <p className="text-gray-300 text-sm mt-2">📱 WhatsApp directo: <span className="text-[#D4AF37] font-bold">+4915111115353</span></p>
              </div>
            </div>
          </div>

          {/* Ventajas y beneficios */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: "🏆", title: lang === "de" ? "30+ Jahre Gastronomie-Erfahrung" : lang === "fr" ? "30+ ans d'expérience en gastronomie" : lang === "it" ? "30+ anni di esperienza in gastronomia" : lang === "es" ? "30+ años de experiencia en gastronomía" : "30+ years of gastronomy experience",
                desc: lang === "de" ? "Seit 1996 aktiv in der Gastronomie. Ich weiß, wie ein Betrieb von innen funktioniert." : lang === "fr" ? "Actif en gastronomie depuis 1996. Je sais comment fonctionne un établissement de l'intérieur." : lang === "it" ? "Attivo nella gastronomia dal 1996. So come funziona un locale dall'interno." : lang === "es" ? "Activo en gastronomía desde 1996. Sé cómo funciona un negocio por dentro." : "Active in gastronomy since 1996. I know how a business works from the inside." },
              { icon: "💼", title: lang === "de" ? "Selbst Unternehmer gewesen" : lang === "fr" ? "Ancien entrepreneur" : lang === "it" ? "Ex imprenditore" : lang === "es" ? "Fui dueño de mis propios negocios" : "Former business owner",
                desc: lang === "de" ? "Catering, Bars, Imbiss, Diskothek — ich habe alle Fehler gemacht und daraus gelernt." : lang === "fr" ? "Catering, bars, Imbiss, discothèque — j'ai fait toutes les erreurs et j'en ai appris." : lang === "it" ? "Catering, bar, Imbiss, discoteca — ho commesso tutti gli errori e ne ho imparato." : lang === "es" ? "Catering, bares, Imbiss, discoteca — cometí todos los errores y aprendí de ellos." : "Catering, bars, Imbiss, nightclub — I made all the mistakes and learnt from them." },
              { icon: "🤖", title: lang === "de" ? "KI-Experte für den HORECA-Sektor" : lang === "fr" ? "Expert IA pour le secteur HORECA" : lang === "it" ? "Esperto IA per il settore HORECA" : lang === "es" ? "Experto en IA para el sector HORECA" : "AI expert for the HORECA sector",
                desc: lang === "de" ? "Spezialisiert auf KI-Anwendungen, die speziell für Gastronomie-Betriebe entwickelt wurden." : lang === "fr" ? "Spécialisé dans les applications IA développées spécifiquement pour les établissements HoReCa." : lang === "it" ? "Specializzato in applicazioni IA sviluppate specificamente per la ristorazione." : lang === "es" ? "Especializado en aplicaciones de IA diseñadas específicamente para el sector gastronómico." : "Specialised in AI applications designed specifically for gastronomy businesses." },
              { icon: "🇩🇪", title: lang === "de" ? "41 Jahre Deutschland — zweisprachig" : lang === "fr" ? "41 ans en Allemagne — bilingue" : lang === "it" ? "41 anni in Germania — bilingue" : lang === "es" ? "41 años en Alemania — bilingüe" : "41 years in Germany — bilingual",
                desc: lang === "de" ? "Zertifizierungen auf Deutsch und Spanisch. Ich verstehe den Schweizer und deutschen Markt." : lang === "fr" ? "Certifications en allemand et en espagnol. Je comprends le marché suisse et allemand." : lang === "it" ? "Certificazioni in tedesco e spagnolo. Capisce il mercato svizzero e tedesco." : lang === "es" ? "Certificaciones en alemán y español. Entiendo el mercado suizo y alemán." : "Certifications in German and Spanish. I understand the Swiss and German market." },
              { icon: "🚀", title: lang === "de" ? "Keine Agentur — ich bin der Experte" : lang === "fr" ? "Pas une agence — je suis l'expert" : lang === "it" ? "Non un'agenzia — sono l'esperto" : lang === "es" ? "No soy agencia — soy el experto" : "Not an agency — I am the expert",
                desc: lang === "de" ? "Sie arbeiten direkt mit mir. Keine Zwischenhändler. Volle Verantwortung und persönliches Engagement." : lang === "fr" ? "Vous travaillez directement avec moi. Pas d'intermédiaires. Pleine responsabilité et engagement personnel." : lang === "it" ? "Lavora direttamente con me. Nessun intermediario. Piena responsabilità e impegno personale." : lang === "es" ? "Trabajas directamente conmigo. Sin intermediarios. Plena responsabilidad y compromiso personal." : "You work directly with me. No middlemen. Full responsibility and personal commitment." },
              { icon: "📈", title: lang === "de" ? "WIN-WIN: Erst sparen, dann verdienen" : lang === "fr" ? "WIN-WIN: D'abord économiser, puis gagner" : lang === "it" ? "WIN-WIN: Prima risparmiare, poi guadagnare" : lang === "es" ? "WIN-WIN: Primero ahorrar, luego ganar" : "WIN-WIN: First save, then earn",
                desc: lang === "de" ? "Sie zahlen aus dem Geld, das ich Ihnen spare. Wenn ich das Ziel nicht erreiche — arbeite ich kostenlos weiter." : lang === "fr" ? "Vous payez avec l'argent que je vous aide à économiser. Si je n'atteins pas l'objectif — je continue à travailler gratuitement." : lang === "it" ? "Mi paga con i soldi che la aiuto a risparmiare. Se non raggiungo l'obiettivo — continuo a lavorare gratuitamente." : lang === "es" ? "Me pagas del dinero que te ayudo a ahorrar. Si no alcanzo el objetivo — sigo trabajando gratis." : "You pay from the money I help you save. If I don't reach the target — I keep working for free." },
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl card-premium hover:border-[#D4AF37] transition-all">
                <span className="text-2xl shrink-0">{v.icon}</span>
                <div>
                  <p className="font-black text-[#D4AF37] mb-1 text-sm">{v.title}</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA hacia el formulario */}
          <div className="text-center p-8 rounded-2xl" style={{ background: "#1A0F00", border: "2px solid #D4AF37" }}>
            <p className="text-2xl font-black text-white mb-2">
              {lang === "de" ? "BEAUFTRAGEN SIE MICH JETZT" : lang === "fr" ? "ENGAGEZ-MOI MAINTENANT" : lang === "it" ? "ASSUMI I MIEI SERVIZI ORA" : lang === "es" ? "CONTRATA MIS SERVICIOS ABAJO" : "HIRE MY SERVICES BELOW"}
            </p>
            <p className="text-gray-300 text-sm mb-6">
              {lang === "de" ? "Das Formular befindet sich direkt darunter — füllen Sie es aus und ich melde mich innerhalb von 24 Stunden." : lang === "fr" ? "Le formulaire se trouve juste en dessous — remplissez-le et je vous réponds dans les 24 heures." : lang === "it" ? "Il modulo si trova proprio sotto — compilatelo e mi farò vivo entro 24 ore." : lang === "es" ? "El formulario está justo abajo — complétalo y te respondo en menos de 24 horas." : "The form is right below — fill it in and I will get back to you within 24 hours."}
            </p>
            <button onClick={() => scrollTo("contact")} className="gold-gradient text-black font-black text-xl px-12 py-4 rounded-xl hover:opacity-90 transition-opacity pulse-gold">
              {lang === "de" ? "⬇ ZUM FORMULAR" : lang === "fr" ? "⬇ VERS LE FORMULAIRE" : lang === "it" ? "⬇ AL MODULO" : lang === "es" ? "⬇ IR AL FORMULARIO" : "⬇ GO TO FORM"}
            </button>
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
