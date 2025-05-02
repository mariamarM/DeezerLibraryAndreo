//esto es el scroll horizontal con la ruedecita chiquitna del mouse tal 
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("cancionesDeezer");


});
//aqui empieza la vaina de la busqueda de las canciones hay q comentarla cuando estas en registros

const formBusqueda = document.getElementById('formBusqueda');
if (formBusqueda) {
  formBusqueda.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreBanda").value;
    const resultado = document.getElementById("cancionesDeezer");
    resultado.textContent = "";

    if (nombre === "") {
      resultado.style.color = "red";
      resultado.textContent = "Write the name of the band or artist.";
      return;
    }

    buscarCanciones(nombre);
  });

}


//esto es la busqueda del index.html
function buscarCanciones(nombre) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(nombre)}`;
  const resultado = document.getElementById("cancionesDeezer");

  fetch(`https://corsproxy.io/?${url}`)
    .then((response) => response.json())
    .then((data) => {
      const resultados = data.data;


      if (resultados.length == 0) {
        resultado.textContent = "🚫 We don't know any song with this name.";
        resultado.style.color = "red";

        return;
      }
      resultado.style.overflow = "scroll";
      resultado.innerHTML = resultados
        .slice(0, 4)
        .map((song) => `
            <div class="cancionSingular">
            <img id="imagen" src="${song.artist.picture_small}" alt="iagen Pequeña de la cancion XS">
              <h2 id ="nombreArtista">${song.title}</h2>
              <h3>${song.artist.name}</h3>
              <audio controls data-song='${JSON.stringify(song)}'>//id="audioControls"
                <source src="${song.preview}">
              </audio>
            </div>
          `)
        .join("");
      resultado.style.overflowX = "scroll";
      if (resultado) {
        resultado.addEventListener("wheel", (e) => {
          e.preventDefault();
          resultado.scrollLeft += e.deltaY;
        });
      }
      const audios = resultado.querySelectorAll("audio");
      audios.forEach((audio) => {
        audio.addEventListener("play", () => {
          const songData = JSON.parse(audio.getAttribute("data-song"));

          const cancionReproducida = {
            title: songData.title,
            artist: songData.artist.name,
            album: songData.album.title,
            preview: songData.preview,
            image: songData.album.cover_medium
          };


          let cancionesGuardadas = JSON.parse(localStorage.getItem("cancionesReproducidas")) || [];
          cancionesGuardadas.push(cancionReproducida);
          localStorage.setItem("cancionesReproducidas", JSON.stringify(cancionesGuardadas));

          alert(" Song has been saved");
        });
      });
    })
    .catch((error) => {
      console.error("Error al buscar la canción", error);
      document.getElementById("cancionesDeezer").textContent = "Can't upload the song. Check your network connection.";
    });
}

//REGISTERS
// function guardarRegistros(){
//   let guardarlosDatos = [];
//   let nombreCancionLS = localStorage.getItem('nombreBanda');
//   document.getElementById('nombreBanda').value = nombreCancionLS;

//   let nombreArtistaLS = localStorage.getItem('nombreArtista');
//   document.getElementById('nombreArtista').value = nombreArtistaLS;

//   let duracion = audio.duration;
//   let duracionCancionLS = localStorage.setItem('audioControls', duracion.toString());

//   document.getElementById('audioControls').value = duracionCancionLS;

//   localStorage.setItem('nombreDelArtista', nombreArtistaLS);
//   localStorage.setItem('nombreDeLaCancion', nombreCancionLS);

//   guardarlosDatos.JSONparse(nombreCancionLS,nombreArtistaLS, duracionCancionLS);
//   guardarlosDatos.forEach();

// }

//localstorage 2 en la practica
// aqui se pondran como todas las canciones que se registren pues iran aqui
document.addEventListener("DOMContentLoaded", () => {
  const filtroTipo = document.getElementById("filtro-tipo");
  const contenedorRegistros = document.getElementById("allSongs");

  let canciones = JSON.parse(localStorage.getItem("cancionesReproducidas"));
  if (!canciones || !Array.isArray(canciones)) {
    console.warn("No hay canciones en localStorage");
    return;
  }

  const generos = ["reggae", "jazz", "pop", "electro", "rap", "indie"];
  canciones.forEach((cancion, indice) => {
    cancion.tipo = generos[indice % generos.length];
  });


  if (contenedorRegistros) {
    mostrarCanciones(canciones);
  }


  function mostrarCanciones(lista) {

    contenedorRegistros.innerHTML = " ";
    lista.forEach((song) => {
      contenedorRegistros.innerHTML += `
      <div class="cancionSingular">
        <img src="${song.image}" alt="${song.title} album cover">
        <h2>${song.title}</h2>
        <h3>${song.artist}</h3>
        <h4>Album: ${song.album}</h4>
        
        <audio controls>
          <source src="${song.preview}">
        </audio>
      </div>
    `;
    });
  }

  mostrarCanciones(canciones);

  filtroTipo.addEventListener("change", () => {
    const tipoSeleccionado = filtroTipo.value;
    contenedorRegistros.innerHTML = " ";

    let cancionesFiltradas = [];
    // const filtradas = tipoSeleccionado === "todos"
    // ? canciones
    // : canciones.filter(c => c.tipo === tipoSeleccionado);
    //esto es como el if mas simplificado osea es una constante que siempre sera igual
    //el ? es como si es diferente a eso que tiposeleccionado sera igual a canciones y si no q te lo filtre



    if (tipoSeleccionado === "todos") {
      cancionesFiltradas = canciones;
      //esto es pa q se me vuelva a printar todas las canciones osea q si va a 
      //jazz q te printe esas y luego cuando vuelva al general q es todos q se vuelva a 
      //printar porq antes no me lo hacia con esto si 
      cancionesFiltradas.forEach(song => {
        contenedorRegistros.innerHTML += `
          <div class="cancionSingular">
            <img src="${song.image}" alt="${song.title} album cover">
            <h2>${song.title}</h2>
        <h3 >${song.artist}</h3>
        <h4>Album: ${song.album}</h4>
        
        <audio controls>
          <source src="${song.preview}">
        </audio>
          </div>
        `;
      });
    } else {
      cancionesFiltradas = canciones.filter(c => c.tipo === tipoSeleccionado);
      cancionesFiltradas.forEach(song => {
        contenedorRegistros.innerHTML += `
          <div class="cancionSingular">
            <img src="${song.image}" alt="${song.title} album cover">
            <h2>${song.title}</h2>
        <h3 >${song.artist}</h3>
        <h4>Album: ${song.album}</h4>
        
        <audio controls>
          <source src="${song.preview}">
        </audio>
          </div>
        `;
      });
    }


  });
});
//por cada cancion guardada en el foreach usa la funcion mostrarpokemon par enseñarla pero como no la tienes no te funciona

//lo del window location esque me cargue solo en el formulario.html pa no ir comentando las funciones q no existan en otros htnls.
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("form.html")) {
    const form = document.getElementById("formBusqueda");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombreIngresado = document.getElementById("nombreBandaFormulario").value.trim().toLowerCase();
      const cancionesGuardadas = JSON.parse(localStorage.getItem("cancionesReproducidas")) || [];

      if (!nombreIngresado) {
        alert("Please write the artist or song.");
        return;
      }

      const cancionCoincidente = cancionesGuardadas.find(c =>
        c.title.toLowerCase().includes(nombreIngresado) ||
        c.artist.toLowerCase().includes(nombreIngresado)
      );

      if (cancionCoincidente) {
        document.querySelector('input[name="campoArtista"]').value = cancionCoincidente.artist;
        document.querySelector('input[name="campoAlbum"]').value = cancionCoincidente.album;
        document.querySelector('input[name="campoCancion"]').value = cancionCoincidente.title;
        const genero = cancionCoincidente.tipo;

        const checkboxGenero = document.querySelector(`input[type="checkbox"][value="${genero}"]`);
        if (checkboxGenero) checkboxGenero.checked = true;
      } else {
        alert("The song or artist is not in the records.");
      }
    });
  }
});
