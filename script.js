// 🌌 Galaxia Espiral Realista - Estilo Hubble
const canvas = document.getElementById('galaxia');
const ctx = canvas.getContext('2d');

// Ajustar al tamaño de pantalla
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Centro de la galaxia
let centroX = canvas.width / 2;
let centroY = canvas.height / 2;
window.addEventListener('resize', () => {
  centroX = canvas.width / 2;
  centroY = canvas.height / 2;
});

// Generar estrellas de fondo (campo estelar)
const estrellasFondo = [];
for (let i = 0; i < 800; i++) {
  estrellasFondo.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    tam: Math.random() * 1.5 + 0.3,
    brilloBase: Math.random() * 0.5 + 0.5,
    parpadeo: Math.random() * Math.PI * 2
  });
}

// Paleta de colores realista de galaxia espiral
// Núcleo: amarillo-blanco | Brazos: azulado + rosado/rojo (regiones H II)
function colorNucleo() {
  // Tonos amarillos, dorados y blancos cálidos
  const r = 255;
  const g = Math.floor(220 + Math.random() * 35);
  const b = Math.floor(100 + Math.random() * 100);
  return { r, g, b };
}

function colorBrazo(distancia) {
  // Más cerca del centro: tonos más cálidos
  // Más lejos: tonos azules y regiones rosadas/rojas
  const factor = Math.min(1, distancia / 250);
  if (Math.random() < 0.12) {
    // Región de formación estelar: rosado/rojo
    return {
      r: 220 + Math.floor(Math.random() * 35),
      g: 60 + Math.floor(Math.random() * 80),
      b: 90 + Math.floor(Math.random() * 60)
    };
  } else if (Math.random() < 0.3) {
    // Tonos azulados/cian
    return {
      r: 60 + Math.floor(Math.random() * 80 * (1 - factor)),
      g: 120 + Math.floor(Math.random() * 100),
      b: 200 + Math.floor(Math.random() * 55)
    };
  } else {
    // Tonos blancos/azules difusos del disco
    return {
      r: Math.floor(150 + 80 * (1 - factor) + Math.random() * 50),
      g: Math.floor(160 + 70 * (1 - factor) + Math.random() * 50),
      b: Math.floor(180 + 60 * (1 - factor) + Math.random() * 50)
    };
  }
}

// Generar partículas de la galaxia
const particulas = [];
const numBrazos = 2; // Galaxia de dos brazos como en la imagen
const totalParticulas = 15000;

for (let i = 0; i < totalParticulas; i++) {
  // Distribución logarítmica para concentrar en el centro
  const u = Math.random();
  const v = Math.random();
  const distancia = 30 * Math.pow(u, 0.4) + 270 * Math.pow(v, 1.8);
  
  // Ángulo espiral logarítmico
  const brazo = Math.floor(Math.random() * numBrazos);
  const anguloBase = (brazo / numBrazos) * Math.PI * 2;
  const anguloEspiral = anguloBase + distancia * 0.028;
  
  // Pequeña desviación para dar volumen y naturalidad
  const desvAngulo = (Math.random() - 0.5) * 0.4 * (1 + distancia / 300);
  const desvDist = (Math.random() - 0.5) * 12 * (1 + distancia / 200);
  
  const color = colorBrazo(distancia);
  
  particulas.push({
    distancia: distancia + desvDist,
    angulo: anguloEspiral + desvAngulo,
    tam: Math.max(0.3, 1.8 - distancia / 180 + Math.random() * 0.6),
    color,
    anguloOriginal: anguloEspiral + desvAngulo
  });
}

// Partículas del núcleo (más brillantes y amarillentas)
for (let i = 0; i < 2500; i++) {
  const distancia = Math.pow(Math.random(), 2.2) * 60 + 5;
  const angulo = Math.random() * Math.PI * 2;
  const color = colorNucleo();
  particulas.push({
    distancia,
    angulo,
    tam: Math.max(0.5, 2.5 - distancia / 40),
    color,
    anguloOriginal: angulo,
    esNucleo: true
  });
}

// Animación
let anguloGlobal = 0;
let tiempo = 0;

function animar() {
  tiempo += 0.016;
  
  // Fondo muy oscuro con transparencia para rastro suave
  ctx.fillStyle = 'rgba(0, 0, 5, 0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar estrellas de fondo con parpadeo
  estrellasFondo.forEach(e => {
    e.parpadeo += 0.03;
    const brillo = e.brilloBase * (0.75 + Math.sin(e.parpadeo) * 0.25);
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.tam, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${brillo})`;
    ctx.fill();
  });
  
  // Dibujar partículas de la galaxia
  particulas.forEach(p => {
    const anguloActual = p.anguloOriginal + anguloGlobal * 0.15;
    const x = centroX + p.distancia * Math.cos(anguloActual);
    const y = centroY + p.distancia * Math.sin(anguloActual);
    
    // Descartar si está fuera de pantalla
    if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) return;
    
    const { r, g, b } = p.color;
    // Atenuación por distancia para dar profundidad
    const alpha = Math.min(1, Math.max(0.1, 1 - p.distancia / 350));
    
    ctx.beginPath();
    ctx.arc(x, y, p.tam, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fill();
  });
  
  // Brillo extra del núcleo (glow)
  const gradienteNucleo = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 45);
  gradienteNucleo.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
  gradienteNucleo.addColorStop(0.2, 'rgba(255, 245, 180, 0.4)');
  gradienteNucleo.addColorStop(0.5, 'rgba(255, 220, 120, 0.15)');
  gradienteNucleo.addColorStop(1, 'rgba(255, 180, 60, 0)');
  ctx.fillStyle = gradienteNucleo;
  ctx.beginPath();
  ctx.arc(centroX, centroY, 45, 0, Math.PI * 2);
  ctx.fill();
  
  anguloGlobal += 0.0025; // Velocidad de rotación lenta y realista
  
  requestAnimationFrame(animar);
}

animar();
