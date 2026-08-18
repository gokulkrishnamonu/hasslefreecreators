(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Parallax layers: back moves slowest, mid a bit more, grid a bit more still */
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
  function updateParallax(){
    const y = window.scrollY;
    parallaxLayers.forEach(function(layer){
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.2;
      layer.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
    });
  }
  if(!reduceMotion && parallaxLayers.length){
    window.addEventListener('scroll', function(){ requestAnimationFrame(updateParallax); }, {passive:true});
    updateParallax();
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* Node network canvas - signature brand visual */
  const canvas = document.getElementById('nodeCanvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w, h, nodes;
    function resize(){
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    function initNodes(){
      const count = Math.max(14, Math.round((w*h)/16000));
      nodes = Array.from({length: Math.min(count, 30)}, function(){
        return {
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*0.35,
          vy: (Math.random()-0.5)*0.35,
          r: Math.random()*2 + 1.5
        };
      });
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const n of nodes){
        if(!reduceMotion){
          n.x += n.vx; n.y += n.vy;
          if(n.x < 0 || n.x > w) n.vx *= -1;
          if(n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if(d < 130){
            ctx.strokeStyle = 'rgba(93,202,165,' + (1 - d/130) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      for(const n of nodes){
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();
      }
      if(!reduceMotion) requestAnimationFrame(draw);
    }
    resize();
    initNodes();
    draw();
    window.addEventListener('resize', function(){ resize(); initNodes(); if(reduceMotion) draw(); });
  }

  /* Contact form: client-side only demo handling */
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const success = document.getElementById('formSuccess');
      if(success){
        success.classList.add('show');
        success.textContent = "Thanks — we've received your message and will reply within one business day.";
      }
      form.reset();
    });
  }
})();
