export default {
	async fetch(request, env) {
	  const allowedOrigin = "https://crojasgit.github.io";
	  const apiKey = env.NEWSAPI_KEY;
	  const apiUrl = "https://newsapi.org/v2/top-headlines";
  
	  const origin = request.headers.get("Origin");
	  if (origin !== allowedOrigin) {
		return new Response("Acceso denegado", { status: 403 });
	  }
  
	  const corsHeaders = {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	  };
  
	  if (request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	  }
  
	  try {
		const body = await request.json();
		const categoria = body.categoria || "technology";
  
		// --- PRIMER INTENTO: España ---
		let url = `${apiUrl}?country=en&category=${categoria}&pageSize=10&apiKey=${apiKey}`;
  
		let response = await fetch(url, {
		  headers: {
			"User-Agent": "CloudflareWorker/NewsApp (https://crojasgit.github.io)",
		  },
		});
  
		let data = await response.json();
  
		// --- Si no hay resultados, intento global en inglés ---
		if (!data.articles || data.articles.length === 0) {
		  const fallbackUrl = `${apiUrl}?category=${categoria}&language=en&pageSize=19&apiKey=${apiKey}`;
		  response = await fetch(fallbackUrl, {
			headers: {
			  "User-Agent": "CloudflareWorker/NewsApp (https://crojasgit.github.io)",
			},
		  });
		  data = await response.json();
		}
  
		return new Response(JSON.stringify(data), {
		  status: 200,
		  headers: {
			"Content-Type": "application/json",
			...corsHeaders,
		  },
		});
  
	  } catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: corsHeaders,
		});
	  }
	},
  };
  
