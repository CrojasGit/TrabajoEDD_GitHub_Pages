const allowedOrigin = "https://crojasgit.github.io";
const apiKey = Deno.env.get("TU_API_KEY");
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verificar origen
  if (origin !== allowedOrigin) {
    console.log("Origen no permitido:", origin);
    return new Response("Acceso denegado", { status: 403, headers: corsHeaders });
  }

  // Solo POST
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405, headers: corsHeaders });
  }

  try {
    const text = await req.text();
    console.log("📩 Cuerpo recibido:", text);

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      console.error("❌ Error: cuerpo JSON inválido");
      return new Response(JSON.stringify({ error: "Cuerpo JSON inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const dataText = await response.text();

    console.log("📤 Respuesta de Gemini:", dataText);

    return new Response(dataText, {
      status: response.status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("💥 Error en el worker:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
