const NEWS_API_URL = "https://newsapiproxy.carlosrojasgomariz.workers.dev/";
const GEMINI_API_URL = "https://cold-shark-87.crojasgit.deno.net/";
const ADMIN_PASSWORD = "12345";

let noticias = [];
let esAdmin = false;
const TOTAL = 18;
const VISIBLES = 5;

// Cooldown entre peticiones (en milisegundos)
const COOLDOWN_MS = 2000;
let ultimaPeticion = 0;

// Cola para las peticiones de resumen
const colaResumenes = [];
let procesandoCola = false;

// Fecha automática
document.getElementById('fecha').textContent = new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
});

// === Frases del año ===
const frasesDelAno = [
      { texto: `Start each day with the intention of taking one step forward, no matter how small.`, autor: 'Anonymous' },
      { texto: `Curiosity is the spark that ignites any discovery.`, autor: 'Anonymous' },
      { texto: `Don't confuse movement with progress; act with purpose.`, autor: 'Anonymous' },
      { texto: `Sometimes the best plan is to creatively adapt to the unexpected.`, autor: 'Anonymous' },
      { texto: `Learning something new every day is investing in your freedom.`, autor: 'Anonymous' },
      { texto: `Ideas are worth little without the courage to put them into practice.`, autor: 'Anonymous' },
      { texto: `Listen for more questions than answers, and you will grow.`, autor: 'Anonymous' },
      { texto: `Consistency beats talent when talent doesn't work.`, autor: 'Anonymous' },
      { texto: `A well-analyzed mistake is the seed of improvement.`, autor: 'Anonymous' },
      { texto: `Do what is necessary today to thank yourself tomorrow.`, autor: 'Anonymous' },
      { texto: `Technology amplifies intention: put it to the service of what is useful.`, autor: 'Anonymous' },
      { texto: `Don't underestimate the power of a well-utilized break.`, autor: 'Anonymous' },
      { texto: `Creativity is born when you accept limits and play with them.`, autor: 'Anonymous' },
      { texto: `Ask for feedback and act: improvement does not happen by chance.`, autor: 'Anonymous' },
      { texto: `The greatest solutions are often the simplest ones.`, autor: 'Anonymous' },
      { texto: `If you hesitate between two paths, choose the one that teaches you the most.`, autor: 'Anonymous' },
      { texto: `Active patience is building without seeing the immediate result.`, autor: 'Anonymous' },
      { texto: `Share what you know; to teach is to learn twice.`, autor: 'Anonymous' },
      { texto: `Today's small victories fuel tomorrow's great triumphs.`, autor: 'Anonymous' },
      { texto: `Accept useful criticism; reject that which limits without foundation.`, autor: 'Anonymous' },
      { texto: `Responsibility begins with fulfilling what you say you will do.`, autor: 'Anonymous' },
      { texto: `Your attention is a scarce resource: invest it in what matters.`, autor: 'Anonymous' },
      { texto: `Active optimism seeks solutions, not excuses.`, autor: 'Anonymous' },
      { texto: `When you raise the bar, new capabilities will appear.`, autor: 'Anonymous' },
      { texto: `Nurture relationships; they are the infrastructure of well-being.`, autor: 'Anonymous' },
      { texto: `Resolve today what drains your energy so you can create tomorrow.`, autor: 'Anonymous' },
      { texto: `The habit of asking "why?" makes you unique and better informed.`, autor: 'Anonymous' },
      { texto: `The essence of learning is changing your mind when there are reasons to.`, autor: 'Anonymous' },
      { texto: `Calculated risk opens doors; inaction closes them.`, autor: 'Anonymous' },
      { texto: `You are not seeking perfection, you are seeking progress that is sustained over time.`, autor: 'Anonymous' },
      { texto: `Discipline is not punishment; it is the structure of freedom.`, autor: 'Anonymous' },
      { texto: `Being effective means saying 'no' to what distracts you.`, autor: 'Anonymous' },
      { texto: `Respect for others begins with respect for your own boundaries.`, autor: 'Anonymous' },
      { texto: `Audacity often only requires taking the first step.`, autor: 'Anonymous' },
      { texto: `Mindfulness turns the ordinary into an experience.`, autor: 'Anonymous' },
      { texto: `When you fail, collect data, not blame.`, autor: 'Anonymous' },
      { texto: `Gratitude transforms what we have into enough.`, autor: 'Anonymous' },
      { texto: `Less noise, more meaningful work.`, autor: 'Anonymous' },
      { texto: `Don't wait for permission to improve something that depends on you.`, autor: 'Anonymous' },
      { texto: `A good question is worth more than a quick answer.`, autor: 'Anonymous' },
      { texto: `Intellectual impartiality is the ground for valuable ideas.`, autor: 'Anonymous' },
      { texto: `What seems difficult today will be commonplace tomorrow if you persist.`, autor: 'Anonymous' },
      { texto: `Cultivate wonder; it is a source of continuous motivation.`, autor: 'Anonymous' },
      { texto: `Clarity is an act of generosity toward others.`, autor: 'Anonymous' },
      { texto: `Well-executed discussions lead to real actions.`, autor: 'Anonymous' },
      { texto: `Humility does not deny capabilities; it allows for more learning.`, autor: 'Anonymous' },
      { texto: `Transform complaints into problems to be solved.`, autor: 'Anonymous' },
      { texto: `Time is the most honest judge of your priorities.`, autor: 'Anonymous' },
      { texto: `Don't confuse speed with direction.`, autor: 'Anonymous' },
      { texto: `The essential is rarely noisy; observe it carefully.`, autor: 'Anonymous' },
      { texto: `Allow yourself to make mistakes, but don't allow yourself not to learn.`, autor: 'Anonymous' },
      { texto: `Creativity is fueled by curiosity and patience.`, autor: 'Anonymous' },
      { texto: `Coherence between word and deed is long-term reputation.`, autor: 'Anonymous' },
      { texto: `If you don't know where to start, start by tidying up.`, autor: 'Anonymous' },
      { texto: `Good design solves problems and simplifies lives.`, autor: 'Anonymous' },
      { texto: `Reinvent your failures as useful information.`, autor: 'Anonymous' },
      { texto: `Intellectual humility is the foundation of continuous learning.`, autor: 'Anonymous' },
      { texto: `The best question is often, "What problem am I solving?"`, autor: 'Anonymous' },
      { texto: `Build habits that bring you closer to who you want to be.`, autor: 'Anonymous' },
      { texto: `Don't compare yourself to the picture at the summit; everyone has their own path.`, autor: 'Anonymous' },
      { texto: `Take care of your environment: it affects your productivity and your mood.`, autor: 'Anonymous' },
      { texto: `Consistency multiplies talent.`, autor: 'Anonymous' },
      { texto: `Give time: it is the most valuable resource you can give.`, autor: 'Anonymous' },
      { texto: `Responsibility is not heavy if you share it with clarity.`, autor: 'Anonymous' },
      { texto: `Sow curiosity and you will reap innovation.`, autor: 'Anonymous' },
      { texto: `Success often comes to those who solve what others avoid.`, autor: 'Anonymous' },
      { texto: `Learn to rest without guilt; your performance will thank you.`, autor: 'Anonymous' },
      { texto: `What you can sustain consistently works best.`, autor: 'Anonymous' },
      { texto: `Great ideas need time to mature.`, autor: 'Anonymous' },
      { texto: `Simplicity is not trivial; it requires work and judgment.`, autor: 'Anonymous' },
      { texto: `Don't let fear decide for you; act with good judgment.`, autor: 'Anonymous' },
      { texto: `Efficacy is doing what is necessary; efficiency is doing it well.`, autor: 'Anonymous' },
      { texto: `Nurture your curiosity as if it were a rare plant.`, autor: 'Anonymous' },
      { texto: `Every day offers an opportunity to correct course.`, autor: 'Anonymous' },
      { texto: `A good plan is not afraid of flexibility.`, autor: 'Anonymous' },
      { texto: `Sow discipline and you will reap options.`, autor: 'Anonymous' },
      { texto: `Cooperation multiplies individual results.`, autor: 'Anonymous' },
      { texto: `Don't confuse humility with lack of ambition.`, autor: 'Anonymous' },
      { texto: `Be clear about your priorities and the rest will fall into place.`, autor: 'Anonymous' },
      { texto: `Patience with the process brings unexpected fruits.`, autor: 'Anonymous' },
      { texto: `Perseverance often overcomes fleeting inspiration.`, autor: 'Anonymous' },
      { texto: `Transform uncertainty into operative curiosity.`, autor: 'Anonymous' },
      { texto: `Value learning more than immediate approval.`, autor: 'Anonymous' },
      { texto: `The humility to listen is the basis of leadership.`, autor: 'Anonymous' },
      { texto: `Learn to prioritize what brings the greatest value.`, autor: 'Anonymous' },
      { texto: `Ingenuity appears when the plan fails and you adapt.`, autor: 'Anonymous' },
      { texto: `Don't postpone for perfection what you could improve by iterating.`, autor: 'Anonymous' },
      { texto: `Self-control is the key that unlocks discipline.`, autor: 'Anonymous' },
      { texto: `Mental clarity is achieved with solid habits.`, autor: 'Anonymous' },
      { texto: `Measure to improve; what is not measured, does not progress.`, autor: 'Anonymous' },
      { texto: `Ask the questions no one else asks and you will find valuable answers.`, autor: 'Anonymous' },
      { texto: `Sincere appreciation fuels lasting relationships.`, autor: 'Anonymous' },
      { texto: `Coherence produces trust; trust produces freedom.`, autor: 'Anonymous' },
      { texto: `Don't be afraid to delete what no longer serves; it's part of creating.`, autor: 'Anonymous' },
      { texto: `Be more curious than critical when evaluating new ideas.`, autor: 'Anonymous' },
      { texto: `Trust the process, adjust the technique.`, autor: 'Anonymous' },
      { texto: `Good judgment is born from experience and study.`, autor: 'Anonymous' },
      { texto: `Sustained discipline makes you invincible against distraction.`, autor: 'Anonymous' },
      { texto: `Excellence is a daily habit, not a heroic act.`, autor: 'Anonymous' },
      { texto: `Creativity thrives within clear limits.`, autor: 'Anonymous' },
      { texto: `Modesty facilitates learning from those who know.`, autor: 'Anonymous' },
      { texto: `Sow ideas, reap opportunities.`, autor: 'Anonymous' },
      { texto: `Focus is not exclusion, it is intentional choice.`, autor: 'Anonymous' },
      { texto: `Build systems that make good work the easiest work.`, autor: 'Anonymous' },
      { texto: `Be curious about your own assumptions.`, autor: 'Anonymous' },
      { texto: `Small daily progress beats great sporadic effort.`, autor: 'Anonymous' },
      { texto: `Appreciate the process as much as the result.`, autor: 'Anonymous' },
      { texto: `Resilience is trained with small, self-imposed difficulties.`, autor: 'Anonymous' },
      { texto: `Respect your time: it is the most personal capital you have.`, autor: 'Anonymous' },
      { texto: `Good communication reduces the need for correction.`, autor: 'Anonymous' },
      { texto: `Being diligent today avoids problems tomorrow.`, autor: 'Anonymous' },
      { texto: `Don't underestimate strategic breaks; they clarify decisions.`, autor: 'Anonymous' },
      { texto: `Act according to principles, not moods.`, autor: 'Anonymous' },
      { texto: `Adaptability is competitiveness in changing environments.`, autor: 'Anonymous' },
      { texto: `Share credit and burden; that's how strong teams are built.`, autor: 'Anonymous' },
      { texto: `Critical thinking is a tool to safeguard the truth.`, autor: 'Anonymous' },
      { texto: `Well-directed energy produces consistent results.`, autor: 'Anonymous' },
      { texto: `Not everything urgent is important; learn to distinguish.`, autor: 'Anonymous' },
      { texto: `Clarity of purpose filters out the irrelevant.`, autor: 'Anonymous' },
      { texto: `Invest time in understanding before trying to change something.`, autor: 'Anonymous' },
      { texto: `Turn curiosity into controlled experiments.`, autor: 'Anonymous' },
      { texto: `Be grateful for what works and improve what doesn't.`, autor: 'Anonymous' },
      { texto: `The right questions simplify complex problems.`, autor: 'Anonymous' },
      { texto: `When you know exactly what you are looking for, you will find it faster.`, autor: 'Anonymous' },
      { texto: `A culture of learning sustains collective progress.`, autor: 'Anonymous' },
      { texto: `Enthusiasm without discipline is soon consumed.`, autor: 'Anonymous' },
      { texto: `Seek evidence before accepting convenient certainties.`, autor: 'Anonymous' },
      { texto: `Clear boundaries encourage creativity within them.`, autor: 'Anonymous' },
      { texto: `A good habit beats a forgotten good idea.`, autor: 'Anonymous' },
      { texto: `Don't sacrifice the important for the urgent.`, autor: 'Anonymous' },
      { texto: `Talent is enhanced by focused work.`, autor: 'Anonymous' },
      { texto: `Think in terms of systems, not just isolated actions.`, autor: 'Anonymous' },
      { texto: `Use silence to listen to your best idea.`, autor: 'Anonymous' },
      { texto: `Leadership begins with managing your own affairs well.`, autor: 'Anonymous' },
      { texto: `Divide the big thing into tasks you can start today.`, autor: 'Anonymous' },
      { texto: `Self-criticism is useful if it translates into improvement.`, autor: 'Anonymous' },
      { texto: `When you waste time on what doesn't matter, you lose opportunities.`, autor: 'Anonymous' },
      { texto: `Do the hard things when you have energy; leave the routine ones for later.`, autor: 'Anonymous' },
      { texto: `Consistency creates identity; identity creates habits.`, autor: 'Anonymous' },
      { texto: `Learn to close cycles to open new projects.`, autor: 'Anonymous' },
      { texto: `Complex problems require simple, repeated steps.`, autor: 'Anonymous' },
      { texto: `Sometimes moving forward means giving up a good option for a better one.`, autor: 'Anonymous' },
      { texto: `True courage appears when you act despite fear.`, autor: 'Anonymous' },
      { texto: `Surround yourself with people who challenge you to improve.`, autor: 'Anonymous' },
      { texto: `Sustained curiosity produces unexpected experts.`, autor: 'Anonymous' },
      { texto: `Don't confuse busy-ness with productivity.`, autor: 'Anonymous' },
      { texto: `Clarity of goals saves useless decisions.`, autor: 'Anonymous' },
      { texto: `Knowing how to prioritize is the superpower of effectiveness.`, autor: 'Anonymous' },
      { texto: `Discipline is the art of doing what must be done even if you don't feel like it.`, autor: 'Anonymous' },
      { texto: `A day with intention beats a week without focus.`, autor: 'Anonymous' },
      { texto: `Cultivate applied patience: wait and act with judgment.`, autor: 'Anonymous' },
      { texto: `Sincere feedback is a gift disguised as discomfort.`, autor: 'Anonymous' },
      { texto: `Humility does not remove authority; it strengthens it when it is real.`, autor: 'Anonymous' },
      { texto: `Use mistakes as data, not as labels.`, autor: 'Anonymous' },
      { texto: `Small things done well produce great effects over time.`, autor: 'Anonymous' },
      { texto: `Excellence is built by avoiding harmful shortcuts.`, autor: 'Anonymous' },
      { texto: `Be curious about your limits and seek to expand them with technique.`, autor: 'Anonymous' },
      { texto: `Invest in habits that allow you to self-direct.`, autor: 'Anonymous' },
      { texto: `Courage is persisting when comfort pushes you to give up.`, autor: 'Anonymous' },
      { texto: `Foster clarity: it reduces doubts and accelerates decisions.`, autor: 'Anonymous' },
      { texto: `Knowing how to listen is gaining time and knowledge.`, autor: 'Anonymous' },
      { texto: `Well-organized work is more efficient than frantic work.`, autor: 'Anonymous' },
      { texto: `Be responsible with your word, beyond your intention.`, autor: 'Anonymous' },
      { texto: `Useful learning is what you can apply tomorrow.`, autor: 'Anonymous' },
      { texto: `Daily discipline surpasses occasional great efforts.`, autor: 'Anonymous' },
      { texto: `Do less, but better: quality over quantity.`, autor: 'Anonymous' },
      { texto: `Innovation is not born without sustained curiosity.`, autor: 'Anonymous' },
      { texto: `The best project is the one you can finish and improve.`, autor: 'Anonymous' },
      { texto: `Don't lose perspective by dealing with meaningless details.`, autor: 'Anonymous' },
      { texto: `Resilience is not getting tougher, it's learning to recover better.`, autor: 'Anonymous' },
      { texto: `Plan a little, execute a lot, adjust always.`, autor: 'Anonymous' },
      { texto: `External order facilitates mental order.`, autor: 'Anonymous' },
      { texto: `Seek progress, not immediate perfection.`, autor: 'Anonymous' },
      { texto: `Intelligent consistency produces sustainable results.`, autor: 'Anonymous' },
      { texto: `Learn to distinguish between noise and signal.`, autor: 'Anonymous' },
      { texto: `Time spent thinking well saves work later.`, autor: 'Anonymous' },
      { texto: `Choose projects that allow you to learn and contribute.`, autor: 'Anonymous' },
      { texto: `A team with good habits outperforms one with disorganized talent.`, autor: 'Anonymous' },
      { texto: `Modesty when learning accelerates improvement.`, autor: 'Anonymous' },
      { texto: `The best investment is the one that makes you more capable.`, autor: 'Anonymous' },
      { texto: `When in doubt, test: action clarifies more than assumption.`, autor: 'Anonymous' },
      { texto: `Simplify processes so that the good can be repeated.`, autor: 'Anonymous' },
      { texto: `Keep improving the interface between your ideas and the world.`, autor: 'Anonymous' },
      { texto: `Sustained effort makes the difficult become normal.`, autor: 'Anonymous' },
      { texto: `Pragmatic optimism combines hope with work.`, autor: 'Anonymous' },
      { texto: `Discipline has silent but lasting rewards.`, autor: 'Anonymous' },
      { texto: `Not all change is progress; evaluate its direction.`, autor: 'Anonymous' },
      { texto: `Knowledge without application is like a seed without soil.`, autor: 'Anonymous' },
      { texto: `Celebrate small advances; they build momentum.`, autor: 'Anonymous' },
      { texto: `A broad perspective avoids short-term solutions.`, autor: 'Anonymous' },
      { texto: `Face what is important even if it is not urgent.`, autor: 'Anonymous' },
      { texto: `Humble curiosity multiplies possibilities.`, autor: 'Anonymous' },
      { texto: `Transform ideas into actions and actions into habit.`, autor: 'Anonymous' },
      { texto: `Consistency creates identity: be who you want to be every day.`, autor: 'Anonymous' },
      { texto: `Don't confuse frantic activity with meaning.`, autor: 'Anonymous' },
      { texto: `Brief, frequent reflection improves decision-making.`, autor: 'Anonymous' },
      { texto: `Sometimes fewer options lead to better decisions.`, autor: 'Anonymous' },
      { texto: `Discipline begins with small, meaningful sacrifices.`, autor: 'Anonymous' },
      { texto: `Save time for thinking; solutions often appear there.`, autor: 'Anonymous' },
      { texto: `Build habits that protect you from inertia.`, autor: 'Anonymous' },
      { texto: `If you want different results, try different actions.`, autor: 'Anonymous' },
      { texto: `Good judgment is the combination of experience and humility.`, autor: 'Anonymous' },
      { texto: `Accept temporary discomfort if it serves a clear goal.`, autor: 'Anonymous' },
      { texto: `Useful sincerity prioritizes solutions over justifications.`, autor: 'Anonymous' },
      { texto: `Learn to measure what truly matters.`, autor: 'Anonymous' },
      { texto: `A proactive attitude opens doors that waiting closes.`, autor: 'Anonymous' },
      { texto: `Work on what multiplies your impact, not just what keeps you busy.`, autor: 'Anonymous' },
      { texto: `Constant effort overcomes erratic inspiration.`, autor: 'Anonymous' },
      { texto: `Clarity of goals reduces decision fatigue.`, autor: 'Anonymous' },
      { texto: `Take care of your environment: it is the mirror of your priorities.`, autor: 'Anonymous' },
      { texto: `Knowing when to pause is as valuable as knowing when to accelerate.`, autor: 'Anonymous' },
      { texto: `The humility to learn and the courage to execute form a good balance.`, autor: 'Anonymous' },
      { texto: `Don't underestimate the power of a good, repeated habit.`, autor: 'Anonymous' },
      { texto: `First resolve what drains your energy; the rest will be clearer.`, autor: 'Anonymous' },
      { texto: `Sow order and you will reap efficiency.`, autor: 'Anonymous' },
      { texto: `Well-directed discipline produces real freedom.`, autor: 'Anonymous' },
      { texto: `Practical leadership is evident in small, repeated decisions.`, autor: 'Anonymous' },
      { texto: `Act with intention and avoid chronic improvisation.`, autor: 'Anonymous' },
      { texto: `Think in terms of impact, not activity.`, autor: 'Anonymous' },
      { texto: `An honest question is worth more than a complacent answer.`, autor: 'Anonymous' },
      { texto: `Do what you can today so you don't carry regrets tomorrow.`, autor: 'Anonymous' },
      { texto: `Intelligent consistency beats disorganized talent.`, autor: 'Anonymous' },
      { texto: `Don't rely only on motivation; build systems.`, autor: 'Anonymous' },
      { texto: `Spend time thinking about strategy, not just tactics.`, autor: 'Anonymous' },
      { texto: `The best investment is the one that increases your decision-making capacity.`, autor: 'Anonymous' },
      { texto: `Practice the art of finishing what you start.`, autor: 'Anonymous' },
      { texto: `Well-placed boundaries generate more creativity.`, autor: 'Anonymous' },
      { texto: `Learn to iterate: test, measure, correct, repeat.`, autor: 'Anonymous' },
      { texto: `Respect for others' time is respect for the work.`, autor: 'Anonymous' },
      { texto: `Clarity in expectations avoids wasted efforts.`, autor: 'Anonymous' },
      { texto: `Excellence is achieved by taking care of the relevant details.`, autor: 'Anonymous' },
      { texto: `Transform discomfort into an indicator of learning.`, autor: 'Anonymous' },
      { texto: `If you're not moving forward, change the strategy, not the hope.`, autor: 'Anonymous' },
      { texto: `Discipline begins with small, repeated actions without witnesses.`, autor: 'Anonymous' },
      { texto: `Be thankful for mistakes: they are showing you how to improve.`, autor: 'Anonymous' },
      { texto: `What you maintain with consistency becomes your identity.`, autor: 'Anonymous' },
      { texto: `Don't avoid difficulty; use it to train your resilience.`, autor: 'Anonymous' },
      { texto: `Act today so that tomorrow finds you prepared.`, autor: 'Anonymous' },
      { texto: `Make fewer promises and more deliveries.`, autor: 'Anonymous' },
      { texto: `Applied curiosity creates competitive advantages.`, autor: 'Anonymous' },
      { texto: `Take care of your habits: they are the pieces with which you will build your life.`, autor: 'Anonymous' },
      { texto: `True progress is what you can sustain over time.`, autor: 'Anonymous' },
      { texto: `Prioritize clarity over momentary brilliance.`, autor: 'Anonymous' },
      { texto: `Learn to divide big problems into small, actionable tasks.`, autor: 'Anonymous' },
      { texto: `Authentic freedom appears when you master what you can control.`, autor: 'Anonymous' },
      { texto: `Honest reflection is the best compass for improvement.`, autor: 'Anonymous' },
      { texto: `Act with intention, not inertia.`, autor: 'Anonymous' },
      { texto: `Deliberate practice creates mastery in any area.`, autor: 'Anonymous' },
      { texto: `First resolve what prevents you from moving forward.`, autor: 'Anonymous' },
      { texto: `Time invested in learning is time no one can take from you.`, autor: 'Anonymous' },
      { texto: `Creativity requires discipline to materialize ideas.`, autor: 'Anonymous' },
      { texto: `Don't confuse humility with inability to decide.`, autor: 'Anonymous' },
      { texto: `Continuous improvement comes from honestly reviewing your processes.`, autor: 'Anonymous' },
      { texto: `Applied knowledge is worth more than accumulated knowledge.`, autor: 'Anonymous' },
      { texto: `Keep your goals visible; attention fatigues without reminders.`, autor: 'Anonymous' },
      { texto: `Consistency is not sexy, but it wins in the long run.`, autor: 'Anonymous' },
      { texto: `Don't be afraid to change your mind in the face of better data.`, autor: 'Anonymous' },
      { texto: `Self-care is an investment that allows you to perform better.`, autor: 'Anonymous' },
      { texto: `Deliver results that speak for your effort.`, autor: 'Anonymous' },
      { texto: `When in doubt, experiment with small tests.`, autor: 'Anonymous' },
      { texto: `Bet on what improves people, not only metrics.`, autor: 'Anonymous' },
      { texto: `Discipline is the fuel for future freedom.`, autor: 'Anonymous' },
      { texto: `Value the coherence between intention and action.`, autor: 'Anonymous' },
      { texto: `Organize your day into focused blocks and protect them.`, autor: 'Anonymous' },
      { texto: `Be curious about your results: they show you the way.`, autor: 'Anonymous' },
      { texto: `Smart work combines priority and execution.`, autor: 'Anonymous' },
      { texto: `Learn to differentiate between advice and your own responsibility.`, autor: 'Anonymous' },
      { texto: `Real improvement is based on data and willingness.`, autor: 'Anonymous' },
      { texto: `Don't confuse volume with value.`, autor: 'Anonymous' },
      { texto: `Build the routine that will keep you moving forward on difficult days.`, autor: 'Anonymous' },
      { texto: `Strategic patience is a powerful form of audacity.`, autor: 'Anonymous' },
      { texto: `Keep curiosity alive and possibilities will grow.`, autor: 'Anonymous' },
      { texto: `Do what you can today so that future effort is less.`, autor: 'Anonymous' },
      { texto: `Personal responsibility is the foundation of collective respect.`, autor: 'Anonymous' },
      { texto: `Mind your words; they define your agreements and your relationships.`, autor: 'Anonymous' },
      { texto: `The most valuable learning is the one that changes your behavior.`, autor: 'Anonymous' }
    ];
function cargarFraseDelDia() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), 0, 0);
  const diff = hoy - inicio;
  const unDia = 1000 * 60 * 60 * 24;
  let diaDelAno = Math.floor(diff / unDia);
  if (diaDelAno < 1) diaDelAno = 1;

  const index = (diaDelAno - 1) % frasesDelAno.length;
  const frase = frasesDelAno[index] || { texto: 'Frase no disponible.', autor: 'Anónimo' };

  document.getElementById("textoFrase").textContent = frase.texto;
  document.getElementById("autorFrase").textContent = frase.autor ? `— ${frase.autor}` : '';
}

cargarFraseDelDia();

// === ADMIN PANEL ===
const adminButton = document.getElementById("adminButton");
const passwordDiv = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const adminStatus = document.getElementById("adminStatus");

adminButton.addEventListener("click", () => {
  passwordDiv.style.display = passwordDiv.style.display === "none" ? "block" : "none";
});

loginButton.addEventListener("click", () => {
  const val = document.getElementById("adminPass").value;
  if (val === ADMIN_PASSWORD) {
    esAdmin = true;
    adminStatus.innerHTML = "<span style='color:green'></span>";
    document.querySelectorAll(".regenerar-btn").forEach(b => b.style.display = "block");
  } else {
    alert("Contraseña incorrecta");
  }
});

// === CARGAR NOTICIAS ===
async function cargarNoticias() {
  try {
    const response = await fetch(NEWS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria: "technology", pageSize: TOTAL })
    });
    const data = await response.json();
    noticias = Array.isArray(data.articles) ? data.articles.slice(0, TOTAL) : [];

    if (noticias.length === 0) {
      document.getElementById("noticias").innerHTML = "<p>No hay noticias disponibles.</p>";
      return;
    }

    for (let i = 0; i < TOTAL; i++) {
      const cont = document.getElementById(`n${i + 1}`);
      const art = noticias[i];
      cont.innerHTML = crearPlantillaNoticia(art, i);

      const resumenDiv = cont.querySelector(".resumen");
      encolarResumen(getTexto(art), resumenDiv);

      const btn = cont.querySelector(".regenerar-btn");
      btn.addEventListener("click", () => regenerarNoticia(i + 1));
    }
  } catch (err) {
    console.error("Error al cargar noticias:", err);
  }
}

function crearPlantillaNoticia(art, index) {
  const img = art && art.urlToImage
    ? `<img class="noticia-img" src="${art.urlToImage}" alt="Imagen">`
    : "";
  const title = art && art.title ? art.title : "Sin título";
  const desc =
    art && (art.description || art.content)
      ? art.description || art.content
      : "Sin descripción disponible.";
  const url = art && art.url ? art.url : "#";

  return `
    <div class="noticia" style="display: flex; align-items: flex-start; gap: 15px;">
      <div class="texto" style="flex: 1;">
        <div class="titulo">${escapeHtml(title)}</div>
        <div class="descripcion">${escapeHtml(desc)}</div>
        <div class="resumen"><em>Generating summary...</em></div>
        <a class="enlace" href="${url}" target="_blank" rel="noopener">See more</a>
        <button class="regenerar-btn" style="display:none;">Respawn</button>
      </div>
      ${img}
    </div>
  `;
}


function getTexto(art) {
  return art && (art.description || art.content || art.title) ? (art.description || art.content || art.title) : "";
}

// === GESTIÓN DE COLA Y COOLDOWN ===
function encolarResumen(texto, destino) {
  colaResumenes.push({ texto, destino });
  if (!procesandoCola) procesarCola();
}

async function procesarCola() {
  procesandoCola = true;
  while (colaResumenes.length > 0) {
    const ahora = Date.now();
    const tiempoDesdeUltima = ahora - ultimaPeticion;

    if (tiempoDesdeUltima < COOLDOWN_MS) {
      await new Promise(r => setTimeout(r, COOLDOWN_MS - tiempoDesdeUltima));
    }

    const { texto, destino } = colaResumenes.shift();
    await generarResumen(texto, destino);

    ultimaPeticion = Date.now();
  }
  procesandoCola = false;
}

async function generarResumen(texto, destino) {
  try {
    if (!texto || texto.trim().length === 0) {
      destino.textContent = "No hay texto para resumir.";
      return;
    }
    const prompt = `Summarize the following technology news article in English only, without using Spanish, your summarize must be written in english:\n\n${texto}`;
    const resp = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await resp.json();
    const resumen = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    destino.textContent = resumen || "No se pudo generar el resumen.";
  } catch (err) {
    destino.textContent = "Error al generar resumen.";
  }
}

// === FUNCIONES EXTRA ===
function regenerarNoticia(indice) {
  if (!esAdmin) {
    alert("Solo el admin puede regenerar noticias.");
    return;
  }

  const actual = document.getElementById(`n${indice}`);
  if (!actual) return;
  actual.remove();

  for (let i = VISIBLES + 1; i <= TOTAL; i++) {
    const siguiente = document.getElementById(`n${i}`);
    if (siguiente && siguiente.style.display === "none") {
      siguiente.style.display = "block";
      return;
    }
  }

  alert("No hay más noticias para mostrar.");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// === Inicio ===
cargarNoticias();




















