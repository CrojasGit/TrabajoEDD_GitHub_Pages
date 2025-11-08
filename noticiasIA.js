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
document.getElementById('fecha').textContent = new Date().toLocaleDateString('es-ES',{
  weekday:'long',day:'2-digit',month:'long',year:'numeric'
});

// === Frases del año ===
const frasesDelAno = [
      { texto: `Comienza cada día con la intención de avanzar un paso, por pequeño que sea.`, autor: 'Anónimo' },
      { texto: `La curiosidad es la chispa que enciende cualquier descubrimiento.`, autor: 'Anónimo' },
      { texto: `No confundas el movimiento con el progreso; actúa con propósito.`, autor: 'Anónimo' },
      { texto: `A veces el mejor plan es adaptarse con creatividad a lo inesperado.`, autor: 'Anónimo' },
      { texto: `Aprender algo nuevo cada día es invertir en tu libertad.`, autor: 'Anónimo' },
      { texto: `Las ideas valen poco sin la valentía de llevarlas a la práctica.`, autor: 'Anónimo' },
      { texto: `Escucha más preguntas que respuestas y crecerás.`, autor: 'Anónimo' },
      { texto: `La consistencia vence al talento cuando el talento no trabaja.`, autor: 'Anónimo' },
      { texto: `Un error bien analizado es la semilla de una mejora.`, autor: 'Anónimo' },
      { texto: `Haz lo necesario hoy para agradecerte mañana.`, autor: 'Anónimo' },
      { texto: `La tecnología amplifica la intención: ponla al servicio de lo útil.`, autor: 'Anónimo' },
      { texto: `No subestimes el poder de un descanso bien aprovechado.`, autor: 'Anónimo' },
      { texto: `La creatividad nace cuando aceptas límites y juegas con ellos.`, autor: 'Anónimo' },
      { texto: `Pide feedback y actúa: la mejora no llega por casualidad.`, autor: 'Anónimo' },
      { texto: `Las grandes soluciones suelen ser las más simples.`, autor: 'Anónimo' },
      { texto: `Si dudas entre dos caminos, elige el que te enseñe más.`, autor: 'Anónimo' },
      { texto: `La paciencia activa es construir sin ver el resultado inmediato.`, autor: 'Anónimo' },
      { texto: `Comparte lo que sabes; enseñar es aprender dos veces.`, autor: 'Anónimo' },
      { texto: `Las pequeñas victorias de hoy alimentan los grandes triunfos de mañana.`, autor: 'Anónimo' },
      { texto: `Acepta la crítica útil; rechaza la que limita sin fundamento.`, autor: 'Anónimo' },
      { texto: `La responsabilidad empieza por cumplir con lo que dices que harás.`, autor: 'Anónimo' },
      { texto: `Tu atención es un recurso escaso: invierte en lo que importa.`, autor: 'Anónimo' },
      { texto: `El optimismo activo busca soluciones, no excusas.`, autor: 'Anónimo' },
      { texto: `Cuando subes el listón, aparecerán nuevas capacidades.`, autor: 'Anónimo' },
      { texto: `Cuida las relaciones; son la infraestructura del bienestar.`, autor: 'Anónimo' },
      { texto: `Resuelve hoy lo que te quita energía para poder crear mañana.`, autor: 'Anónimo' },
      { texto: `El hábito de preguntar "¿por qué?" te hace distinto y mejor informado.`, autor: 'Anónimo' },
      { texto: `La esencia de aprender es cambiar de opinión cuando hay razones.`, autor: 'Anónimo' },
      { texto: `El riesgo calculado abre puertas; la inacción las cierra.`, autor: 'Anónimo' },
      { texto: `No buscas perfección, buscas progreso que se sostenga en el tiempo.`, autor: 'Anónimo' },
      { texto: `La disciplina no es castigo; es la estructura de la libertad.`, autor: 'Anónimo' },
      { texto: `Ser eficaz implica decir 'no' a lo que distrae.`, autor: 'Anónimo' },
      { texto: `El respeto hacia otros comienza por el respeto a tus propios límites.`, autor: 'Anónimo' },
      { texto: `La audacia muchas veces sólo exige dar el primer paso.`, autor: 'Anónimo' },
      { texto: `La atención plena convierte lo cotidiano en experiencia.`, autor: 'Anónimo' },
      { texto: `Cuando fallas, recopila datos, no culpas.`, autor: 'Anónimo' },
      { texto: `La gratitud transforma lo que tenemos en suficiente.`, autor: 'Anónimo' },
      { texto: `Menos ruido, más trabajo con sentido.`, autor: 'Anónimo' },
      { texto: `No esperes permiso para mejorar algo que depende de ti.`, autor: 'Anónimo' },
      { texto: `Una buena pregunta vale más que una respuesta rápida.`, autor: 'Anónimo' },
      { texto: `La imparcialidad intelectual es el suelo de ideas valiosas.`, autor: 'Anónimo' },
      { texto: `Lo que hoy te parece difícil será mañana costumbre si persistes.`, autor: 'Anónimo' },
      { texto: `Cultiva el asombro; es fuente de motivación continua.`, autor: 'Anónimo' },
      { texto: `La claridad es un acto de generosidad hacia los demás.`, autor: 'Anónimo' },
      { texto: `Charlas bien hechas producen acciones reales.`, autor: 'Anónimo' },
      { texto: `La humildad no niega capacidades; permite aprender más.`, autor: 'Anónimo' },
      { texto: `Transforma las quejas en problemas a resolver.`, autor: 'Anónimo' },
      { texto: `El tiempo es el juez más honesto de tus prioridades.`, autor: 'Anónimo' },
      { texto: `No confundas velocidad con dirección.`, autor: 'Anónimo' },
      { texto: `Lo esencial rara vez es ruidoso; obsérvalo con atención.`, autor: 'Anónimo' },
      { texto: `Permítete equivocarte, pero no te permitas no aprender.`, autor: 'Anónimo' },
      { texto: `La creatividad se alimenta de curiosidad y paciencia.`, autor: 'Anónimo' },
      { texto: `La coherencia entre palabra y acto es reputación a largo plazo.`, autor: 'Anónimo' },
      { texto: `Si no sabes por dónde empezar, empieza por ordenar.`, autor: 'Anónimo' },
      { texto: `El buen diseño resuelve problemas y simplifica vidas.`, autor: 'Anónimo' },
      { texto: `Reinventa tus fracasos como información útil.`, autor: 'Anónimo' },
      { texto: `La humildad intelectual es la base del aprendizaje continuo.`, autor: 'Anónimo' },
      { texto: `La mejor pregunta muchas veces es "¿qué problema estoy resolviendo?"`, autor: 'Anónimo' },
      { texto: `Construye hábitos que te acerquen a lo que deseas ser.`, autor: 'Anónimo' },
      { texto: `No te compares con la foto de la cima; cada uno tiene su camino.`, autor: 'Anónimo' },
      { texto: `Cuida tu entorno: afecta tu productividad y tu ánimo.`, autor: 'Anónimo' },
      { texto: `La constancia multiplica el talento.`, autor: 'Anónimo' },
      { texto: `Regala tiempo: es el recurso más valioso que puedes dar.`, autor: 'Anónimo' },
      { texto: `La responsabilidad no pesa si la compartes con claridad.`, autor: 'Anónimo' },
      { texto: `Siembra curiosidad y cosecharás innovación.`, autor: 'Anónimo' },
      { texto: `El éxito suele llegar a quien resuelve lo que otros evitan.`, autor: 'Anónimo' },
      { texto: `Aprende a descansar sin culpa; tu rendimiento te lo agradecerá.`, autor: 'Anónimo' },
      { texto: `Funciona mejor aquello que puedes sostener con constancia.`, autor: 'Anónimo' },
      { texto: `Las grandes ideas necesitan tiempo para madurar.`, autor: 'Anónimo' },
      { texto: `La simplicidad no es trivial; requiere trabajo y criterio.`, autor: 'Anónimo' },
      { texto: `No permitas que el miedo decida por ti; actúa con juicio.`, autor: 'Anónimo' },
      { texto: `La eficacia es hacer lo necesario; la eficiencia, hacerlo bien.`, autor: 'Anónimo' },
      { texto: `Cuida tu curiosidad como si fuera una planta rara.`, autor: 'Anónimo' },
      { texto: `Cada día ofrece una oportunidad para corregir el rumbo.`, autor: 'Anónimo' },
      { texto: `Un buen plan no teme a la flexibilidad.`, autor: 'Anónimo' },
      { texto: `Siembra disciplina y cosecharás opciones.`, autor: 'Anónimo' },
      { texto: `La cooperación multiplica los resultados individuales.`, autor: 'Anónimo' },
      { texto: `No confundas humildad con ausencia de ambición.`, autor: 'Anónimo' },
      { texto: `Sé claro con tus prioridades y el resto encajará.`, autor: 'Anónimo' },
      { texto: `La paciencia con el proceso trae frutos inesperados.`, autor: 'Anónimo' },
      { texto: `La perseverancia a menudo vence a la inspiración pasajera.`, autor: 'Anónimo' },
      { texto: `Transforma la incertidumbre en curiosidad operativa.`, autor: 'Anónimo' },
      { texto: `Valora más el aprendizaje que la aprobación inmediata.`, autor: 'Anónimo' },
      { texto: `La humildad para escuchar es la base del liderazgo.`, autor: 'Anónimo' },
      { texto: `Aprende a priorizar lo que aporta el mayor valor.`, autor: 'Anónimo' },
      { texto: `El ingenio aparece cuando el plan falla y adaptas.`, autor: 'Anónimo' },
      { texto: `No postergues por perfección lo que podrías mejorar iterando.`, autor: 'Anónimo' },
      { texto: `El autocontrol es la llave que abre la disciplina.`, autor: 'Anónimo' },
      { texto: `La claridad mental se consigue con hábitos sólidos.`, autor: 'Anónimo' },
      { texto: `Mide para mejorar; lo que no se mide, no progresa.`, autor: 'Anónimo' },
      { texto: `Haz las preguntas que nadie hace y encontrarás respuestas valiosas.`, autor: 'Anónimo' },
      { texto: `El aprecio sincero alimenta relaciones duraderas.`, autor: 'Anónimo' },
      { texto: `La coherencia produce confianza; la confianza produce libertad.`, autor: 'Anónimo' },
      { texto: `No temas borrar lo que ya no sirve; es parte de crear.`, autor: 'Anónimo' },
      { texto: `Sé más curioso que crítico al evaluar ideas nuevas.`, autor: 'Anónimo' },
      { texto: `Confía en el proceso, ajusta la técnica.`, autor: 'Anónimo' },
      { texto: `El buen juicio nace de la experiencia y del estudio.`, autor: 'Anónimo' },
      { texto: `La disciplina sostenida te hace invencible frente a la distracción.`, autor: 'Anónimo' },
      { texto: `La excelencia es un hábito cotidiano, no un acto heroico.`, autor: 'Anónimo' },
      { texto: `La creatividad prospera en límites claros.`, autor: 'Anónimo' },
      { texto: `La modestia facilita aprender de quien sabe.`, autor: 'Anónimo' },
      { texto: `Siembra ideas, cosecha oportunidades.`, autor: 'Anónimo' },
      { texto: `El foco no es excluir, es elegir con intención.`, autor: 'Anónimo' },
      { texto: `Construye sistemas que hagan que el trabajo bueno sea el más fácil.`, autor: 'Anónimo' },
      { texto: `Sé curioso sobre tus propias suposiciones.`, autor: 'Anónimo' },
      { texto: `El pequeño progreso diario vence al gran esfuerzo esporádico.`, autor: 'Anónimo' },
      { texto: `Aprecia el proceso tanto como el resultado.`, autor: 'Anónimo' },
      { texto: `La resiliencia se entrena con pequeñas dificultades asumidas.`, autor: 'Anónimo' },
      { texto: `Respeta tu tiempo: es el capital más personal que tienes.`, autor: 'Anónimo' },
      { texto: `La buena comunicación reduce la necesidad de corrección.`, autor: 'Anónimo' },
      { texto: `Ser diligente hoy evita problemas mañana.`, autor: 'Anónimo' },
      { texto: `No subestimes las pausas estratégicas; clarifican decisiones.`, autor: 'Anónimo' },
      { texto: `Actúa según principios, no según estados de ánimo.`, autor: 'Anónimo' },
      { texto: `La adaptabilidad es competitividad en entornos cambiantes.`, autor: 'Anónimo' },
      { texto: `Comparte mérito y carga; así se construyen equipos fuertes.`, autor: 'Anónimo' },
      { texto: `El pensamiento crítico es una herramienta para cuidar la verdad.`, autor: 'Anónimo' },
      { texto: `La energía bien dirigida produce resultados consistentes.`, autor: 'Anónimo' },
      { texto: `No todo lo urgente es importante; aprende a distinguir.`, autor: 'Anónimo' },
      { texto: `La claridad de propósito filtra lo irrelevante.`, autor: 'Anónimo' },
      { texto: `Invierte tiempo en entender antes de intentar cambiar algo.`, autor: 'Anónimo' },
      { texto: `Convierte la curiosidad en experimentos controlados.`, autor: 'Anónimo' },
      { texto: `Agradece lo que funciona y mejora lo que no.`, autor: 'Anónimo' },
      { texto: `Las preguntas correctas simplifican problemas complejos.`, autor: 'Anónimo' },
      { texto: `Cuando sepas exactamente qué buscas, lo encontrarás más rápido.`, autor: 'Anónimo' },
      { texto: `La cultura de aprendizaje sostiene el progreso colectivo.`, autor: 'Anónimo' },
      { texto: `El entusiasmo sin disciplina se consume pronto.`, autor: 'Anónimo' },
      { texto: `Busca evidencia antes de aceptar certezas convenientes.`, autor: 'Anónimo' },
      { texto: `Los límites claros fomentan la creatividad dentro de ellos.`, autor: 'Anónimo' },
      { texto: `Un buen hábito vence a una buena idea olvidada.`, autor: 'Anónimo' },
      { texto: `No sacrifiques lo importante por lo urgente.`, autor: 'Anónimo' },
      { texto: `El talento se potencia con trabajo enfocado.`, autor: 'Anónimo' },
      { texto: `Piensa en términos de sistemas, no solo de acciones aisladas.`, autor: 'Anónimo' },
      { texto: `Aprovecha el silencio para escuchar tu mejor idea.`, autor: 'Anónimo' },
      { texto: `El liderazgo empieza por gestionar bien lo propio.`, autor: 'Anónimo' },
      { texto: `Divide lo grande en tareas que puedas empezar hoy.`, autor: 'Anónimo' },
      { texto: `La autocrítica sirve si se traduce en mejora.`, autor: 'Anónimo' },
      { texto: `Cuando pierdes tiempo en lo que no importa, pierdes oportunidades.`, autor: 'Anónimo' },
      { texto: `Haz las cosas difíciles cuando tengas energía; deja las rutinarias para después.`, autor: 'Anónimo' },
      { texto: `La constancia crea identidad; la identidad crea hábitos.`, autor: 'Anónimo' },
      { texto: `Aprende a cerrar ciclos para abrir nuevos proyectos.`, autor: 'Anónimo' },
      { texto: `Los problemas complejos piden pasos simples y repetidos.`, autor: 'Anónimo' },
      { texto: `A veces avanzar es renunciar a una buena opción por una mejor.`, autor: 'Anónimo' },
      { texto: `El valor real aparece cuando actúas pese al miedo.`, autor: 'Anónimo' },
      { texto: `Rodéate de gente que te rete a mejorar.`, autor: 'Anónimo' },
      { texto: `La curiosidad sostenida produce expertos inesperados.`, autor: 'Anónimo' },
      { texto: `No confundas ocupación con productividad.`, autor: 'Anónimo' },
      { texto: `La claridad de objetivos ahorra decisiones inútiles.`, autor: 'Anónimo' },
      { texto: `Saber priorizar es el superpoder de la efectividad.`, autor: 'Anónimo' },
      { texto: `La disciplina es el arte de hacer lo que debe hacerse aunque no apetezca.`, autor: 'Anónimo' },
      { texto: `Un día con intención vence a una semana sin foco.`, autor: 'Anónimo' },
      { texto: `Cultiva la paciencia aplicada: espera y actúa con criterio.`, autor: 'Anónimo' },
      { texto: `El feedback sincero es un regalo disfrazado de incomodidad.`, autor: 'Anónimo' },
      { texto: `La humildad no quita autoridad; la refuerza cuando es real.`, autor: 'Anónimo' },
      { texto: `Aprovecha los errores como datos, no como etiquetas.`, autor: 'Anónimo' },
      { texto: `Lo pequeño bien hecho produce grandes efectos con el tiempo.`, autor: 'Anónimo' },
      { texto: `La excelencia se construye evitando atajos dañinos.`, autor: 'Anónimo' },
      { texto: `Sé curioso sobre tus límites y busca expandirlos con técnica.`, autor: 'Anónimo' },
      { texto: `Invierte en hábitos que te permitan autodirigirte.`, autor: 'Anónimo' },
      { texto: `El coraje es persistir cuando lo cómodo te empuja a renunciar.`, autor: 'Anónimo' },
      { texto: `Fomenta la claridad: reduce dudas y acelera decisiones.`, autor: 'Anónimo' },
      { texto: `Saber escuchar es ganar tiempo y conocimiento.`, autor: 'Anónimo' },
      { texto: `El trabajo bien organizado es más eficiente que el trabajo frenético.`, autor: 'Anónimo' },
      { texto: `Sé responsable con tu palabra, más allá de la intención.`, autor: 'Anónimo' },
      { texto: `El aprendizaje útil es el que puedes aplicar mañana.`, autor: 'Anónimo' },
      { texto: `La disciplina diaria supera a los grandes esfuerzos ocasionales.`, autor: 'Anónimo' },
      { texto: `Haz menos, pero mejor: calidad sobre cantidad.`, autor: 'Anónimo' },
      { texto: `La innovación no nace sin curiosidad sostenida.`, autor: 'Anónimo' },
      { texto: `El mejor proyecto es el que puedes terminar y mejorar.`, autor: 'Anónimo' },
      { texto: `No pierdas la perspectiva por ocuparte del detalle sin sentido.`, autor: 'Anónimo' },
      { texto: `La resiliencia no es endurecerse, es aprender a recuperarse mejor.`, autor: 'Anónimo' },
      { texto: `Planifica poco, ejecuta mucho, ajusta siempre.`, autor: 'Anónimo' },
      { texto: `El orden externo facilita el orden mental.`, autor: 'Anónimo' },
      { texto: `Busca el progreso, no la perfección inmediata.`, autor: 'Anónimo' },
      { texto: `La constancia inteligente produce resultados sostenibles.`, autor: 'Anónimo' },
      { texto: `Aprende a distinguir entre ruido y señal.`, autor: 'Anónimo' },
      { texto: `El tiempo dedicado a pensar bien ahorra trabajo después.`, autor: 'Anónimo' },
      { texto: `Elige proyectos que te permitan aprender y aportar.`, autor: 'Anónimo' },
      { texto: `Un equipo con buen hábito supera a uno con talento desorganizado.`, autor: 'Anónimo' },
      { texto: `La modestia frente al aprendizaje acelera la mejora.`, autor: 'Anónimo' },
      { texto: `La mejor inversión es la que te hace más capaz.`, autor: 'Anónimo' },
      { texto: `Cuando dudas, prueba: la acción aclara más que la suposición.`, autor: 'Anónimo' },
      { texto: `Simplifica procesos para que lo bueno se repita.`, autor: 'Anónimo' },
      { texto: `Sigue mejorando la interfaz entre tus ideas y el mundo.`, autor: 'Anónimo' },
      { texto: `El esfuerzo sostenido hace que lo difícil se vuelva normal.`, autor: 'Anónimo' },
      { texto: `El optimismo pragmático combina esperanza con trabajo.`, autor: 'Anónimo' },
      { texto: `La disciplina tiene recompensas silenciosas pero duraderas.`, autor: 'Anónimo' },
      { texto: `No todo cambio es progreso; evalúa su dirección.`, autor: 'Anónimo' },
      { texto: `El conocimiento sin aplicación es como una semilla sin tierra.`, autor: 'Anónimo' },
      { texto: `Celebra los avances pequeños; construyen momentum.`, autor: 'Anónimo' },
      { texto: `La perspectiva amplia evita soluciones cortoplacistas.`, autor: 'Anónimo' },
      { texto: `Afronta lo importante aunque no sea urgente.`, autor: 'Anónimo' },
      { texto: `La curiosidad humilde multiplica las posibilidades.`, autor: 'Anónimo' },
      { texto: `Transforma las ideas en acciones y las acciones en hábito.`, autor: 'Anónimo' },
      { texto: `La consistencia crea identidad: sé quien quieres ser cada día.`, autor: 'Anónimo' },
      { texto: `No confundas la actividad frenética con significado.`, autor: 'Anónimo' },
      { texto: `La reflexión breve y frecuente mejora la toma de decisiones.`, autor: 'Anónimo' },
      { texto: `A veces menos opciones producen mejores decisiones.`, autor: 'Anónimo' },
      { texto: `La disciplina comienza por pequeñas renuncias hechas con sentido.`, autor: 'Anónimo' },
      { texto: `Guarda tiempo para pensar; las soluciones suelen aparecer allí.`, autor: 'Anónimo' },
      { texto: `Construye hábitos que te protejan de la inercia.`, autor: 'Anónimo' },
      { texto: `Si quieres resultados distintos, prueba acciones distintas.`, autor: 'Anónimo' },
      { texto: `El buen juicio es la combinación de experiencia y humildad.`, autor: 'Anónimo' },
      { texto: `Acepta la incomodidad temporal si sirve a un objetivo claro.`, autor: 'Anónimo' },
      { texto: `La sinceridad útil prioriza soluciones sobre justificaciones.`, autor: 'Anónimo' },
      { texto: `Aprende a medir lo que realmente importa.`, autor: 'Anónimo' },
      { texto: `La actitud proactiva abre puertas que la espera cierra.`, autor: 'Anónimo' },
      { texto: `Trabaja en lo que multiplica tu impacto, no solo en lo que te ocupa.`, autor: 'Anónimo' },
      { texto: `El esfuerzo constante vence a la inspiración errática.`, autor: 'Anónimo' },
      { texto: `La claridad de metas corta la fatiga decisional.`, autor: 'Anónimo' },
      { texto: `Cuida tu entorno: es el espejo de tus prioridades.`, autor: 'Anónimo' },
      { texto: `Saber cuándo pausar es tan valioso como saber cuándo acelerar.`, autor: 'Anónimo' },
      { texto: `La humildad para aprender y la valentía para ejecutar forman un buen equilibrio.`, autor: 'Anónimo' },
      { texto: `No subestimes la fuerza de un buen hábito repetido.`, autor: 'Anónimo' },
      { texto: `Resuelve primero lo que te quita energía; el resto será más claro.`, autor: 'Anónimo' },
      { texto: `Siembra orden y recogerás eficiencia.`, autor: 'Anónimo' },
      { texto: `La disciplina bien dirigida produce libertad real.`, autor: 'Anónimo' },
      { texto: `El liderazgo práctico se nota en decisiones pequeñas repetidas.`, autor: 'Anónimo' },
      { texto: `Actúa con intención y evita la improvisación crónica.`, autor: 'Anónimo' },
      { texto: `Piensa en términos de impacto, no de actividad.`, autor: 'Anónimo' },
      { texto: `Una pregunta honesta vale más que una respuesta complaciente.`, autor: 'Anónimo' },
      { texto: `Haz lo que puedas hoy para no cargar con arrepentimientos mañana.`, autor: 'Anónimo' },
      { texto: `La constancia inteligente vence al talento desordenado.`, autor: 'Anónimo' },
      { texto: `No confíes solo en la motivación; construye sistemas.`, autor: 'Anónimo' },
      { texto: `Dedica tiempo a pensar la estrategia, no solo la táctica.`, autor: 'Anónimo' },
      { texto: `La mejor inversión es la que aumenta tu capacidad de tomar decisiones.`, autor: 'Anónimo' },
      { texto: `Practica el arte de terminar lo que empiezas.`, autor: 'Anónimo' },
      { texto: `Los límites bien puestos generan más creatividad.`, autor: 'Anónimo' },
      { texto: `Aprende a iterar: prueba, mide, corrige, repite.`, autor: 'Anónimo' },
      { texto: `El respeto por el tiempo ajeno es respeto por el trabajo.`, autor: 'Anónimo' },
      { texto: `La claridad en las expectativas evita esfuerzos desperdiciados.`, autor: 'Anónimo' },
      { texto: `La excelencia se logra cuidando los detalles relevantes.`, autor: 'Anónimo' },
      { texto: `Transforma la incomodidad en indicador de aprendizaje.`, autor: 'Anónimo' },
      { texto: `Si no avanzas, cambia la estrategia, no la esperanza.`, autor: 'Anónimo' },
      { texto: `La disciplina empieza por pequeñas acciones repetidas sin testigos.`, autor: 'Anónimo' },
      { texto: `Agradece los errores: te están mostrando cómo mejorar.`, autor: 'Anónimo' },
      { texto: `Lo que mantienes con constancia se vuelve tu identidad.`, autor: 'Anónimo' },
      { texto: `No evites la dificultad; aprovéchala para entrenar tu resiliencia.`, autor: 'Anónimo' },
      { texto: `Actúa hoy para que el mañana te encuentre preparado.`, autor: 'Anónimo' },
      { texto: `Haz menos promesas y más entregas.`, autor: 'Anónimo' },
      { texto: `La curiosidad aplicada crea ventajas competitivas.`, autor: 'Anónimo' },
      { texto: `Cuida tus hábitos: son las piezas con las que construirás tu vida.`, autor: 'Anónimo' },
      { texto: `El progreso verdadero es el que puedes sostener en el tiempo.`, autor: 'Anónimo' },
      { texto: `Prioriza la claridad sobre el brillo momentáneo.`, autor: 'Anónimo' },
      { texto: `Aprende a dividir problemas grandes en tareas pequeñas y accionables.`, autor: 'Anónimo' },
      { texto: `La auténtica libertad aparece cuando dominas lo que puedes controlar.`, autor: 'Anónimo' },
      { texto: `La reflexión honesta es la mejor brújula para mejorar.`, autor: 'Anónimo' },
      { texto: `Actúa con intención, no por inercia.`, autor: 'Anónimo' },
      { texto: `La práctica deliberada crea maestría en cualquier área.`, autor: 'Anónimo' },
      { texto: `Resuelve primero lo que te impide avanzar.`, autor: 'Anónimo' },
      { texto: `El tiempo invertido en aprender es tiempo que nadie puede quitarte.`, autor: 'Anónimo' },
      { texto: `La creatividad requiere disciplina para materializar ideas.`, autor: 'Anónimo' },
      { texto: `No confundas humildad con incapacidad para decidir.`, autor: 'Anónimo' },
      { texto: `La mejora continua viene de revisar con honestidad tus procesos.`, autor: 'Anónimo' },
      { texto: `El conocimiento aplicado vale más que el conocimiento acumulado.`, autor: 'Anónimo' },
      { texto: `Mantén tus objetivos visibles; la atención se fatiga sin recordatorios.`, autor: 'Anónimo' },
      { texto: `La consistencia no es sexy, pero gana a largo plazo.`, autor: 'Anónimo' },
      { texto: `No temas cambiar de opinión ante mejores datos.`, autor: 'Anónimo' },
      { texto: `El autocuidado es una inversión que permite rendir mejor.`, autor: 'Anónimo' },
      { texto: `Entrega resultados que hablen por tu esfuerzo.`, autor: 'Anónimo' },
      { texto: `Cuando tengas dudas, experimenta con pequeñas pruebas.`, autor: 'Anónimo' },
      { texto: `Apuesta por lo que mejora a las personas, no solo a las métricas.`, autor: 'Anónimo' },
      { texto: `La disciplina es el combustible de la libertad futura.`, autor: 'Anónimo' },
      { texto: `Valora la coherencia entre intención y acción.`, autor: 'Anónimo' },
      { texto: `Organiza tu día en bloques enfocados y protégelos.`, autor: 'Anónimo' },
      { texto: `Sé curioso sobre tus resultados: ellos te enseñan el camino.`, autor: 'Anónimo' },
      { texto: `El trabajo inteligente combina prioridad y ejecución.`, autor: 'Anónimo' },
      { texto: `Aprende a diferenciar entre consejo y responsabilidad propia.`, autor: 'Anónimo' },
      { texto: `La mejora real se basa en datos y voluntad.`, autor: 'Anónimo' },
      { texto: `No confundas volumen con valor.`, autor: 'Anónimo' },
      { texto: `Construye la rutina que te haga avanzar los días difíciles.`, autor: 'Anónimo' },
      { texto: `La paciencia estratégica es una forma poderosa de audacia.`, autor: 'Anónimo' },
      { texto: `Mantén la curiosidad viva y las posibilidades crecerán.`, autor: 'Anónimo' },
      { texto: `Haz lo que puedas hoy para que el esfuerzo futuro sea menor.`, autor: 'Anónimo' },
      { texto: `La responsabilidad personal es la base del respeto colectivo.`, autor: 'Anónimo' },
      { texto: `Cuida tus palabras; definen tus acuerdos y tus relaciones.`, autor: 'Anónimo' },
      { texto: `El aprendizaje más valioso es el que cambia tu comportamiento.`, autor: 'Anónimo' }
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











