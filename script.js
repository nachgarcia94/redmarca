const coefPrimer = {
  bbva: { 12: 117.1, 24: 78.1, 36: 64.2, 48: 59.5, 60: 49.8 },
  icbc: { 12: 127.6, 24: 89.4, 36: 79.4, 48: 74.6 },
  galicia: { 12: 125.54, 18: 98.58, 24: 85.8, 36: 74.13, 48: 69.28, 60: 66.97 }
};
const coefUltima = {
  bbva: { 12: 108.49, 24: 67.56, 36: 54.89, 48: 59.59, 60: 46.7 },
  icbc: { 12: 117.5, 24: 78.63, 36: 68.39, 48: 62.48 },
  galicia: { 12: 116.15, 18: 88.7, 24: 75.61, 36: 63.7, 48: 58.75, 60: 56.39 }
};

const formato = new Intl.NumberFormat("es-AR", {minimumFractionDigits:0, maximumFractionDigits:0});

function calcular(inputId, factorExtra, resultadoId, banco){
  const input=document.getElementById(inputId);
  const resultadosDiv=document.getElementById(resultadoId);
  const raw=parseFloat(input.value);
  if(isNaN(raw)||raw<1||raw>50000000){
    resultadosDiv.innerHTML=`<p style="color:#b00020;font-weight:700;">Ingrese un monto válido entre 1 y 50.000.000.</p>`;
    return;
  }
  const montoTotal=raw*factorExtra;
  const primeros=coefPrimer[banco];
  const ultimos=coefUltima[banco];
  const pct=(factorExtra-1)*100;
  const pctStr=(Math.round(pct)===pct)?pct.toFixed(0)+'%':pct.toFixed(1)+'%';
  let html=`<p style="margin-bottom:6px;"><strong>Monto con gastos (${pctStr}):</strong> $${formato.format(Math.round(montoTotal))}</p>`;
  html+=`<h3 style="margin:8px 0 6px 0;">Cuotas estimadas (primer cuota // última cuota):</h3>`;
  const plazos=Object.keys(primeros).map(n=>parseInt(n)).sort((a,b)=>a-b);
  plazos.forEach(plazo=>{
    const coefP=primeros[plazo];
    const cuotaPrimer=(montoTotal*(coefP/100))/10;
    const cuotaPrimerRounded=Math.round(cuotaPrimer);
    const coefU=(ultimos&&ultimos[plazo]!==undefined)?ultimos[plazo]:null;
    let cuotaUltimaRounded=null;
    if(coefU!==null){
      const cuotaUltima=(montoTotal*(coefU/100))/10;
      cuotaUltimaRounded=Math.round(cuotaUltima);
    }
    const left=`$${formato.format(cuotaPrimerRounded)}`;
    const right=(cuotaUltimaRounded!==null)?` // $${formato.format(cuotaUltimaRounded)}`:'';
    html+=`<div class="plazo-row"><div class="label">${plazo} cuotas</div><div class="value">${left}${right}</div></div>`;
  });
  resultadosDiv.innerHTML=html;
}

function borrar(inputId, resultadoId){
  const input=document.getElementById(inputId);
  const resultadosDiv=document.getElementById(resultadoId);
  input.value="";
  resultadosDiv.innerHTML="";
  input.focus();
}

