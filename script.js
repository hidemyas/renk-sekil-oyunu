// Basit renk-şekil eşleştirme oyunu
const COLORS = [
  {name:'Kırmızı', code:'#e74c3c'},
  {name:'Yeşil', code:'#2ecc71'},
  {name:'Mavi', code:'#3498db'},
  {name:'Sarı', code:'#f1c40f'},
  {name:'Mor', code:'#9b59b6'}
];
const SHAPES = ['circle','square','triangle'];

let score = 0, total = 0;
let currentPairs = [];

const targetsEl = document.getElementById('targets');
const shapesEl = document.getElementById('shapes');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');
let selectedShape = null;

function shuffle(a){ return a.sort(()=>Math.random()-0.5); }

function makeTarget(color, id){
  const el = document.createElement('div');
  el.className = 'target';
  el.style.background = color.code;
  el.dataset.color = color.name;
  el.title = color.name + ' (Hedef)';
  el.addEventListener('click', ()=>{
    if(!selectedShape) return;
    checkMatch(selectedShape, el);
  });
  return el;
}

function makeShape(color, shape, id){
  const el = document.createElement('div');
  el.className = 'shape ' + shape;
  el.dataset.color = color.name;
  el.dataset.shape = shape;
  el.title = color.name + ' ' + shape;
  // içerecek ikon veya şekil
  if(shape === 'triangle'){
    const tri = document.createElement('div');
    tri.className = 'triangle';
    tri.style.borderBottomColor = color.code;
    el.appendChild(tri);
    el.style.background = 'transparent';
  } else {
    el.style.background = color.code;
    const span = document.createElement('div');
    span.className = 'icon';
    span.textContent = '';
    el.appendChild(span);
  }
  el.addEventListener('click', ()=>{
    selectShape(el);
  });
  return el;
}

function selectShape(el){
  // seçimi değiştir
  document.querySelectorAll('.shape').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
  selectedShape = el;
}

function checkMatch(shapeEl, targetEl){
  total++;
  const shapeColor = shapeEl.dataset.color;
  const targetColor = targetEl.dataset.color;
  if(shapeColor === targetColor){
    score++;
    // eşleşenleri kaldır / yerine placeholder
    shapeEl.classList.add('matched');
    shapeEl.style.opacity = '0.14';
    targetEl.classList.add('placeholder');
    targetEl.style.outline = '3px solid rgba(0,0,0,0.04)';
    targetEl.style.boxShadow = 'inset 0 0 0 3px rgba(255,255,255,0.06)';
  } else {
    // ufak geri bildirim
    shapeEl.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:250});
    targetEl.animate([{transform:'translateY(0)'},{transform:'translateY(-8px)'},{transform:'translateY(0)'}],{duration:200});
  }
  selectedShape = null;
  document.querySelectorAll('.shape').forEach(s=>s.classList.remove('selected'));
  updateScore();
  // oyun bitti mi?
  if(total >= currentPairs.length){
    setTimeout(()=>{
      alert('Oyun bitti! Doğru: ' + score + ' / ' + total);
    },120);
  }
}

function updateScore(){ scoreEl.textContent = `Puan: ${score} / ${total}`; }

function startGame(pairs=5){
  score = 0; total = 0; selectedShape = null;
  targetsEl.innerHTML = ''; shapesEl.innerHTML = '';
  // karışık renk seç
  const colors = shuffle([...COLORS]).slice(0, pairs);
  const shapes = [];
  // her renk için rastgele bir şekil belirle
  colors.forEach(c=>{
    const s = SHAPES[Math.floor(Math.random()*SHAPES.length)];
    shapes.push({color:c, shape:s});
  });
  currentPairs = shapes;
  // hedefler (sağda/belde)
  const tEls = [];
  colors.forEach((c, idx)=>{
    const t = makeTarget(c, idx);
    tEls.push(t);
  });
  // karıştırıp shapes paneli doldur
  const sEls = [];
  shuffle(shapes).forEach((pair, idx)=>{
    const s = makeShape(pair.color, pair.shape, idx);
    sEls.push(s);
  });
  // ekrana sırala
  tEls.forEach(e=>targetsEl.appendChild(e));
  sEls.forEach(e=>shapesEl.appendChild(e));
  updateScore();
}

startBtn.addEventListener('click', ()=>startGame(5));
restartBtn.addEventListener('click', ()=>startGame(5));
// otomatik başlat
startGame(5);
