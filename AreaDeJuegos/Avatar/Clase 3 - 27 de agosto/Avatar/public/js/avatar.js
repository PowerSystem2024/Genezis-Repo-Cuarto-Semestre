/* === CLASE 2: DRY (Don’t Repeat Yourself)
   - Variables globales: CONFIG / STATE / DATA reutilizadas en todas las funciones
   - Helpers y cache de elementos para no repetir código
   - Unidades lógicas separadas (init, eventos, cálculo, UI)
*/
/* ============================================================
   JS con buenas prácticas
   - REQ extra (DRY): variables globales reutilizables (CONFIG/DATA/STATE)
   - Script cargado AL FINAL del HTML para mejor performance
============================================================ */
const CONFIG = {
  MAX_HP: 100,
  VARIATION_MIN: 0.8,
  VARIATION_MAX: 1.2,
  CRIT_MULT: 1.5,
  WEAK_MULT: 0.7,
  PC_SLOT: {              // Config de la animación "tragamonedas"
    ITEM_HEIGHT: 120,     // se sincroniza dinámicamente con el alto real
    FAST_SPIN_DELAY: 120,
    FAST_SPIN_DUR: 120,
    FINAL_SPIN_DUR: 2400,
    REVEAL_DELAY_AFTER_SNAP: 200,
    CLOSE_DELAY_AFTER_REVEAL: 1600
  },
  ATTACK_KEYS: ['punio', 'patada', 'barrida']
};

const STATE = { jugador:null, pc:null, ataqueSeleccionado:null, vidaJugador:100, vidaPC:100, terminado:false };

const DATA = {
  personajes: {
    'Aang'  : { imagen: 'assets/aang.png',   fortaleza: 'barrida', debilidad: 'punio'  },
    'Katara': { imagen: 'assets/katara.png', fortaleza: 'punio',   debilidad: 'patada'},
    'Toph'  : { imagen: 'assets/toph.png',   fortaleza: 'patada',  debilidad: 'barrida'},
    'Zuko'  : { imagen: 'assets/zuko.png',   fortaleza: 'punio',   debilidad: 'barrida'}
  },
  ataques: {
    'punio'  : { nombre: 'Puño',   dano: 20 },
    'patada' : { nombre: 'Patada', dano: 20 },
    'barrida': { nombre: 'Barrida',dano: 20 }
  }
};

/* Cache de elementos (evitamos repetir querySelector = DRY) */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const EL = {
  pantallaSeleccion : $('#pantallaSeleccion'),
  pantallaCombate   : $('#pantallaCombate'),
  personajesContainer: $('#personajesSeleccion'),
  btnCombate        : $('#btnCombate'),

  // NUEVOS controles para generar personajes desde UI
  btnGenerar100     : $('#btnGenerar100'),
  btnGenerar1000    : $('#btnGenerar1000'),
  btnGenerarN       : $('#btnGenerarN'),
  inputCantidad     : $('#inputCantidad'),

  botonesAtaque     : $$('.boton-ataque'),
  btnAtacar         : $('#btnAtacar'),
  btnReiniciar      : $('#btnReiniciar'),
  mensajesCombate   : $('#mensajesCombate'),

  modalReglas       : $('#modalReglas'),
  modalOponente     : $('#modalOponente'),
  cerrarModal       : $('.cerrar-modal'),
  btnReglas         : $('#btnReglas'),
  btnReglasCombate  : $('#btnReglasCombate'),

  pcCharacterReel   : $('#pc-character-reel'),
  oponenteReveladoTexto : $('#oponente-revelado-texto'),

  nombreJugador     : $('#nombreJugador'),
  nombrePC          : $('#nombrePC'),
  imagenJugador     : $('#imagenJugador'),
  imagenPC          : $('#imagenPC'),
  vidaJugadorBar    : $('#vidaJugador'),
  vidaPCBar         : $('#vidaPC'),
  vidaJugadorTxt    : $('#textoVidaJugador'),
  vidaPCTxt         : $('#textoVidaPC'),
};

const pickRandom = arr => arr[Math.floor(Math.random()*arr.length)];
const toggleModal = (m, v) => (m.style.display = v ? 'block' : 'none');
const setDisabled = (nodes, d) => nodes.forEach(n => n.disabled = d);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function updateHP(){
  EL.vidaJugadorBar.style.width = `${clamp(STATE.vidaJugador,0,CONFIG.MAX_HP)}%`;
  EL.vidaPCBar.style.width      = `${clamp(STATE.vidaPC,0,CONFIG.MAX_HP)}%`;
  EL.vidaJugadorTxt.textContent = `${clamp(STATE.vidaJugador,0,CONFIG.MAX_HP)}/${CONFIG.MAX_HP}`;
  EL.vidaPCTxt.textContent      = `${clamp(STATE.vidaPC,0,CONFIG.MAX_HP)}/${CONFIG.MAX_HP}`;
}

function logMsg(atacante, dano, critico){
  EL.mensajesCombate.insertAdjacentHTML('beforeend',
    `<div class="mensaje ${critico?'critico':''}">${atacante} ➜ ${dano} de daño${critico?' (¡Crítico!)':''}</div>`
  );
  EL.mensajesCombate.scrollTop = EL.mensajesCombate.scrollHeight;
}

function setHUD(){
  EL.nombreJugador.textContent = STATE.jugador;
  EL.nombrePC.textContent      = STATE.pc;
  EL.imagenJugador.src         = DATA.personajes[STATE.jugador].imagen;
  EL.imagenPC.src              = DATA.personajes[STATE.pc].imagen;
}

/* Construye el carrete duplicando ítems (giro largo) y sincroniza alturas */
function poblarCarrete(){
  EL.pcCharacterReel.innerHTML = '';
  const nombres = Object.keys(DATA.personajes);
  [...nombres, ...nombres, ...nombres].forEach(n=>{
    const img = document.createElement('img');
    img.src = DATA.personajes[n].imagen;
    img.alt = n;
    EL.pcCharacterReel.appendChild(img);
  });
  // Ajusta ITEM_HEIGHT al alto real (evita cortes subpíxel)
  requestAnimationFrame(()=>{
    const first = EL.pcCharacterReel.firstElementChild;
    if(first){
      const h = Math.round(first.getBoundingClientRect().height);
      if(h>0) CONFIG.PC_SLOT.ITEM_HEIGHT = h;
    }
  });
}
window.addEventListener('resize', ()=> {
  const first = EL.pcCharacterReel.firstElementChild;
  if(first){
    const h = Math.round(first.getBoundingClientRect().height);
    if(h>0) CONFIG.PC_SLOT.ITEM_HEIGHT = h;
    }
});

/* Selección aleatoria del oponente (excluye el jugador) */
function seleccionarPersonajePC(){
  const oponentes = Object.keys(DATA.personajes).filter(p => p !== STATE.jugador);
  return pickRandom(oponentes);
}

/* Animación “tragamonedas” con snapping exacto a la celda final */
function iniciarAnimacionOponente(){
  EL.oponenteReveladoTexto.classList.remove('visible');
  EL.oponenteReveladoTexto.textContent = '';
  toggleModal(EL.modalOponente, true);

  STATE.pc = seleccionarPersonajePC();
  const nombres = Object.keys(DATA.personajes);
  const idxCentral = nombres.indexOf(STATE.pc) + nombres.length;
  const H = CONFIG.PC_SLOT.ITEM_HEIGHT;

  const posRapido = -(Math.floor(Math.random()*nombres.length)*H);
  const posFinal  = -(idxCentral*H);

  setTimeout(()=>{
    EL.pcCharacterReel.style.transition = `transform ${CONFIG.PC_SLOT.FAST_SPIN_DUR}ms linear`;
    EL.pcCharacterReel.style.transform  = `translateY(${posRapido}px)`;

    setTimeout(()=>{
      EL.pcCharacterReel.style.transition = `transform ${CONFIG.PC_SLOT.FINAL_SPIN_DUR}ms cubic-bezier(.25,1,.5,1)`;
      EL.pcCharacterReel.style.transform  = `translateY(${posFinal}px)`;

      const onEnd = (e)=>{
        if(e.propertyName!=='transform') return;
        EL.pcCharacterReel.removeEventListener('transitionend', onEnd);

        // Snap exacto (por si queda 1–2px desfasado)
        EL.pcCharacterReel.style.transition = 'none';
        EL.pcCharacterReel.style.transform  = `translateY(${-(idxCentral*H)}px)`;
        void EL.pcCharacterReel.offsetHeight; // reflow
        EL.pcCharacterReel.style.transition = '';

        setTimeout(()=>{
          EL.oponenteReveladoTexto.textContent = `¡Tu oponente es ${STATE.pc}!`;
          EL.oponenteReveladoTexto.classList.add('visible');
          setTimeout(()=>{
            toggleModal(EL.modalOponente, false);
            EL.btnCombate.disabled = false;
          }, CONFIG.PC_SLOT.CLOSE_DELAY_AFTER_REVEAL);
        }, CONFIG.PC_SLOT.REVEAL_DELAY_AFTER_SNAP);
      };
      EL.pcCharacterReel.addEventListener('transitionend', onEnd);
    }, CONFIG.PC_SLOT.FAST_SPIN_DUR + 40);
  }, CONFIG.PC_SLOT.FAST_SPIN_DELAY);
}

/* Cálculo de daño con multipliers (fortaleza/debilidad) y variación */
function calcularDano(nombreAtacante, tipoAtaque){
  const base = DATA.ataques[tipoAtaque].dano;
  const mult =
    DATA.personajes[nombreAtacante].fortaleza === tipoAtaque ? CONFIG.CRIT_MULT :
    DATA.personajes[nombreAtacante].debilidad === tipoAtaque ? CONFIG.WEAK_MULT : 1;
  const variacion = CONFIG.VARIATION_MIN + Math.random()*(CONFIG.VARIATION_MAX - CONFIG.VARIATION_MIN);
  const total = Math.round(base*mult*variacion);
  return {dano: total, critico: mult===CONFIG.CRIT_MULT};
}

function finalizarJuego(victoria){
  STATE.terminado = true;
  setDisabled([EL.btnAtacar, ...EL.botonesAtaque], true);
  const div = document.createElement('div');
  div.className = `resultado-final ${victoria?'victoria':'derrota'}`;
  div.innerHTML = `<h2>${victoria?'¡Victoria!':'¡Derrota!'}</h2><p>${victoria?'Has ganado el combate.':`${STATE.pc} ha ganado.`}</p>`;
  EL.pantallaCombate.insertBefore(div, document.querySelector('.combate-principal'));
}

function ataquePC(){
  const a = pickRandom(CONFIG.ATTACK_KEYS);
  const r = calcularDano(STATE.pc, a);
  STATE.vidaJugador -= r.dano;
  logMsg(STATE.pc, r.dano, r.critico);
  updateHP();
  if(STATE.vidaJugador<=0) finalizarJuego(false);
  else setDisabled([EL.btnAtacar, ...EL.botonesAtaque], false);
}

/* Eventos */
function onSelectPersonaje(btn){
  if(STATE.jugador) return;
  STATE.jugador = btn.dataset.nombre;
  btn.classList.add('seleccionado');
  setDisabled(EL.personajesContainer.querySelectorAll('.personaje'), true);
  iniciarAnimacionOponente();
}

function onStartCombate(){
  setHUD();
  EL.pantallaSeleccion.style.display='none';
  EL.pantallaCombate.style.display='block';
}

function onChooseAtaque(btn){
  STATE.ataqueSeleccionado = btn.dataset.ataque;
  EL.botonesAtaque.forEach(b=>b.classList.remove('seleccionado'));
  btn.classList.add('seleccionado');
  EL.btnAtacar.disabled = false;
}

function onAtacar(){
  if(!STATE.ataqueSeleccionado || STATE.terminado) return;
  setDisabled([EL.btnAtacar, ...EL.botonesAtaque], true);
  const r = calcularDano(STATE.jugador, STATE.ataqueSeleccionado);
  STATE.vidaPC -= r.dano;
  logMsg(STATE.jugador, r.dano, r.critico);
  updateHP();
  if(STATE.vidaPC<=0){ finalizarJuego(true); } else { setTimeout(ataquePC, 2000); }
}

/* Init y listeners (separados = DRY) */
function initListeners(){
  // Delegación: funciona con botones creados dinámicamente por la fábrica
  EL.personajesContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.personaje');
    if(btn) onSelectPersonaje(btn);
  });

  // Generador: listeners para los nuevos botones
  if(EL.btnGenerar100) EL.btnGenerar100.addEventListener('click', ()=> {
    window.generarPersonajes(100, { render: true });
  });
  if(EL.btnGenerar1000) EL.btnGenerar1000.addEventListener('click', ()=> {
    window.generarPersonajes(1000, { render: true });
  });
  if(EL.btnGenerarN && EL.inputCantidad) EL.btnGenerarN.addEventListener('click', ()=> {
    const n = parseInt(EL.inputCantidad.value, 10) || 0;
    if(n > 0) window.generarPersonajes(n, { render: true });
    else alert('Ingresá un número válido mayor que 0.');
  });

  EL.btnCombate.addEventListener('click', onStartCombate);
  EL.botonesAtaque.forEach(btn=>btn.addEventListener('click',()=>onChooseAtaque(btn)));
  EL.btnAtacar.addEventListener('click', onAtacar);
  EL.btnReiniciar.addEventListener('click', ()=>location.reload());

  EL.btnReglas.addEventListener('click', ()=>toggleModal(EL.modalReglas,true));
  EL.btnReglasCombate.addEventListener('click', ()=>toggleModal(EL.modalReglas,true));
  EL.cerrarModal.addEventListener('click', ()=>toggleModal(EL.modalReglas,false));

  window.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){
      if(EL.modalReglas.style.display==='block') toggleModal(EL.modalReglas,false);
      if(EL.modalOponente.style.display==='block') toggleModal(EL.modalOponente,false);
    }
  });
}

/* ============================================================
   POO: Modelo completo de Personaje + Generador mejorado
   - Personaje con propiedades completas y métodos
   - GeneradorPersonajes con más variedad de datos
============================================================ */
class Personaje {
  constructor({
    id = null,
    nombre = 'Sin nombre',
    imagen = '',
    elemento = 'ninguno',
    vida = CONFIG.MAX_HP,
    vidaMax = CONFIG.MAX_HP,
    fortaleza = null,
    debilidad = null,
    ataques = {}
  } = {}) {
    // Propiedades básicas
    this.id = id ?? Personaje._generarId();
    this.nombre = nombre;
    this.imagen = imagen;
    this.elemento = elemento;
    
    // Stats de combate
    this.vida = vida;
    this.vidaMax = vidaMax;
    this.fortaleza = fortaleza;
    this.debilidad = debilidad;
    this.ataques = ataques;
    
    // Estado en combate
    this._estado = 'normal'; // normal, atacando, defendiendo, derrotado
  }

  // Métodos de combate
  recibirDano(cantidad) {
    this.vida = Math.max(0, this.vida - cantidad);
    if(this.vida === 0) this._estado = 'derrotado';
    return this.vida;
  }

  curar(cantidad) {
    this.vida = Math.min(this.vidaMax, this.vida + cantidad);
    return this.vida;
  }

  atacar(tipoAtaque) {
    const ataque = this.ataques[tipoAtaque];
    if(!ataque) return null;
    this._estado = 'atacando';
    return ataque;
  }

  // Getters/Setters útiles
  get estaVivo() { return this.vida > 0; }
  get estado() { return this._estado; }
  get porcentajeVida() { return (this.vida / this.vidaMax) * 100; }

  // Conversión para el sistema actual
  toDataEntry() {
    return {
      imagen: this.imagen,
      fortaleza: this.fortaleza,
      debilidad: this.debilidad,
      // Mantener compatibilidad con sistema existente
      ataques: Object.keys(this.ataques)
    };
  }

  static _generarId() {
    Personaje._last = (Personaje._last||0) + 1;
    return Personaje._last;
  }
}

const GeneradorPersonajes = {
  // Datos para generar variedad
  elementos: ['aire', 'agua', 'tierra', 'fuego', 'ninguno'],
  nombresBase: ['Avatar', 'Maestro', 'Guerrero', 'Sabio', 'Aprendiz'],
  sufijos: ['del Norte', 'del Sur', 'del Este', 'del Oeste', 'Ancestral'],

  generarNombre(i) {
    const base = this.nombresBase[i % this.nombresBase.length];
    const sufijo = this.sufijos[Math.floor(i/this.nombresBase.length) % this.sufijos.length];
    return `${base} ${sufijo} ${i+1}`;
  },

  generar(n = 10, options = {}) {
    const opts = Object.assign({
      render: true,
      avatarPlaceholder: Object.values(DATA.personajes)[0]?.imagen || 'assets/aang.png'
    }, options);

    const attacks = CONFIG.ATTACK_KEYS;
    const nuevos = {};

    // Generar n personajes con más variedad
    for(let i = 0; i < n; i++) {
      const nombre = this.generarNombre(i);
      const elemento = this.elementos[i % this.elementos.length];
      const fortaleza = attacks[i % attacks.length];
      const debilidad = attacks[(i+1) % attacks.length];
      
      // Crear instancia completa de Personaje
      const p = new Personaje({
        nombre,
        imagen: opts.avatarPlaceholder,
        elemento,
        fortaleza,
        debilidad,
        ataques: {
          punio: { nombre: 'Puño', dano: 15 + Math.floor(Math.random() * 10) },
          patada: { nombre: 'Patada', dano: 18 + Math.floor(Math.random() * 8) },
          barrida: { nombre: 'Barrida', dano: 12 + Math.floor(Math.random() * 12) }
        }
      });

      // Mantener compatibilidad con DATA.personajes
      nuevos[nombre] = p.toDataEntry();
    }

    // Actualizar DATA y UI
    DATA.personajes = nuevos;

    if(opts.render) {
      // Render minimalista de botones en el contenedor
      const cont = EL.personajesContainer;
      if(!cont) return DATA.personajes;
      cont.innerHTML = '';
      const fragment = document.createDocumentFragment();
      Object.keys(DATA.personajes).forEach(nombre=>{
        const btn = document.createElement('button');
        btn.className = 'personaje';
        btn.dataset.nombre = nombre;
        btn.innerHTML = `<div class="personaje-avatar"><img src="${DATA.personajes[nombre].imagen}" alt="${nombre}"></div><p>${nombre}</p>`;
        fragment.appendChild(btn);
      });
      cont.appendChild(fragment);
      // reset estado de selección
      STATE.jugador = null;
      EL.btnCombate.disabled = true;
      // repuebla el carrete de la PC para incluir los nuevos personajes
      poblarCarrete();
    }

    return DATA.personajes;
  }
};

// Exponer helper global para uso directo (con render por defecto)
window.generarPersonajes = (n=100, opts={}) => GeneradorPersonajes.generar(n, Object.assign({render:true}, opts));

function init(){
  poblarCarrete();
  updateHP();
  initListeners();
}
window.addEventListener('load', init);
