// Smooth in-page navigation
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));

// Scroll reveals, with a graceful fallback for browsers without IntersectionObserver
const revealTargets=document.querySelectorAll('.section-head,.feature,.opp,.rank,.manifesto>*,.dcba-note,.cta-inner');
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});
  revealTargets.forEach((el,i)=>{el.classList.add('reveal-ready');el.style.transitionDelay=`${Math.min(i%4,3)*75}ms`;revealObserver.observe(el);});
}else{revealTargets.forEach(el=>el.classList.add('is-visible'));}

// Custom cursor: glowing ring + precise dot on mouse/trackpad devices
if(window.matchMedia('(pointer:fine)').matches){
  const dot=document.createElement('div');dot.className='cursor-dot';dot.setAttribute('aria-hidden','true');
  const ring=document.createElement('div');ring.className='cursor-ring';ring.setAttribute('aria-hidden','true');
  document.body.append(dot,ring);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,active=false;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(!active){rx=mx;ry=my;active=true;document.body.classList.add('cursor-ready');}});
  function cursorFrame(){dot.style.left=mx+'px';dot.style.top=my+'px';rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cursorFrame)}
  cursorFrame();
  document.querySelectorAll('a,button,.feature,.opp,.rank,.card-main').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('is-hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('is-hover'));});
  document.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-ready'));
  document.addEventListener('mouseenter',()=>{if(active)document.body.classList.add('cursor-ready')});
}

// Subtle 3D tilt and pointer-following glow for cards (disabled for touch/reduced motion)
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.feature,.opp,.rank,.card-main').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;
      card.style.setProperty('--spot-x',(x*100)+'%');card.style.setProperty('--spot-y',(y*100)+'%');
      const max=card.classList.contains('card-main')?7:5;
      card.style.transform=`perspective(900px) rotateX(${(0.5-y)*max}deg) rotateY(${(x-0.5)*max}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}
