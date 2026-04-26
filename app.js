const PIN="24493739";

let autorizado=
sessionStorage.getItem("autorizado")==="si";

if(!autorizado){

let p=prompt("Introduce PIN");

if(p!==PIN){
document.body.innerHTML="<h2>Acceso denegado</h2>";
throw new Error("PIN");
}

sessionStorage.setItem(
"autorizado",
"si"
);

}


if('serviceWorker' in navigator){
navigator.serviceWorker.register('sw.js');
}


const WEBHOOK=
"https://script.google.com/macros/s/AKfycbxe-XZhSXt7_vAOvnOVJk-tFw3cpPRtH62nDjrkZxWz6W2OVRFalyW-a2kTw1luLZDjvA/exec";


let entradaAbierta=false;
let horaEntrada=null;



window.onload=function(){

entradaAbierta=
localStorage.getItem(
"entradaAbierta"
)==="true";

horaEntrada=
localStorage.getItem(
"horaEntrada"
);

actualizarBoton();
mostrarEstado();

};



function actualizarBoton(){

document.getElementById(
"mainButton"
).innerText=
entradaAbierta?
"🔴 SALIR":
"🟢 ENTRAR";

}



function mostrarEstado(){

if(entradaAbierta){

document.getElementById(
"estado"
).innerText=
"Jornada abierta desde "
+
new Date(
parseInt(horaEntrada)
).toLocaleTimeString(
'es-ES'
);

}

}



function guardar(){

localStorage.setItem(
"entradaAbierta",
entradaAbierta
);

localStorage.setItem(
"horaEntrada",
horaEntrada
);

}



function formatea(seg){

let h=Math.floor(seg/3600);
let m=Math.floor((seg%3600)/60);
let s=seg%60;

return String(h).padStart(2,"0")
+":"
+String(m).padStart(2,"0")
+":"
+String(s).padStart(2,"0");

}



function diaTexto(){

let dias=[
"Domingo","Lunes","Martes",
"Miércoles","Jueves",
"Viernes","Sábado"
];

return dias[
new Date().getDay()
];

}



function horaCompleta(){

return new Date()
.toLocaleString(
'es-ES'
);

}



function enviar(datos){

fetch(
WEBHOOK,
{
mode:"no-cors",
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify(
datos
)
}
);

}



function fichar(){

let ahora=new Date();


if(!entradaAbierta){

horaEntrada=
ahora.getTime();

entradaAbierta=true;

guardar();

enviar({
tipo:"entrada",
dia:diaTexto(),
entrada:horaCompleta(),
secret:"checkpoint2026"
});

mostrarEstado();
actualizarBoton();

return;

}



let segundos=
Math.floor(
(
ahora.getTime()-horaEntrada
)/1000
);

let comida=
confirm(
"¿Descontar comida?"
)?
"Sí":"No";


enviar({
tipo:"salida",
salida:horaCompleta(),
horas:formatea(segundos),
comida:comida,
secret:"checkpoint2026"
});


entradaAbierta=false;
horaEntrada=null;

guardar();

document.getElementById(
"estado"
).innerText=
"✅ Jornada guardada";

actualizarBoton();

}



function parteDiario(){

let companero=
prompt("Compañero:");
if(!companero)return;


let vehiculo=
prompt("Vehículo:");
if(!vehiculo)return;


let trabajo=
prompt(
"Trabajo realizado:"
);
if(!trabajo)return;


let materiales=
prompt(
"Materiales:"
)||"";


let obs=
prompt(
"Observaciones:"
)||"";


enviar({

tipo:"parte",

fecha:horaCompleta(),

companero:companero,

vehiculo:vehiculo,

trabajo:trabajo,

materiales:materiales,

obs:obs,

secret:"checkpoint2026"

});

alert(
"Parte guardado"
);

}
