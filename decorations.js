// Shared shelf, reading nook, and string lights for the home and about pages.
(function() {
  // Wall shelf: pothos vines + currently-reading books
  var shelfBooks = [
    { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", color: "#22344A", w: 15, h: 52 },
    { title: "Dune", author: "Frank Herbert", color: "#b8683f", w: 14, h: 49 },
    { title: "White Nights", author: "Fyodor Dostoyevsky", color: "#e9dcc0", w: 9, h: 45 },
    { title: "Darwin's Cathedral", author: "David Sloan Wilson", color: "#4682A9", w: 11, h: 44, lean: 14 }
  ];
  (function buildShelf() {
    var svg = document.getElementById('shelf-svg');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    }
    var seed = 7;
    function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    var LEAF = 'M0,1.5 C-2.5,-1 -8,0 -8.5,6 C-9,12 -4,17 0,22 C4,17 9,12 8.5,6 C8,0 2.5,-1 0,1.5 Z';
    var greens = ['#4f7d3f', '#5e8d48', '#6b9a50', '#45703a', '#77a358'];
    function leaf(parent, x, y, dir, scale) {
      var r = dir * Math.PI / 180, stem = 2.5 * scale + 1;
      el('line', { x1: x, y1: y, x2: x + stem * Math.cos(r), y2: y + stem * Math.sin(r),
                   stroke: '#557f40', 'stroke-width': 0.7 }, parent);
      var g = el('g', { transform: 'translate(' + (x + stem * Math.cos(r)) + ',' + (y + stem * Math.sin(r)) +
                                   ') rotate(' + (dir - 90) + ') scale(' + scale + ')' }, parent);
      el('path', { d: LEAF, fill: greens[Math.floor(rand() * greens.length)] }, g);
      if (rand() < 0.45) {  // golden pothos variegation
        el('path', { d: 'M' + (rand() < 0.5 ? -3 : 3) + ',5 C-1,10 2,14 0,19', stroke: '#dfe0a2',
                     'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round', opacity: 0.75 }, g);
      }
      el('path', { d: 'M0,3 L0,19', stroke: 'rgba(30,55,25,0.35)', 'stroke-width': 0.6 }, g);
    }

    // Upright foliage crowning the pot
    var foliage = document.getElementById('shelf-foliage');
    for (var i = 0; i < 7; i++) {
      leaf(foliage, 25 + i * 5 + rand() * 2, 89, -90 + (i - 3) * 26 + (rand() - 0.5) * 16, 0.7 + rand() * 0.15);
    }

    // Trailing vines spilling over the front edge
    var vines = document.getElementById('shelf-vines');
    [
      { d: 'M26,89 C13,95 8,112 12,126 C17,160 5,205 11,262', ox: 26, oy: 89, delay: 0 },
      { d: 'M38,90 C35,104 41,118 38,130 C35,150 41,162 37,182', ox: 38, oy: 90, delay: -2.5 },
      { d: 'M52,89 C63,97 67,114 64,128 C61,160 71,190 66,222', ox: 52, oy: 89, delay: -4.2 }
    ].forEach(function(v) {
      var g = el('g', { 'class': 'vine' }, vines);
      g.style.transformOrigin = v.ox + 'px ' + v.oy + 'px';
      g.style.animationDelay = v.delay + 's';
      var path = el('path', { d: v.d, stroke: '#557f40', 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' }, g);
      var L = path.getTotalLength(), side = 1;
      for (var s = 7; s < L - 3; s += 8.5 + rand() * 3) {
        var p = path.getPointAtLength(s), q = path.getPointAtLength(Math.min(s + 1, L));
        var t = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        leaf(g, p.x, p.y, t + side * (48 + rand() * 18), 0.68 - 0.28 * (s / L) + rand() * 0.06);
        side = -side;
      }
      var end = path.getPointAtLength(L), pre = path.getPointAtLength(L - 1);
      leaf(g, end.x, end.y, Math.atan2(end.y - pre.y, end.x - pre.x) * 180 / Math.PI, 0.35);
    });

    // Books
    var booksG = document.getElementById('shelf-books');
    var caption = document.getElementById('shelf-caption');
    var x = 98, prevRight = x;
    shelfBooks.forEach(function(b) {
      var outer = el('g', {}, booksG), bx = x;
      if (b.lean) {
        var th = b.lean * Math.PI / 180;
        bx = prevRight + b.h * Math.sin(th) + 0.5;
        outer.setAttribute('transform', 'rotate(' + (-b.lean) + ' ' + bx + ' 120)');
      }
      var g = el('g', { 'class': 'book', tabindex: 0 }, outer);
      el('rect', { x: bx, y: 120 - b.h, width: b.w, height: b.h, rx: 1, fill: b.color }, g);
      var band = b.color.toLowerCase() === '#e9dcc0' ? 'rgba(34,52,74,0.35)' : 'rgba(255,251,222,0.45)';
      el('rect', { x: bx, y: 120 - b.h + 5, width: b.w, height: 1.2, fill: band }, g);
      el('rect', { x: bx, y: 113, width: b.w, height: 1.2, fill: band }, g);
      el('rect', { x: bx + b.w - 1.5, y: 120 - b.h, width: 1.5, height: b.h, fill: 'rgba(0,0,0,0.08)' }, g);
      function show() {
        caption.innerHTML = '';
        var t = document.createElement('span'); t.className = 'title'; t.textContent = b.title;
        var a = document.createElement('span'); a.className = 'author'; a.textContent = b.author;
        caption.appendChild(t); caption.appendChild(a);
        caption.classList.add('visible');
      }
      function hide() { caption.classList.remove('visible'); }
      g.addEventListener('mouseenter', show); g.addEventListener('focus', show);
      g.addEventListener('mouseleave', hide); g.addEventListener('blur', hide);
      if (!b.lean) { x += b.w + 1; prevRight = x - 1; }
    });
  })();


  // String lights: one bulb per strand, strand count scales with the gutter width
  (function buildLights() {
    var wrap = document.querySelector('.string-lights');
    var svg = document.getElementById('lights-svg');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    }
    // Stable per-strand randomness, so resizing doesn't reshuffle everything
    function hash(i, k) { var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); }
    var LENGTHS = [0.55, 0.2, 0.85, 0.4, 1, 0.3, 0.7, 0.1, 0.8, 0.45];  // varied drop pattern
    var strandsG = el('g', {}, svg);
    function build() {
      strandsG.innerHTML = '';
      var w = wrap.clientWidth, h = window.innerHeight;
      if (!w) return;
      var count = Math.max(2, Math.round(w / 46));
      for (var i = 0; i < count; i++) {
        var x = w * (i + 0.5) / count + (hash(i, 1) - 0.5) * 12;
        var len = Math.min(h * 0.5, 90 + LENGTHS[i % LENGTHS.length] * 260);
        var g = el('g', { 'class': 'strand' }, strandsG);
        g.style.transformOrigin = x + 'px 0px';
        g.style.animationDelay = (-hash(i, 3) * 9) + 's';
        g.style.animationDuration = (7 + hash(i, 4) * 4) + 's';
        el('line', { x1: x, y1: 0, x2: x, y2: len, stroke: 'rgba(60,45,30,0.5)', 'stroke-width': 0.8 }, g);
        var glow = el('circle', { cx: x, cy: len + 9, r: 18, fill: 'url(#bulb-glow)', 'class': 'bulb-glow' }, g);
        glow.style.animationDuration = (3 + hash(i, 5) * 3) + 's';
        glow.style.animationDelay = (-hash(i, 6) * 5) + 's';
        el('rect', { x: x - 2, y: len - 1, width: 4, height: 5, rx: 0.8, fill: '#4a3a2c' }, g);
        el('circle', { cx: x, cy: len + 8.5, r: 4.6, fill: '#ffe6a8' }, g);
        el('ellipse', { cx: x - 1.4, cy: len + 7, rx: 1.1, ry: 1.6, fill: 'rgba(255,255,255,0.7)' }, g);
      }
    }
    var pending = false;
    window.addEventListener('resize', function() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function() { pending = false; build(); });
    });
    build();
  })();

  // Reading nook: the reader picks a book off the shelf and goes into freefall when you scroll down
  (function readingNook() {
    var nook = document.querySelector('.reading-nook');
    var sprite = document.getElementById('nook-sprite');
    if (!sprite) return;
    var book = shelfBooks[Math.floor(Math.random() * shelfBooks.length)];
    document.querySelectorAll('.nook-book-cover').forEach(function(c) { c.setAttribute('fill', book.color); });
    document.getElementById('nook-title').textContent = 'Reading ' + book.title + ' by ' + book.author;

    // The reader stays settled when the nook is part of the page content.
    if (nook.closest('.about-scene')) return;

    // Freefall only while scroll-down events keep coming; land as soon as they stop
    var landTimer, settleTimer;
    function land() {
      clearTimeout(landTimer);
      if (!sprite.classList.contains('falling')) return;
      sprite.classList.remove('falling');
      sprite.classList.add('landing');
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function() { sprite.classList.remove('landing'); }, 300);
    }
    function fall() {
      if (getComputedStyle(nook).display === 'none') return;
      sprite.classList.remove('landing');
      sprite.classList.add('falling');
      clearTimeout(landTimer); clearTimeout(settleTimer);
      landTimer = setTimeout(land, 80);
    }
    ['.projects', '.sidebar'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var last = el.scrollTop;
      el.addEventListener('scroll', function() {
        if (el.scrollTop > last) fall(); else land();
        last = el.scrollTop;
      }, { passive: true });
    });
    var lastWindowScroll = window.scrollY;
    window.addEventListener('scroll', function() {
      if (window.scrollY > lastWindowScroll) fall(); else land();
      lastWindowScroll = window.scrollY;
    }, { passive: true });
    window.addEventListener('wheel', function(e) { if (e.deltaY > 0) fall(); else land(); }, { passive: true });
  })();
})();
