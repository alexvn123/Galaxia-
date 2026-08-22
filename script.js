// 🌌 Galaxia Espiral Cambiante
const canvas = document.getElementById('galaxia');
const ctx = canvas.getContext('2d');

// Ajustar tamaño a pantalla
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

// Generar estrellas de fondo
const estrellas = [];
for (let i = 0; i < 300; i++) {
  estrellas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    tam: Math.random() * 1.5 + 0.5
  });
}

// Clase Cometa
class Cometa {
  constructor() {
    this.reiniciar();
  }
  reiniciar() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.cola = [];
    this.longitudCola = 15;
    this.color = colorAleatorio();
  }
  actualizar() {
    this.cola.push({ x: this.x, y: this.y });
    if (this.cola.length > this.longitudCola) this.cola.shift();
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -50 || this.x > canvas.width + 50 ||
        this.y < -50 || this.y > canvas.height + 50) {
      this.reiniciar();
    }
  }
  dibujar() {
    this.cola.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1 + (i / this.longitudCola), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${i / this.cola.length})`;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

// Generar color brillante
function colorAleatorio() {
  return {
    r: Math.floor(Math.random() * 175 + 80),
    g: Math.floor(Math.random() * 175 + 80),
    b: Math.floor(Math.random() * 175 + 80)
  };
}

// Estado
const cometas = Array.from({ length: 3 }, () => new Cometa());
let angulo = 0;
let coloresBrazos = Array.from({ length: 4 }, () => colorAleatorio());
let contadorColor = 0;

// Animación principal
function animar() {
  // Fondo semitransparente para suavizar rastro
  ctx.fillStyle = 'rgba(5, 5, 20, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar estrellas con leve parpadeo
  estrellas.forEach(e => {
    const brillo = 230 + Math.floor(Math.random() * 25 - 12);
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.tam, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${brillo}, ${brillo}, ${brillo})`;
    ctx.fill();
  });

  // Dibujar cometas
  cometas.forEach(c => {
    c.actualizar();
    c.dibujar();
  });

  // Cambiar colores cada cierto tiempo
  contadorColor++;
  if (contadorColor > 40) {
    contadorColor = 0;
    coloresBrazos = Array.from({ length: 4 }, () => colorAleatorio());
  }

  // Dibujar brazos espirales
  const numBrazos = 4;
  for (let brazo = 0; brazo < numBrazos; brazo++) {
    const anguloInicial = brazo * (Math.PI * 2 / numBrazos);
    const color = coloresBrazos[brazo];
    for (let dist = 10; dist < 300; dist += 8) {
      const theta = anguloInicial + (dist / 40) + angulo;
      const x = centroX + dist * Math.cos(theta);
      const y = centroY + dist * Math.sin(theta);
      const tam = Math.max(1, 6 - Math.floor(dist / 60));
      ctx.beginPath();
      ctx.arc(x, y, tam, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fill();
    }
  }

  // Núcleo central
  ctx.beginPath();
  ctx.arc(centroX, centroY, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centroX, centroY, 7, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${coloresBrazos[0].r}, ${coloresBrazos[0].g}, ${coloresBrazos[0].b})`;
  ctx.fill();

  angulo += 0.015;
  requestAnimationFrame(animar);
}

animar();
