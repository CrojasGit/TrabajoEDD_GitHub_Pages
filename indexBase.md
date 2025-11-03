
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Noticias Tecnología</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Noticias de Tecnología</h1>
  <span id="fecha"></span>

  <!-- Frase del día -->
  <div id="fraseDia">
    <span id="textoFrase">Cargando frase del día...</span>
    <span id="autorFrase"></span>
  </div>

  <!-- Panel administrador -->
  <div id="adminPanel">
    <button id="adminButton">Modo Admin</button>
    <div id="passwordInput" style="display:none;">
      <input type="password" id="adminPass" placeholder="Contraseña">
      <button id="loginButton">Entrar</button>
    </div>
    <div id="adminStatus"></div>
  </div>

  <!-- Contenedor de noticias -->
  <div id="noticias">
    <div id="n1" class="noticia"></div>
    <div id="n2" class="noticia"></div>
    <div id="n3" class="noticia"></div>
    <div id="n4" class="noticia"></div>
    <div id="n5" class="noticia"></div>
    <div id="n6" class="noticia" style="display:none;"></div>
    <div id="n7" class="noticia" style="display:none;"></div>
    <div id="n8" class="noticia" style="display:none;"></div>
    <div id="n9" class="noticia" style="display:none;"></div>
    <div id="n10" class="noticia" style="display:none;"></div>
    <div id="n11" class="noticia" style="display:none;"></div>
    <div id="n12" class="noticia" style="display:none;"></div>
    <div id="n13" class="noticia" style="display:none;"></div>
    <div id="n14" class="noticia" style="display:none;"></div>
    <div id="n15" class="noticia" style="display:none;"></div>
    <div id="n16" class="noticia" style="display:none;"></div>
    <div id="n17" class="noticia" style="display:none;"></div>
    <div id="n18" class="noticia" style="display:none;"></div>
  </div>

  <script src="noticiasIA.js"></script>
</body>
</html>
