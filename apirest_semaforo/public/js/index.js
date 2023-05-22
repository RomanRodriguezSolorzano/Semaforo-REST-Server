const verde = document.getElementById("verde");
const amarillo = document.getElementById("amarillo");
const rojo = document.getElementById("rojo");



const socket = new WebSocket("ws://192.168.137.78:80");
const url = "http://localhost:8080/api/semaforo";

// Listen for messages
socket.addEventListener("message", (event) => {
  try {
    console.log(event.data);
    const data = JSON.parse(event.data);        
    const {color,carros,cantidad} = data;
    if(color!== undefined)
      cambiarClase(color);
    else if(carros!==undefined)
      agregarCarro(carros,cantidad)  
    else if (data.cantidadCarros !== undefined)
      insertarBD(data);
    llenarTablas();
  } catch (error) {
    console.log("error al convertir en json");
  }

});

const cambiarClase = (color) => {
  apagado();
  if (color == "verde") {
    verde.className = "luz activo";    
  }
  else if (color == "amarillo") {
    amarillo.className = "luz activo";    
  }
  else if (color == "parpadeo") {
    amarillo.className = "luz";
  }
  else if(color == "rojo"){
    rojo.className = "luz activo";
  }
}

const agregarCarro = (carro,cantidad)=>{
  if (carro == "verde") {
    verde.innerText = cantidad;
    amarillo.innerText = "";
    rojo.innerText = "";    
  }
  else if (carro == "amarillo") {
    verde.innerText = "";
    amarillo.innerText = cantidad;    
    rojo.innerText = "";      
  }
  else if(carro == "rojo"){
    verde.innerText = "";
    amarillo.innerText = "";    
    rojo.innerText = cantidad;
  }
}

const apagado = () => {
  verde.className = "luz";
  amarillo.className = "luz";
  rojo.className = "luz";
}

const insertarBD = async (semaforo) => {
  try {
    const result = await axios.post(url, semaforo);
  } catch (error) {
    console.log("El servidor no esta disponible");
  }

}

const tabla = async (consulta) => {
  const { data } = await axios.get(url + "/" + consulta);
  document.getElementById(consulta).innerHTML = "";
  data.forEach((fila, i) => {
    const tr = document.createElement("tr");
    let tdId = document.createElement("td");
    tdId.setAttribute("scope", "row");
    tdId.textContent = i + 1;
    tr.appendChild(tdId);
    let tdColor = document.createElement("td");
    tdColor.textContent = fila.nombre;
    tr.appendChild(tdColor);
    let tdCantidad = document.createElement("td");
    tdCantidad.textContent = fila.carros;
    tr.appendChild(tdCantidad);
    if (consulta !== "dia") {
      let tdFecha = document.createElement("td");
      tdFecha.textContent = fila.fecha;
      tr.appendChild(tdFecha);
    }
    let tdRango = document.createElement("td");
    tdRango.textContent = fila.rango;
    tr.appendChild(tdRango);

    document.getElementById(consulta).appendChild(tr);
  });
}

function llenarTablas() {
  tabla("minuto");
  tabla("hora");
  tabla("dia");
}

llenarTablas();