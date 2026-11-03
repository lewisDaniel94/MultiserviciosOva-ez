const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const I=n=>'img/'+encodeURI(n),WA='584143437428';
const $m=n=>'$'+n.toLocaleString('es-VE',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const CATS={papel:'Papelería',empaque:'Empaque',seguridad:'Seguridad Industrial',rollos:'Rollos Térmicos'};
const P=[
['papel','Hojas blancas Papel Bond','Bulto (10 unid)',45,'6.JPG'],
['papel','Separadores','Bulto (10 paquetes)',15,'11.JPG'],
['papel','Carpetas marrón','25 unidades',6,'12.JPG'],
['papel','Archivadores','Unidad',2.5,'19.png'],
['empaque','Stretch','Unidad',15,'14.JPG'],
['empaque','Cinta de embalaje','Unidad',1.5,'7.png'],
['empaque','Euro Film','Unidad',25,'15.JPG'],
['seguridad','Botas de seguridad','Unidad',30,'1.JPG'],
['seguridad','Tapa bocas','Unidad',1.83,'5.JPG'],
['rollos','Punto de venta','Rollos (100 unidades)',20,'18.JPG'],
['rollos','Rollos de balanza','Rollos (50 unidades)',55,'2.JPG'],
['rollos','MR Bobina','Unidad',25,'17.JPG']
].map(([c,n,u,p,i])=>({c,n,u,p,i}));
const T=[
['empaque','Empaque','Cinta de embalaje','30 (1).JPG'],['rollos','Rollos','Punto de venta','30 (4).JPG'],
['papel','Papelería','Resma papel bond','6.JPG'],['papel','Carpetas','Separadores, archivadores','30 (5).JPG'],
['seguridad','Seguridad Industrial','Botas de seguridad','50 (1).JPG'],['seguridad','Tapa bocas','Higiene','30 (3).JPG'],
['seguridad','Seguridad','Lentes, cascos','70.JPG'],['seguridad','Guantes','Industriales','50 (2).JPG']];

/* Categorías */
$('#cats').innerHTML=T.map(([c,t,s,i])=>`<button class="cat rv" data-c="${c}"><img src="${I(i)}" alt="${t}" loading="lazy"><span><b>${t}</b><small>${s}</small></span></button>`).join('');

/* Productos: filtro + búsqueda */
let cat='all',q='';
$('#chips').innerHTML=[['all','Todos'],...Object.entries(CATS)].map(([k,v])=>`<button data-f="${k}" class="${k==='all'?'on':''}">${v}</button>`).join('');
function draw(){
  const l=P.map((p,id)=>({...p,id})).filter(p=>(cat==='all'||p.c===cat)&&norm(p.n+' '+p.u+' '+CATS[p.c]).includes(q));
  $('#grid').innerHTML=l.map((p,i)=>`<article class="card" style="animation-delay:${i*50}ms"><div class="im"><img src="${I(p.i)}" alt="${p.n}" loading="lazy"></div><div class="b"><small>${CATS[p.c]}</small><h3>${p.n}</h3><small>${p.u}</small><div class="f"><span class="pr">${$m(p.p)}</span><a class="ask" target="_blank" rel="noopener" aria-label="Consultar ${p.n} por WhatsApp" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero consultar por: '+p.n+' ('+p.u+')')}"><i class="fa-brands fa-whatsapp"></i></a><button class="add" data-id="${p.id}" aria-label="Agregar ${p.n} al pedido"><i class="fa-solid fa-plus"></i></button></div></div></article>`).join('')
  ||'<p class="empty">No encontramos productos con esa búsqueda. Prueba con otra palabra o escríbenos por WhatsApp.</p>';
}
function setCat(c){cat=c;$$('#chips button').forEach(b=>b.classList.toggle('on',b.dataset.f===c));draw()}
$('#chips').onclick=e=>{const b=e.target.closest('[data-f]');if(b)setCat(b.dataset.f)};
$('#q').oninput=e=>{q=norm(e.target.value.trim());draw()};
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-c]');if(!b)return;
  e.preventDefault();$('#q').value='';q='';setCat(b.dataset.c);
  $('#productos').scrollIntoView({behavior:'smooth'});
});

/* Pedido */
let cart={};try{cart=JSON.parse(localStorage.getItem('ov-pedido')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('ov-pedido',JSON.stringify(cart))}catch(e){}};
let tm;function toast(t){const o=$('#ts');o.textContent=t;o.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>o.classList.remove('on'),2200)}
function renderCart(){
  const ids=Object.keys(cart).filter(id=>P[id]&&cart[id]>0);
  const n=ids.reduce((a,id)=>a+cart[id],0),t=ids.reduce((a,id)=>a+cart[id]*P[id].p,0);
  $('#cnt').textContent=n;$('#cnt').hidden=!n;
  $('#dl').innerHTML=ids.map(id=>{const p=P[id];return `<li><img src="${I(p.i)}" alt=""><div><b>${p.n}</b><small>${p.u} · ${$m(p.p)}</small><div class="q"><button data-a="-" data-id="${id}" aria-label="Quitar uno"><i class="fa-solid fa-minus"></i></button><span>${cart[id]}</span><button data-a="+" data-id="${id}" aria-label="Agregar uno"><i class="fa-solid fa-plus"></i></button></div></div><button class="x" data-a="x" data-id="${id}" aria-label="Eliminar ${p.n}"><i class="fa-solid fa-trash"></i></button></li>`}).join('')
   ||'<li class="ey" style="display:block"><i class="fa-solid fa-bag-shopping"></i><p>Tu pedido está vacío. Agrega productos con el botón + y envíalos por WhatsApp.</p></li>';
  $('#tt').textContent=$m(t);
  const msg='Hola, quiero hacer una pre-orden en Multiservicios Ovañez:\n'+ids.map(id=>`• ${cart[id]} x ${P[id].n} (${P[id].u}) - ${$m(cart[id]*P[id].p)}`).join('\n')+`\nTotal estimado: ${$m(t)}\nGracias.`;
  const w=$('#wa');w.href=n?`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`:'#';w.classList.toggle('dis',!n);
  $('#clr').hidden=!n;
}
function drawer(o){document.body.classList.toggle('cart',o);$('#dr').inert=!o;if(o)$('#cl').focus()}
$('#open').onclick=()=>drawer(true);$('#cl').onclick=$('#ov').onclick=()=>drawer(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){drawer(false);menu(false)}});
$('#clr').onclick=()=>{cart={};save();renderCart()};
$('#grid').onclick=e=>{
  const b=e.target.closest('.add');if(!b)return;
  const id=b.dataset.id;cart[id]=(cart[id]||0)+1;save();renderCart();
  const c=$('#open');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');
  toast(P[id].n+' agregado a tu pedido');
};
$('#dl').onclick=e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const id=b.dataset.id,a=b.dataset.a;
  if(a==='+')cart[id]++;else if(a==='-')cart[id]=Math.max(0,cart[id]-1);else cart[id]=0;
  if(!cart[id])delete cart[id];save();renderCart();
};

/* Hero */
const sl=$$('.sl'),dots=$$('.dots button'),hero=$('#inicio');let cur=0;
function go(n){
  cur=(n+sl.length)%sl.length;
  sl.forEach((s,i)=>s.classList.toggle('on',i===cur));
  dots.forEach((d,i)=>{d.classList.remove('on');void d.offsetWidth;d.classList.toggle('on',i===cur);d.setAttribute('aria-current',i===cur)});
}
dots.forEach((d,i)=>d.onclick=()=>go(i));
$('#pv').onclick=()=>go(cur-1);$('#nx').onclick=()=>go(cur+1);
$('.dots').addEventListener('animationend',e=>{if(e.animationName==='fill')go(cur+1)});
let x0=null;hero.addEventListener('pointerdown',e=>x0=e.clientX);
hero.addEventListener('pointerup',e=>{if(x0!==null&&Math.abs(e.clientX-x0)>50)go(cur+(e.clientX<x0?1:-1));x0=null});
go(0);

/* Pestañas Misión / Visión */
$$('.tabs button').forEach(b=>b.onclick=()=>{
  $$('.tabs button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
  $('#pm').hidden=b.dataset.t!=='m';$('#pv2').hidden=b.dataset.t!=='v';
});

/* Menú móvil, scroll y aparición */
const top_=$('#top');
function menu(o){top_.classList.toggle('open',o);$('#bg').setAttribute('aria-expanded',o);$('#bg').firstElementChild.className=o?'fa-solid fa-xmark':'fa-solid fa-bars'}
$('#bg').onclick=()=>menu(!top_.classList.contains('open'));
$$('#menu a').forEach(a=>a.addEventListener('click',()=>menu(false)));
let tick=false;
addEventListener('scroll',()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  $('#bar').style.transform=`scaleX(${h>0?y/h:0})`;
  top_.classList.toggle('s',y>10);$('#up').classList.toggle('on',y>500);tick=false})},{passive:true});
$('#up').onclick=()=>scrollTo({top:0,behavior:'smooth'});
const links=$$('#menu a');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>rv.observe(el));

/* Formulario de contacto */
$('#fm').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.target,n=$('#nt'),b=$('#sb');
  b.disabled=true;n.className='';n.textContent='Enviando…';
  try{
    const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
    if(!r.ok)throw 0;
    f.reset();n.className='ok';n.textContent='¡Mensaje enviado! Te responderemos pronto.';
  }catch(err){n.className='er';n.textContent='No se pudo enviar. Inténtalo otra vez o escríbenos por WhatsApp.'}
  b.disabled=false;
});

$('#yr').textContent=new Date().getFullYear();
draw();renderCart();
