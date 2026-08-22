// 🌌 Galaxia Espiral Realista - Estilo Hubble + Cometas
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

// 🚀 CLASE DE COMETAS
class Cometa {
  constructor() {
    this.reiniciar();
  }

  reiniciar() {
    // Aparecen desde bordes aleatorios
    const borde = Math.floor(Math.random() * 4);
    if (borde === 0) { // Arriba
      this.x = Math.random() * canvas.width;
      this.y = -20;
    } else if (borde === 1) { // Derecha
      this.x = canvas.width + 20;
      this.y = Math.random() * canvas.height;
    } else if (borde === 2) { // Abajo
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
    } else { // Izquierda
      this.x = -20;
      this.y = Math.random() * canvas.height;
    }

    // Velocidad y dirección
    this.velocidad = Math.random() * 2 + 1;
    const anguloDir = Math.random() * Math.PI * 2;
    this.vx = Math.cos(anguloDir) * this.velocidad;
    this.vy = Math.sin(anguloDir) * this.velocidad;

    this.cola = [];
    this.longitudCola = 20 + Math.floor(Math.random() * 15);

    // Colores realistas de cometa: blanco-azulado o verdoso
    this.color = {
      r: 180 + Math.floor(Math.random() * 75),
      g: 200 + Math.floor(Math.random() * 55),
      b: 230 + Math.floor(Math.random() * 25)
    };
  }

  actualizar() {
    // Guardar posición anterior para la cola
    this.cola.push({ x: this.x, y: this.y });
    if (this.cola.length > this.longitudCola) this.cola.shift();

    // Mover
    this.x += this.vx;
    this.y += this.vy;

    // Si sale de la pantalla, reiniciar
    if (this.x < -100 || this.x > canvas.width + 100 ||
        this.y < -100 || this.y > canvas.height + 100) {
      this.reiniciar();
    }
  }

  dibujar() {
    // Dibujar cola con desvanecimiento
    this.cola.forEach((punto, indice) => {
      const opacidad = indice / this.cola.length;
      const tamano = 0.5 + opacidad * 1.5;
      ctx.beginPath();
      ctx.arc(punto.x, punto.y, tamano, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacidad * 0.6})`;
      ctx.fill();
    });

    // Cabeza del cometa brillante
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Brillo alrededor de la cabeza
    const brillo = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6);
    brillo.addColorStop(0, 'rgba(255,255,255,0.8)');
    brillo.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`);
    brillo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = brillo;
    ctx.fill();
  }
}

// Crear cometas
const cometas = [];
for (let i = 0; i < 4; i++) {
  cometas.push(new Cometa());
}

// Paleta de colores realista de galaxia espiral
function colorNucleo() {
  const r = 255;
  const g = Math.floor(220 + Math.random() * 35);
  const b = Math.floor(100 + Math.random() * 100);
  return { r, g, b };
}

function colorBrazo(distancia) {
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
    // Tonos blancos/azules difusos
    return {
      r: Math.floor(150 + 80 * (1 - factor) + Math.random() * 50),
      g: Math.floor(160 + 70 * (1 - factor) + Math.random() * 50),
      b: Math.floor(180 + 60 * (1 - factor) + Math.random() * 50)
    };
  }
}

// Generar partículas de la galaxia
const particulas = [];
const numBrazos = 2;
const totalParticulas = 15000;

for (let i = 0; i < totalParticulas; i++) {
  const u = Math.random();
  const v = Math.random();
  const distancia = 30 * Math.pow(u, 0.4) + 270 * Math.pow(v, 1.8);
  
  const brazo = Math.floor(Math.random() * numBrazos);
  const anguloBase = (brazo / numBrazos) * Math.PI * 2;
  const anguloEspiral = anguloBase + distancia * 0.028;
  
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

// Partículas del núcleo
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
  
  ctx.fillStyle = 'rgba(0, 0, 5, 0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Estrellas de fondo parpadeando
  estrellasFondo.forEach(e => {
    e.parpadeo += 0.03;
    const brillo = e.brilloBase * (0.75 + Math.sin(e.parpadeo) * 0.25);
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.tam, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${brillo})`;
    ctx.fill();
  });

  // ✅ Cometas cruzando el cielo
  cometas.forEach(cometa => {
    cometa.actualizar();
    cometa.dibujar();
  });

  // Dibujar galaxia
  particulas.forEach(p => {
    const anguloActual = p.anguloOriginal + anguloGlobal * 0.15;
    const x = centroX + p.distancia * Math.cos(anguloActual);
    const y = centroY + p.distancia * Math.sin(anguloActual);
    
    if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) return;
    
    const { r, g, b } = p.color;
    const alpha = Math.min(1, Math.max(0.1, 1 - p.distancia / 350));
    
    ctx.beginPath();
    ctx.arc(x, y, p.tam, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fill();
  });

  // Brillo del núcleo
  const gradienteNucleo = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 45);
  gradienteNucleo.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
  gradienteNucleo.addColorStop(0.2, 'rgba(255, 245, 180, 0.4)');
  gradienteNucleo.addColorStop(0.5, 'rgba(255, 220, 120, 0.15)');
  gradienteNucleo.addColorStop(1, 'rgba(255, 180, 60, 0)');
  ctx.fillStyle = gradienteNucleo;
  ctx.beginPath();
  ctx.arc(centroX, centroY, 45, 0, Math.PI * 2);
  ctx.fill();

  anguloGlobal += 0.0025;
  
  requestAnimationFrame(animar);
}

animar();
