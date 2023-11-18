
class Persona 
{
  constructor(id, nombre, apellido, edad) 
  {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }

  toString() 
  {
    return `Nombre: ${this.nombre} ${this.apellido}, Edad: ${this.edad}`;
  }

  toJson() 
  {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad,
    };
  }
}

class Futbolista extends Persona
{
  constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) 
  {
    super(id, nombre, apellido, edad);
    this.equipo = equipo;
    this.posicion = posicion;
    this.cantidadGoles = cantidadGoles;
  }

  toString() 
  {
    return `${super.toString()}, Equipo: $${this.equipo.toFixed(2)}, Posicion: $${this.Posicion.toFixed(2)} CantidadGoles: $${this.CantidadGoles.toFixed(2)}`;
  }

  toJson() 
  {
    const personaData = super.toJson();
    return {
      ...personaData,
      equipo: this.equipo,
      posicion: this.posicion,
      cantidadGoles: this.cantidadGoles,
    };
  }
}

class Profesional extends Persona 
{
  constructor(id, nombre, apellido, edad, titulo, facultad, anoGraduacion) 
  {
    super(id, nombre, apellido, edad);
    this.titulo = titulo;
    this.facultad = facultad;
    this.anoGraduacion = anoGraduacion;
  }

  toString() 
  {
    return `${super.toString()}, Titulo: $${this.titulo.toFixed(2)}, Facultad: ${this.facultad} añoGraduacion: ${this.anoGraduacion}`;
  }

  toJson() 
  {
    const personaData = super.toJson();
    return {
      ...personaData,
      titulo: this.titulo,
      facultad: this.facultad,
      anoGraduacion: this.anoGraduacion,
    };
  }
}

const url = "http://localhost/personasFutbolitasProfesionales.php";

var listaPersonas = [];
const tablaCuerpo = document.getElementById('tablaCuerpo');

function showSpinner() {
  document.getElementById('spinner-container').style.display = 'block';
  disablePage();
}

function hideSpinner() {
  document.getElementById('spinner-container').style.display = 'none';
  enablePage();
}

function disablePage() {
  var elements = document.querySelectorAll('button, input, select, textarea, a');
  elements.forEach(function(element) {
    element.disabled = true;
  });
}

function enablePage() {
  var elements = document.querySelectorAll('button, input, select, textarea, a');
  elements.forEach(function(element) {
    element.disabled = false;
  });
}

function GetPersonasJSON() 
{
  showSpinner();

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() 
  {
    if (xhttp.readyState == 4) 
    {
      hideSpinner();

      if (xhttp.status == 200) 
      {
        const decodedJSON = decodeURIComponent(xhttp.responseText);
        const arrayObjetos = JSON.parse(decodedJSON);
        listaPersonas = arrayObjetos.map(crearObjetoDeClase);
        actualizarTabla(listaPersonas);
      } 
      else 
      {
        alert("Los datos no fueron cargados - Error: " + xhttp.status);
      }
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send(); 
}

function crearObjetoDeClase(unObjeto)
{
  if (unObjeto.hasOwnProperty('equipo') && unObjeto.hasOwnProperty('posicion') && unObjeto.hasOwnProperty('cantidadGoles')) 
  {
    return new Futbolista(unObjeto.id, unObjeto.nombre, unObjeto.apellido, unObjeto.edad, unObjeto.equipo, unObjeto.posicion, unObjeto.cantidadGoles);
  } 
  else if (unObjeto.hasOwnProperty('titulo') && unObjeto.hasOwnProperty('facultad')) 
  {
    return new Profesional(unObjeto.id, unObjeto.nombre, unObjeto.apellido, unObjeto.edad, unObjeto.titulo, unObjeto.facultad, unObjeto.anoGraduacion);
  } 
}

function actualizarTabla(listaPersonas)
{
  while (tablaCuerpo.firstChild)
  {
    tablaCuerpo.removeChild(tablaCuerpo.firstChild);
  }

  listaPersonas.forEach((persona) => 
  {
      const nuevaFila = document.createElement('tr');
      nuevaFila.id = `fila_con_id-${persona.id}`; 
      nuevaFila.innerHTML = `
          <td class="colId">${persona.id}</td>
          <td class="colNombre">${persona.nombre}</td>
          <td class="colApellido">${persona.apellido}</td>
          <td class="colEdad">${persona.edad}</td>
          <td class="colEquipo">${persona.equipo === undefined ? "N/A" : persona.equipo}</td>
          <td class="colPosicion">${persona.posicion === undefined ? "N/A" : persona.posicion}</td>
          <td class="colCantidadGoles">${persona.cantidadGoles === undefined ? "N/A" : persona.cantidadGoles}</td>
          <td class="colTitulo">${persona.titulo === undefined ? "N/A" : persona.titulo}</td>
          <td class="colFacultad">${persona.facultad === undefined ? "N/A" : persona.facultad}</td>
          <td class="colanoGraduacion">${persona.anoGraduacion === undefined ? "N/A" : persona.anoGraduacion}</td>
          <td class="colModificar"><button class="modificarBtn" data-id="${persona.id}">Modificar</button></td>
          <td class="colEliminar"><button class="eliminarBtn" data-id="${persona.id}">Eliminar</button></td>
      `;
      tablaCuerpo.appendChild(nuevaFila);
  });
}

GetPersonasJSON()

tablaCuerpo.addEventListener('click', function (event) {
  var target = event.target;

  if (target.classList.contains('modificarBtn')) {
    const personaId = target.getAttribute('data-id');
    mostrarFormModificar(personaId);
  } else if (target.classList.contains('eliminarBtn')) {
    const personaId = target.getAttribute('data-id');
    mostrarFormEliminar(personaId);
  }
});

var btnAgregar = document.getElementById("agregar");
var btnAgregarAbm = document.getElementById("agregarAbm");
var btnModificar = document.getElementById("modificarAbm");
var btnEliminar = document.getElementById("eliminarAbm");
var btnCanelar = document.getElementById("cancelarAbm");
var primerForm = document.getElementById("primerForm");
var abm = document.getElementById("ABM");

abm.style.display = 'none';

function cambiarDeFormulario()
{
  if(primerForm.style.display != 'none')
  {
    primerForm.style.display = 'none';
    abm.style.display = 'block';
  }
  else
  {
    primerForm.style.display = 'block';
    abm.style.display = 'none';
  }
}

var idAbm = document.getElementById("idAbm");
var nombreAbm = document.getElementById("nombreAbm");
var apellidoAbm = document.getElementById("apellidoAbm");
var edadAbm = document.getElementById("edadAbm");
var equipoAbm = document.getElementById("equipoAbm");
var posicionAbm = document.getElementById("posicionAbm");
var cantidadGolesAbm = document.getElementById("cantidadGolesAbm");
var tituloAbm = document.getElementById("tituloAbm");
var facultadAbm = document.getElementById("facultadAbm");
var anoGraduacionAbm = document.getElementById("anoGraduacionAbm");
var tipoAbm = document.getElementById("tipoAbm");
var datosFutbolista = document.getElementById("datosFutbolista");
var datosProfesional = document.getElementById("datosProfesional");

function vaciarDatosAbm()
{
  idAbm.value = '';
  nombreAbm.value = '';
  apellidoAbm.value = '';
  edadAbm.value = '';
  tipoAbm.value = "futbolista";
  equipoAbm.value = '';
  posicionAbm.value = '';
  cantidadGolesAbm.value = '';
  tituloAbm.value = '';
  facultadAbm.value = '';
  anoGraduacionAbm.value = '';
}

btnAgregar.addEventListener('click', function()
{
  vaciarDatosAbm();
  cambiarDeFormulario();
  filtarParametrosAbm();

  idAbm.disabled = true;
  btnAgregarAbm.style.display = 'inline-block';
  btnModificar.style.display = 'none';
  btnEliminar.style.display = 'none';
});

btnCanelar.addEventListener('click', cambiarDeFormulario);

function filtarParametrosAbm()
{
  if (tipoAbm.value == "futbolista")
  {
    datosFutbolista.style.display = 'block';
    datosProfesional.style.display = 'none';
  }
  else
  {
    datosFutbolista.style.display = 'none';
    datosProfesional.style.display = 'block';
  }
}

function completarDatosAbm(datosFila)
{
  idAbm.value = datosFila[0];
  nombreAbm.value = datosFila[1];
  apellidoAbm.value = datosFila[2];
  edadAbm.value = datosFila[3];

  if(datosFila[4] != undefined)
  {
    tipoAbm.value = "futbolista";
    equipoAbm.value = datosFila[4];
    posicionAbm.value = datosFila[5];
    cantidadGolesAbm.value = datosFila[6];
    tituloAbm.value = '';
    facultadAbm.value = '';
    anoGraduacionAbm.value = '';
  }
  else
  {
    tipoAbm.value = "profesional";
    equipoAbm.value = '';
    posicionAbm.value = '';
    cantidadGolesAbm.value = '';
    tituloAbm.value = datosFila[7];
    facultadAbm.value = datosFila[8];
    anoGraduacionAbm.value = datosFila[9];
  }

  filtarParametrosAbm();
}

function validarDatosAbm()
{
  if(nombreAbm.value != null && apellidoAbm.value != null && edadAbm.value != null && !isNaN(edadAbm.value))
  {
    if(nombreAbm.value && apellidoAbm.value && edadAbm.value > 15)
    {
      switch(tipoAbm.value)
      {
        case "futbolista":
          if(equipoAbm.value != null && posicionAbm.value != null && !isNaN(cantidadGolesAbm.value) && cantidadGolesAbm.value > -1)
          {
            if(equipoAbm.value && posicionAbm.value)
            {
                return true;
            }
          }
        break;

        case "profesional":
          if(tituloAbm.value != null && facultadAbm.value != null && !isNaN(anoGraduacionAbm.value) && anoGraduacionAbm.value > 1950)
          {
            if(tituloAbm.value && facultadAbm.value)
            {
                return true;
            }
          }
        break;
      }
    }
  }
  return false;
}

tipoAbm.addEventListener('change',filtarParametrosAbm);

btnAgregarAbm.addEventListener('click', function() {
  agregarElemento();
});

function agregarElemento() 
{
  showSpinner();

  var tipoElemento = tipoAbm.value;

  var nuevoElemento;

  if(validarDatosAbm())
  {
    if (tipoElemento === "futbolista") 
    {
      nuevoElemento = new Futbolista(null, nombreAbm.value, apellidoAbm.value, edadAbm.value, equipoAbm.value, posicionAbm.value, cantidadGolesAbm.value);
    } 
    else 
    {
      nuevoElemento = new Profesional(null, nombreAbm.value, apellidoAbm.value, edadAbm.value, tituloAbm.value, facultadAbm.value, anoGraduacionAbm.value);
    }
  
    var jsonElemento = JSON.stringify(nuevoElemento.toJson());
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonElemento,
    })
    .then(response => {
      hideSpinner();
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      nuevoElemento.id = data.id;
      listaPersonas.push(nuevoElemento);
      actualizarTabla(listaPersonas);
      cambiarDeFormulario();
    })
    .catch(error => {
      console.error('Error al agregar elemento:', error);
      hideSpinner();
      cambiarDeFormulario();
      alert('No se pudo realizar la operación.');
    });
  }
  else
  {
    alert('Datos no validos');
    hideSpinner();
  }
}

function mostrarFormModificar(personaId) 
{
  const personaMod = listaPersonas.find((persona) => persona.id === parseInt(personaId, 10));

  if (personaMod) {
    completarDatosAbm([
      personaMod.id,
      personaMod.nombre,
      personaMod.apellido,
      personaMod.edad,
      personaMod.equipo,
      personaMod.posicion,
      personaMod.cantidadGoles,
      personaMod.titulo,
      personaMod.facultad,
      personaMod.anoGraduacion,
    ]);

    idAbm.disabled = true;
    tipoAbm.disabled = true;

    btnAgregarAbm.style.display = 'none';
    btnModificar.style.display = 'inline-block';
    btnEliminar.style.display = 'none';

    cambiarDeFormulario();
  }
}

btnModificar.addEventListener('click', function () {
  console.log("hola");
  modificarElemento();
});

function modificarElemento() 
{
  showSpinner();

  var tipoElemento = tipoAbm.value;
  var idElemento = idAbm.value;

  var elementoMod;

  if (validarDatosAbm()) 
  {
    if (tipoElemento === 'futbolista') {
      elementoMod = new Futbolista(
        idElemento,
        nombreAbm.value,
        apellidoAbm.value,
        edadAbm.value,
        equipoAbm.value,
        posicionAbm.value,
        cantidadGolesAbm.value
      );
    } else {
      elementoMod = new Profesional(
        idElemento,
        nombreAbm.value,
        apellidoAbm.value,
        edadAbm.value,
        tituloAbm.value,
        facultadAbm.value,
        anoGraduacionAbm.value
      );
    }

    var jsonElemento = JSON.stringify(elementoMod.toJson());

    console.log(jsonElemento);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonElemento,
    })
      .then((response) => {
        hideSpinner();
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then((data) => {
        if (data === 'Exito')
        {
          const idElementoNumber = parseInt(idElemento, 10); // Convert idElemento to a number
          const index = listaPersonas.findIndex((persona) => persona.id === idElementoNumber);
        console.log(index);
        listaPersonas[index] = elementoMod;
        console.log(elementoMod);

        actualizarTabla(listaPersonas);

        cambiarDeFormulario();
        }
        else
        {
          console.error('Unexpected response:', data);
        }
      })
      .catch((error) => {
        console.error('Error al modificar elemento:', error);
        hideSpinner();
        cambiarDeFormulario();
        alert('No se pudo realizar la operacion.');
      });
  } else {
    alert('Datos no validos');
    hideSpinner();
  }
}

function mostrarFormEliminar(personaId) {
  const personaEliminar = listaPersonas.find((persona) => persona.id === parseInt(personaId, 10));

  if (personaEliminar) {
      completarDatosAbm([
          personaEliminar.id,
          personaEliminar.nombre,
          personaEliminar.apellido,
          personaEliminar.edad,
          personaEliminar.equipo,
          personaEliminar.posicion,
          personaEliminar.cantidadGoles,
          personaEliminar.titulo,
          personaEliminar.facultad,
          personaEliminar.anoGraduacion,
      ]);

      idAbm.disabled = true;
      tipoAbm.disabled = true;

      btnAgregarAbm.style.display = 'none';
      btnModificar.style.display = 'none'; // No need to modify for deletion
      btnEliminar.style.display = 'inline-block';

      cambiarDeFormulario();
  }
}

btnEliminar.addEventListener('click', function () {
  eliminarElemento();
});

function eliminarElemento() {
  showSpinner();

  var idElemento = idAbm.value;

  // Make sure idElemento is a valid number
  if (!isNaN(idElemento)) {
      fetch(url, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: idElemento }),
      })
          .then((response) => {
              hideSpinner();
              if (response.ok) {
                  return response.text();
              } else {
                  throw new Error(`Error ${response.status}: ${response.statusText}`);
              }
          })
          .then((data) => {
              if (data === 'Exito') {
                  const idElementoNumber = parseInt(idElemento, 10);
                  const index = listaPersonas.findIndex((persona) => persona.id === idElementoNumber);
                  listaPersonas.splice(index, 1); // Remove the deleted element from the array
                  actualizarTabla(listaPersonas);
                  cambiarDeFormulario();
              } else {
                  console.error('Unexpected response:', data);
                  alert('No se pudo realizar la operacion.');
              }
          })
          .catch((error) => {
              console.error('Error al eliminar elemento:', error);
              hideSpinner();
              cambiarDeFormulario();
              alert('No se pudo realizar la operacion.');
          });
  } else {
      alert('ID no válido');
      hideSpinner();
  }
}
