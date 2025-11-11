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
      { texto: `Start each day with the intention of taking one step forward, no matter how small.`, autor: 'Anónimo' },
      { texto: `Curiosity is the spark that ignites any discovery.`, autor: 'Anónimo' },
      { texto: `Don't confuse movement with progress; act with purpose.`, autor: 'Anónimo' },
      { texto: `Sometimes the best plan is to creatively adapt to the unexpected.`, autor: 'Anónimo' },
      { texto: `Learning something new every day is investing in your freedom.`, autor: 'Anónimo' },
      { texto: `Ideas are worth little without the courage to put them into practice.`, autor: 'Anónimo' },
      { texto: `Listen for more questions than answers, and you will grow.`, autor: 'Anónimo' },
      { texto: `Consistency beats talent when talent doesn't work.`, autor: 'Anónimo' },
      { texto: `A well-analyzed mistake is the seed of improvement.`, autor: 'Anónimo' },
      { texto: `Do what is necessary today to thank yourself tomorrow.`, autor: 'Anónimo' },
      { texto: `Technology amplifies intention: put it to the service of what is useful.`, autor: 'Anónimo' },
      { texto: `Don't underestimate the power of a well-utilized break.`, autor: 'Anónimo' },
      { texto: `Creativity is born when you accept limits and play with them.`, autor: 'Anónimo' },
      { texto: `Ask for feedback and act: improvement does not happen by chance.`, autor: 'Anónimo' },
      { texto: `The greatest solutions are often the simplest ones.`, autor: 'Anónimo' },
      { texto: `If you hesitate between two paths, choose the one that teaches you the most.`, autor: 'Anónimo' },
      { texto: `Active patience is building without seeing the immediate result.`, autor: 'Anónimo' },
      { texto: `Share what you know; to teach is to learn twice.`, autor: 'Anónimo' },
      { texto: `Today's small victories fuel tomorrow's great triumphs.`, autor: 'Anónimo' },
      { texto: `Accept useful criticism; reject that which limits without foundation.`, autor: 'Anónimo' },
      { texto: `Responsibility begins with fulfilling what you say you will do.`, autor: 'Anónimo' },
      { texto: `Your attention is a scarce resource: invest it in what matters.`, autor: 'Anónimo' },
      { texto: `Active optimism seeks solutions, not excuses.`, autor: 'Anónimo' },
      { texto: `When you raise the bar, new capabilities will appear.`, autor: 'Anónimo' },
      { texto: `Nurture relationships; they are the infrastructure of well-being.`, autor: 'Anónimo' },
      { texto: `Resolve today what drains your energy so you can create tomorrow.`, autor: 'Anónimo' },
      { texto: `The habit of asking "why?" makes you unique and better informed.`, autor: 'Anónimo' },
      { texto: `The essence of learning is changing your mind when there are reasons to.`, autor: 'Anónimo' },
      { texto: `Calculated risk opens doors; inaction closes them.`, autor: 'Anónimo' },
      { texto: `You are not seeking perfection, you are seeking progress that is sustained over time.`, autor: 'Anónimo' },
      { texto: `Discipline is not punishment; it is the structure of freedom.`, autor: 'Anónimo' },
      { texto: `Being effective means saying 'no' to what distracts you.`, autor: 'Anónimo' },
      { texto: `Respect for others begins with respect for your own boundaries.`, autor: 'Anónimo' },
      { texto: `Audacity often only requires taking the first step.`, autor: 'Anónimo' },
      { texto: `Mindfulness turns the ordinary into an experience.`, autor: 'Anónimo' },
      { texto: `When you fail, collect data, not blame.`, autor: 'Anónimo' },
      { texto: `Gratitude transforms what we have into enough.`, autor: 'Anónimo' },
      { texto: `Less noise, more meaningful work.`, autor: 'Anónimo' },
      { texto: `Don't wait for permission to improve something that depends on you.`, autor: 'Anónimo' },
      { texto: `A good question is worth more than a quick answer.`, autor: 'Anónimo' },
      { texto: `Intellectual impartiality is the ground for valuable ideas.`, autor: 'Anónimo' },
      { texto: `What seems difficult today will be commonplace tomorrow if you persist.`, autor: 'Anónimo' },
      { texto: `Cultivate wonder; it is a source of continuous motivation.`, autor: 'Anónimo' },
      { texto: `Clarity is an act of generosity toward others.`, autor: 'Anónimo' },
      { texto: `Well-executed discussions lead to real actions.`, autor: 'Anónimo' },
      { texto: `Humility does not deny capabilities; it allows for more learning.`, autor: 'Anónimo' },
      { texto: `Transform complaints into problems to be solved.`, autor: 'Anónimo' },
      { texto: `Time is the most honest judge of your priorities.`, autor: 'Anónimo' },
      { texto: `Don't confuse speed with direction.`, autor: 'Anónimo' },
      { texto: `The essential is rarely noisy; observe it carefully.`, autor: 'Anónimo' },
      { texto: `Allow yourself to make mistakes, but don't allow yourself not to learn.`, autor: 'Anónimo' },
      { texto: `Creativity is fueled by curiosity and patience.`, autor: 'Anónimo' },
      { texto: `Coherence between word and deed is long-term reputation.`, autor: 'Anónimo' },
      { texto: `If you don't know where to start, start by tidying up.`, autor: 'Anónimo' },
      { texto: `Good design solves problems and simplifies lives.`, autor: 'Anónimo' },
      { texto: `Reinvent your failures as useful information.`, autor: 'Anónimo' },
      { texto: `Intellectual humility is the foundation of continuous learning.`, autor: 'Anónimo' },
      { texto: `The best question is often, "What problem am I solving?"`, autor: 'Anónimo' },
      { texto: `Build habits that bring you closer to who you want to be.`, autor: 'Anónimo' },
      { texto: `Don't compare yourself to the picture at the summit; everyone has their own path.`, autor: 'Anónimo' },
      { texto: `Take care of your environment: it affects your productivity and your mood.`, autor: 'Anónimo' },
      { texto: `Consistency multiplies talent.`, autor: 'Anónimo' },
      { texto: `Give time: it is the most valuable resource you can give.`, autor: 'Anónimo' },
      { texto: `Responsibility is not heavy if you share it with clarity.`, autor: 'Anónimo' },
      { texto: `Sow curiosity and you will reap innovation.`, autor: 'Anónimo' },
      { texto: `Success often comes to those who solve what others avoid.`, autor: 'Anónimo' },
      { texto: `Learn to rest without guilt; your performance will thank you.`, autor: 'Anónimo' },
      { texto: `What you can sustain consistently works best.`, autor: 'Anónimo' },
      { texto: `Great ideas need time to mature.`, autor: 'Anónimo' },
      { texto: `Simplicity is not trivial; it requires work and judgment.`, autor: 'Anónimo' },
      { texto: `Don't let fear decide for you; act with good judgment.`, autor: 'Anónimo' },
      { texto: `Efficacy is doing what is necessary; efficiency is doing it well.`, autor: 'Anónimo' },
      { texto: `Nurture your curiosity as if it were a rare plant.`, autor: 'Anónimo' },
      { texto: `Every day offers an opportunity to correct course.`, autor: 'Anónimo' },
      { texto: `A good plan is not afraid of flexibility.`, autor: 'Anónimo' },
      { texto: `Sow discipline and you will reap options.`, autor: 'Anónimo' },
      { texto: `Cooperation multiplies individual results.`, autor: 'Anónimo' },
      { texto: `Don't confuse humility with lack of ambition.`, autor: 'Anónimo' },
      { texto: `Be clear about your priorities and the rest will fall into place.`, autor: 'Anónimo' },
      { texto: `Patience with the process brings unexpected fruits.`, autor: 'Anónimo' },
      { texto: `Perseverance often overcomes fleeting inspiration.`, autor: 'Anónimo' },
      { texto: `Transform uncertainty into operative curiosity.`, autor: 'Anónimo' },
      { texto: `Value learning more than immediate approval.`, autor: 'Anónimo' },
      { texto: `The humility to listen is the basis of leadership.`, autor: 'Anónimo' },
      { texto: `Learn to prioritize what brings the greatest value.`, autor: 'Anónimo' },
      { texto: `Ingenuity appears when the plan fails and you adapt.`, autor: 'Anónimo' },
      { texto: `Don't postpone for perfection what you could improve by iterating.`, autor: 'Anónimo' },
      { texto: `Self-control is the key that unlocks discipline.`, autor: 'Anónimo' },
      { texto: `Mental clarity is achieved with solid habits.`, autor: 'Anónimo' },
      { texto: `Measure to improve; what is not measured, does not progress.`, autor: 'Anónimo' },
      { texto: `Ask the questions no one else asks and you will find valuable answers.`, autor: 'Anónimo' },
      { texto: `Sincere appreciation fuels lasting relationships.`, autor: 'Anónimo' },
      { texto: `Coherence produces trust; trust produces freedom.`, autor: 'Anónimo' },
      { texto: `Don't be afraid to delete what no longer serves; it's part of creating.`, autor: 'Anónimo' },
      { texto: `Be more curious than critical when evaluating new ideas.`, autor: 'Anónimo' },
      { texto: `Trust the process, adjust the technique.`, autor: 'Anónimo' },
      { texto: `Good judgment is born from experience and study.`, autor: 'Anónimo' },
      { texto: `Sustained discipline makes you invincible against distraction.`, autor: 'Anónimo' },
      { texto: `Excellence is a daily habit, not a heroic act.`, autor: 'Anónimo' },
      { texto: `Creativity thrives within clear limits.`, autor: 'Anónimo' },
      { texto: `Modesty facilitates learning from those who know.`, autor: 'Anónimo' },
      { texto: `Sow ideas, reap opportunities.`, autor: 'Anónimo' },
      { texto: `Focus is not exclusion, it is intentional choice.`, autor: 'Anónimo' },
      { texto: `Build systems that make good work the easiest work.`, autor: 'Anónimo' },
      { texto: `Be curious about your own assumptions.`, autor: 'Anónimo' },
      { texto: `Small daily progress beats great sporadic effort.`, autor: 'Anónimo' },
      { texto: `Appreciate the process as much as the result.`, autor: 'Anónimo' },
      { texto: `Resilience is trained with small, self-imposed difficulties.`, autor: 'Anónimo' },
      { texto: `Respect your time: it is the most personal capital you have.`, autor: 'Anónimo' },
      { texto: `Good communication reduces the need for correction.`, autor: 'Anónimo' },
      { texto: `Being diligent today avoids problems tomorrow.`, autor: 'Anónimo' },
      { texto: `Don't underestimate strategic breaks; they clarify decisions.`, autor: 'Anónimo' },
      { texto: `Act according to principles, not moods.`, autor: 'Anónimo' },
      { texto: `Adaptability is competitiveness in changing environments.`, autor: 'Anónimo' },
      { texto: `Share credit and burden; that's how strong teams are built.`, autor: 'Anónimo' },
      { texto: `Critical thinking is a tool to safeguard the truth.`, autor: 'Anónimo' },
      { texto: `Well-directed energy produces consistent results.`, autor: 'Anónimo' },
      { texto: `Not everything urgent is important; learn to distinguish.`, autor: 'Anónimo' },
      { texto: `Clarity of purpose filters out the irrelevant.`, autor: 'Anónimo' },
      { texto: `Invest time in understanding before trying to change something.`, autor: 'Anónimo' },
      { texto: `Turn curiosity into controlled experiments.`, autor: 'Anónimo' },
      { texto: `Be grateful for what works and improve what doesn't.`, autor: 'Anónimo' },
      { texto: `The right questions simplify complex problems.`, autor: 'Anónimo' },
      { texto: `When you know exactly what you are looking for, you will find it faster.`, autor: 'Anónimo' },
      { texto: `A culture of learning sustains collective progress.`, autor: 'Anónimo' },
      { texto: `Enthusiasm without discipline is soon consumed.`, autor: 'Anónimo' },
      { texto: `Seek evidence before accepting convenient certainties.`, autor: 'Anónimo' },
      { texto: `Clear boundaries encourage creativity within them.`, autor: 'Anónimo' },
      { texto: `A good habit beats a forgotten good idea.`, autor: 'Anónimo' },
      { texto: `Don't sacrifice the important for the urgent.`, autor: 'Anónimo' },
      { texto: `Talent is enhanced by focused work.`, autor: 'Anónimo' },
      { texto: `Think in terms of systems, not just isolated actions.`, autor: 'Anónimo' },
      { texto: `Use silence to listen to your best idea.`, autor: 'Anónimo' },
      { texto: `Leadership begins with managing your own affairs well.`, autor: 'Anónimo' },
      { texto: `Divide the big thing into tasks you can start today.`, autor: 'Anónimo' },
      { texto: `Self-criticism is useful if it translates into improvement.`, autor: 'Anónimo' },
      { texto: `When you waste time on what doesn't matter, you lose opportunities.`, autor: 'Anónimo' },
      { texto: `Do the hard things when you have energy; leave the routine ones for later.`, autor: 'Anónimo' },
      { texto: `Consistency creates identity; identity creates habits.`, autor: 'Anónimo' },
      { texto: `Learn to close cycles to open new projects.`, autor: 'Anónimo' },
      { texto: `Complex problems require simple, repeated steps.`, autor: 'Anónimo' },
      { texto: `Sometimes moving forward means giving up a good option for a better one.`, autor: 'Anónimo' },
      { texto: `True courage appears when you act despite fear.`, autor: 'Anónimo' },
      { texto: `Surround yourself with people who challenge you to improve.`, autor: 'Anónimo' },
      { texto: `Sustained curiosity produces unexpected experts.`, autor: 'Anónimo' },
      { texto: `Don't confuse busy-ness with productivity.`, autor: 'Anónimo' },
      { texto: `Clarity of goals saves useless decisions.`, autor: 'Anónimo' },
      { texto: `Knowing how to prioritize is the superpower of effectiveness.`, autor: 'Anónimo' },
      { texto: `Discipline is the art of doing what must be done even if you don't feel like it.`, autor: 'Anónimo' },
      { texto: `A day with intention beats a week without focus.`, autor: 'Anónimo' },
      { texto: `Cultivate applied patience: wait and act with judgment.`, autor: 'Anónimo' },
      { texto: `Sincere feedback is a gift disguised as discomfort.`, autor: 'Anónimo' },
      { texto: `Humility does not remove authority; it strengthens it when it is real.`, autor: 'Anónimo' },
      { texto: `Use mistakes as data, not as labels.`, autor: 'Anónimo' },
      { texto: `Small things done well produce great effects over time.`, autor: 'Anónimo' },
      { texto: `Excellence is built by avoiding harmful shortcuts.`, autor: 'Anónimo' },
      { texto: `Be curious about your limits and seek to expand them with technique.`, autor: 'Anónimo' },
      { texto: `Invest in habits that allow you to self-direct.`, autor: 'Anónimo' },
      { texto: `Courage is persisting when comfort pushes you to give up.`, autor: 'Anónimo' },
      { texto: `Foster clarity: it reduces doubts and accelerates decisions.`, autor: 'Anónimo' },
      { texto: `Knowing how to listen is gaining time and knowledge.`, autor: 'Anónimo' },
      { texto: `Well-organized work is more efficient than frantic work.`, autor: 'Anónimo' },
      { texto: `Be responsible with your word, beyond your intention.`, autor: 'Anónimo' },
      { texto: `Useful learning is what you can apply tomorrow.`, autor: 'Anónimo' },
      { texto: `Daily discipline surpasses occasional great efforts.`, autor: 'Anónimo' },
      { texto: `Do less, but better: quality over quantity.`, autor: 'Anónimo' },
      { texto: `Innovation is not born without sustained curiosity.`, autor: 'Anónimo' },
      { texto: `The best project is the one you can finish and improve.`, autor: 'Anónimo' },
      { texto: `Don't lose perspective by dealing with meaningless details.`, autor: 'Anónimo' },
      { texto: `Resilience is not getting tougher, it's learning to recover better.`, autor: 'Anónimo' },
      { texto: `Plan a little, execute a lot, adjust always.`, autor: 'Anónimo' },
      { texto: `External order facilitates mental order.`, autor: 'Anónimo' },
      { texto: `Seek progress, not immediate perfection.`, autor: 'Anónimo' },
      { texto: `Intelligent consistency produces sustainable results.`, autor: 'Anónimo' },
      { texto: `Learn to distinguish between noise and signal.`, autor: 'Anónimo' },
      { texto: `Time spent thinking well saves work later.`, autor: 'Anónimo' },
      { texto: `Choose projects that allow you to learn and contribute.`, autor: 'Anónimo' },
      { texto: `A team with good habits outperforms one with disorganized talent.`, autor: 'Anónimo' },
      { texto: `Modesty when learning accelerates improvement.`, autor: 'Anónimo' },
      { texto: `The best investment is the one that makes you more capable.`, autor: 'Anónimo' },
      { texto: `When in doubt, test: action clarifies more than assumption.`, autor: 'Anónimo' },
      { texto: `Simplify processes so that the good can be repeated.`, autor: 'Anónimo' },
      { texto: `Keep improving the interface between your ideas and the world.`, autor: 'Anónimo' },
      { texto: `Sustained effort makes the difficult become normal.`, autor: 'Anónimo' },
      { texto: `Pragmatic optimism combines hope with work.`, autor: 'Anónimo' },
      { texto: `Discipline has silent but lasting rewards.`, autor: 'Anónimo' },
      { texto: `Not all change is progress; evaluate its direction.`, autor: 'Anónimo' },
      { texto: `Knowledge without application is like a seed without soil.`, autor: 'Anónimo' },
      { texto: `Celebrate small advances; they build momentum.`, autor: 'Anónimo' },
      { texto: `A broad perspective avoids short-term solutions.`, autor: 'Anónimo' },
      { texto: `Face what is important even if it is not urgent.`, autor: 'Anónimo' },
      { texto: `Humble curiosity multiplies possibilities.`, autor: 'Anónimo' },
      { texto: `Transform ideas into actions and actions into habit.`, autor: 'Anónimo' },
      { texto: `Consistency creates identity: be who you want to be every day.`, autor: 'Anónimo' },
      { texto: `Don't confuse frantic activity with meaning.`, autor: 'Anónimo' },
      { texto: `Brief, frequent reflection improves decision-making.`, autor: 'Anónimo' },
      { texto: `Sometimes fewer options lead to better decisions.`, autor: 'Anónimo' },
      { texto: `Discipline begins with small, meaningful sacrifices.`, autor: 'Anónimo' },
      { texto: `Save time for thinking; solutions often appear there.`, autor: 'Anónimo' },
      { texto: `Build habits that protect you from inertia.`, autor: 'Anónimo' },
      { texto: `If you want different results, try different actions.`, autor: 'Anónimo' },
      { texto: `Good judgment is the combination of experience and humility.`, autor: 'Anónimo' },
      { texto: `Accept temporary discomfort if it serves a clear goal.`, autor: 'Anónimo' },
      { texto: `Useful sincerity prioritizes solutions over justifications.`, autor: 'Anónimo' },
      { texto: `Learn to measure what truly matters.`, autor: 'Anónimo' },
      { texto: `A proactive attitude opens doors that waiting closes.`, autor: 'Anónimo' },
      { texto: `Work on what multiplies your impact, not just what keeps you busy.`, autor: 'Anónimo' },
      { texto: `Constant effort overcomes erratic inspiration.`, autor: 'Anónimo' },
      { texto: `Clarity of goals reduces decision fatigue.`, autor: 'Anónimo' },
      { texto: `Take care of your environment: it is the mirror of your priorities.`, autor: 'Anónimo' },
      { texto: `Knowing when to pause is as valuable as knowing when to accelerate.`, autor: 'Anónimo' },
      { texto: `The humility to learn and the courage to execute form a good balance.`, autor: 'Anónimo' },
      { texto: `Don't underestimate the power of a good, repeated habit.`, autor: 'Anónimo' },
      { texto: `First resolve what drains your energy; the rest will be clearer.`, autor: 'Anónimo' },
      { texto: `Sow order and you will reap efficiency.`, autor: 'Anónimo' },
      { texto: `Well-directed discipline produces real freedom.`, autor: 'Anónimo' },
      { texto: `Practical leadership is evident in small, repeated decisions.`, autor: 'Anónimo' },
      { texto: `Act with intention and avoid chronic improvisation.`, autor: 'Anónimo' },
      { texto: `Think in terms of impact, not activity.`, autor: 'Anónimo' },
      { texto: `An honest question is worth more than a complacent answer.`, autor: 'Anónimo' },
      { texto: `Do what you can today so you don't carry regrets tomorrow.`, autor: 'Anónimo' },
      { texto: `Intelligent consistency beats disorganized talent.`, autor: 'Anónimo' },
      { texto: `Don't rely only on motivation; build systems.`, autor: 'Anónimo' },
      { texto: `Spend time thinking about strategy, not just tactics.`, autor: 'Anónimo' },
      { texto: `The best investment is the one that increases your decision-making capacity.`, autor: 'Anónimo' },
      { texto: `Practice the art of finishing what you start.`, autor: 'Anónimo' },
      { texto: `Well-placed boundaries generate more creativity.`, autor: 'Anónimo' },
      { texto: `Learn to iterate: test, measure, correct, repeat.`, autor: 'Anónimo' },
      { texto: `Respect for others' time is respect for the work.`, autor: 'Anónimo' },
      { texto: `Clarity in expectations avoids wasted efforts.`, autor: 'Anónimo' },
      { texto: `Excellence is achieved by taking care of the relevant details.`, autor: 'Anónimo' },
      { texto: `Transform discomfort into an indicator of learning.`, autor: 'Anónimo' },
      { texto: `If you're not moving forward, change the strategy, not the hope.`, autor: 'Anónimo' },
      { texto: `Discipline begins with small, repeated actions without witnesses.`, autor: 'Anónimo' },
      { texto: `Be thankful for mistakes: they are showing you how to improve.`, autor: 'Anónimo' },
      { texto: `What you maintain with consistency becomes your identity.`, autor: 'Anónimo' },
      { texto: `Don't avoid difficulty; use it to train your resilience.`, autor: 'Anónimo' },
      { texto: `Act today so that tomorrow finds you prepared.`, autor: 'Anónimo' },
      { texto: `Make fewer promises and more deliveries.`, autor: 'Anónimo' },
      { texto: `Applied curiosity creates competitive advantages.`, autor: 'Anónimo' },
      { texto: `Take care of your habits: they are the pieces with which you will build your life.`, autor: 'Anónimo' },
      { texto: `True progress is what you can sustain over time.`, autor: 'Anónimo' },
      { texto: `Prioritize clarity over momentary brilliance.`, autor: 'Anónimo' },
      { texto: `Learn to divide big problems into small, actionable tasks.`, autor: 'Anónimo' },
      { texto: `Authentic freedom appears when you master what you can control.`, autor: 'Anónimo' },
      { texto: `Honest reflection is the best compass for improvement.`, autor: 'Anónimo' },
      { texto: `Act with intention, not inertia.`, autor: 'Anónimo' },
      { texto: `Deliberate practice creates mastery in any area.`, autor: 'Anónimo' },
      { texto: `First resolve what prevents you from moving forward.`, autor: 'Anónimo' },
      { texto: `Time invested in learning is time no one can take from you.`, autor: 'Anónimo' },
      { texto: `Creativity requires discipline to materialize ideas.`, autor: 'Anónimo' },
      { texto: `Don't confuse humility with inability to decide.`, autor: 'Anónimo' },
      { texto: `Continuous improvement comes from honestly reviewing your processes.`, autor: 'Anónimo' },
      { texto: `Applied knowledge is worth more than accumulated knowledge.`, autor: 'Anónimo' },
      { texto: `Keep your goals visible; attention fatigues without reminders.`, autor: 'Anónimo' },
      { texto: `Consistency is not sexy, but it wins in the long run.`, autor: 'Anónimo' },
      { texto: `Don't be afraid to change your mind in the face of better data.`, autor: 'Anónimo' },
      { texto: `Self-care is an investment that allows you to perform better.`, autor: 'Anónimo' },
      { texto: `Deliver results that speak for your effort.`, autor: 'Anónimo' },
      { texto: `When in doubt, experiment with small tests.`, autor: 'Anónimo' },
      { texto: `Bet on what improves people, not just metrics.`, autor: 'Anónimo' },
      { texto: `Discipline is the fuel for future freedom.`, autor: 'Anónimo' },
      { texto: `Value the coherence between intention and action.`, autor: 'Anónimo' },
      { texto: `Organize your day into focused blocks and protect them.`, autor: 'Anónimo' },
      { texto: `Be curious about your results: they show you the way.`, autor: 'Anónimo' },
      { texto: `Smart work combines priority and execution.`, autor: 'Anónimo' },
      { texto: `Learn to differentiate between advice and your own responsibility.`, autor: 'Anónimo' },
      { texto: `Real improvement is based on data and willingness.`, autor: 'Anónimo' },
      { texto: `Don't confuse volume with value.`, autor: 'Anónimo' },
      { texto: `Build the routine that will keep you moving forward on difficult days.`, autor: 'Anónimo' },
      { texto: `Strategic patience is a powerful form of audacity.`, autor: 'Anónimo' },
      { texto: `Keep curiosity alive and possibilities will grow.`, autor: 'Anónimo' },
      { texto: `Do what you can today so that future effort is less.`, autor: 'Anónimo' },
      { texto: `Personal responsibility is the foundation of collective respect.`, autor: 'Anónimo' },
      { texto: `Mind your words; they define your agreements and your relationships.`, autor: 'Anónimo' },
      { texto: `The most valuable learning is the one that changes your behavior.`, autor: 'Anónimo' }
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
    adminStatus.innerHTML = "<span style='color:green'>Modo admin activado ✅</span>";
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
        <div class="resumen"><em>Generando resumen...</em></div>
        <a class="enlace" href="${url}" target="_blank" rel="noopener">Leer más</a>
        <button class="regenerar-btn" style="display:none;">Regenerar</button>
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















