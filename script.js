
(function(){
  const DATA = window.SITE_DATA || {nodes:{},products:{},menuTree:[]};
  const NODES = DATA.nodes || {};
  const PRODUCTS = DATA.products || {};
  const MENU_TREE = DATA.menuTree || [];
  const PHONE = '+381621948387';

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }
  function text(v){ return document.createTextNode(v); }

  function nodeHref(id){
    const map = {
      'delovi-za-masine':'delovi-za-masine.html',
      'plugovi':'plugovi.html',
      'podrivaci':'podrivaci.html',
      'drljace':'drljace.html',
      'freze':'freze.html',
      'setvospremaci':'setvospremaci.html',
      'plugovi-raonici':'plugovi-raonici.html',
      'plugovi-daske':'plugovi-daske.html',
      'plugovi-plazovi':'plugovi-plazovi.html',
      'plugovi-spicevi':'plugovi-spicevi.html',
      'plugovi-grudi':'plugovi-grudi.html',
      'plugovi-nastavci':'plugovi-nastavci.html',
      'plugovi-povisenja':'plugovi-povisenja.html',
      'plugovi-resetke':'plugovi-resetke.html',
      'setvospremaci-opruge':'setvospremaci-opruge.html',
      'setvospremaci-drzaci':'setvospremaci-drzaci.html',
      'setvospremaci-brisaci':'setvospremaci-brisaci.html',
      'setvospremaci-motike':'setvospremaci-motike.html',
      'setvospremaci-rotori':'setvospremaci-rotori.html'
    };
    return map[id] || ('pregled.html?node=' + encodeURIComponent(id));
  }
  function productHref(id){ return 'proizvod.html?id=' + encodeURIComponent(id); }

  function currentNodeId(){
    const bodyNode = document.body.dataset.node;
    if(bodyNode) return bodyNode;
    const params = new URLSearchParams(location.search);
    return params.get('node');
  }
  function currentProductId(){
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }









function breadcrumbHtmlForNode(nodeId){
  const parts = [{ title: 'Početna', href: 'index.html' }];
  let cur = NODES[nodeId];
  const stack = [];

  while(cur){
    stack.push(cur);
    cur = cur.parent ? NODES[cur.parent] : null;
  }

  stack.reverse().forEach(node => {
    parts.push({
      title: node.title,
      href: nodeHref(node.id)
    });
  });

  return parts.map((part, index) => {
    if(index === parts.length - 1){
      return '<span>' + escapeHtml(part.title) + '</span>';
    }
    return '<a href="' + part.href + '">' + escapeHtml(part.title) + '</a>';
  }).join(' / ');
}

function breadcrumbHtmlForProduct(product){
  const parts = [{ title: 'Početna', href: 'index.html' }];

  if(product.section === 'Mašine'){
    parts.push({ title: 'Mašine', href: 'masine.html' });
    parts.push({ title: 'Malčeri', href: 'malceri.html' });
  } else {
    parts.push({ title: 'Delovi za mašine', href: 'delovi-za-masine.html' });

    if(product.section === 'Plugovi'){
      parts.push({ title: 'Delovi za plugove', href: 'plugovi.html' });

      const map = {
        'Raonici':'plugovi-raonici.html',
        'Daske za plug':'plugovi-daske.html',
        'Plazovi':'plugovi-plazovi.html',
        'Vrh / špic raonika':'plugovi-spicevi.html',
        'Umetak / grudi daske':'plugovi-grudi.html',
        'Nastavak / produžetak daske':'plugovi-nastavci.html',
        'Deflektor / povišenje daske':'plugovi-povisenja.html',
        'Rešetke daske':'plugovi-resetke.html'
      };

      if(map[product.category]){
        parts.push({ title: product.category, href: map[product.category] });
      }

      if(product.group){
        const categoryNodeMap = {
          'Raonici':'plugovi-raonici',
          'Daske za plug':'plugovi-daske',
          'Plazovi':'plugovi-plazovi',
          'Vrh / špic raonika':'plugovi-spicevi',
          'Umetak / grudi daske':'plugovi-grudi',
          'Nastavak / produžetak daske':'plugovi-nastavci',
          'Deflektor / povišenje daske':'plugovi-povisenja',
          'Rešetke daske':'plugovi-resetke'
        };

        const catId = categoryNodeMap[product.category];
        if(catId){
          const groupNodeId = findGroupNodeId(catId, product.group);
          parts.push({
            title: product.group,
            href: nodeHref(groupNodeId)
          });
        }
      }
    } else if(product.section === 'Podrivači'){
      parts.push({ title: 'Delovi za podrivače', href: 'podrivaci.html' });
    } else if(product.section === 'Drljače'){
      parts.push({ title: 'Delovi za drljače', href: 'drljace.html' });
    } else if(product.section === 'Freze'){
      parts.push({ title: 'Noževi za freze', href: 'freze.html' });
    } else if(product.section === 'Setvospremači'){
      parts.push({ title: 'Delovi za setvospremače', href: 'setvospremaci.html' });

      const map = {
        'Opruge':'setvospremaci-opruge.html',
        'Držači / nosači':'setvospremaci-drzaci.html',
        'Brisači traga':'setvospremaci-brisaci.html',
        'Motike i radni delovi':'setvospremaci-motike.html',
        'Rotori i delovi':'setvospremaci-rotori.html'
      };

      if(map[product.category]){
        parts.push({ title: product.category, href: map[product.category] });
      }
    }
  }

  parts.push({ title: product.name, href: null });

  return parts.map((part, index) => {
    if(index === parts.length - 1 || !part.href){
      return '<span>' + escapeHtml(part.title) + '</span>';
    }
    return '<a href="' + part.href + '">' + escapeHtml(part.title) + '</a>';
  }).join(' / ');
}











  function breadcrumbForNode(nodeId){
    const parts=['Početna'];
    let cur = NODES[nodeId];
    const stack = [];
    while(cur){
      stack.push(cur.title);
      cur = cur.parent ? NODES[cur.parent] : null;
    }
    stack.reverse().forEach(v=>parts.push(v));
    return parts.join(' / ');
  }
  function breadcrumbForProduct(product){
    const parts=['Početna','Delovi za mašine'];
    if(product.section === 'Plugovi'){
      parts.push('Delovi za plugove');
      parts.push(product.category);
      if(product.group) parts.push(product.group);
    } else if(product.section === 'Podrivači'){
      parts.push('Delovi za podrivače');
    } else if(product.section === 'Drljače'){
      parts.push('Delovi za drljače');
    } else if(product.section === 'Freze'){
      parts.push('Noževi za freze');
    } else if(product.section === 'Setvospremači'){
      parts.push('Delovi za setvospremače');
      parts.push(product.category);
    }
    parts.push(product.name);
    return parts.join(' / ');
  }

function createSectionCard(title, href, count){
  const a = document.createElement('a');
  a.className = 'category-card';
  a.href = href;

  const imageWrap = document.createElement('div');
  imageWrap.className = 'category-card-image';

  const img = document.createElement('img');
 let imgName = href;

if(href.includes('.html')){
  imgName = href.replace('.html','');
}

if(href.includes('node=')){
  imgName = href.split('node=')[1];
}

/* Brendovi - jedna slika za isti brend */
const brandMap = {
  'Lemken': 'lemken',
  'Kverneland': 'kverneland',
  'IMT': 'imt',
  'Kuhn': 'kuhn',
  'Vogel & Noot': 'vogel-noot',
  'Regent': 'regent',
  'Overum': 'overum',
  'OLT': 'olt',
  'Rabewerk': 'rabewerk',
  'Pöttinger-Landsberg': 'pottinger-landsberg',
  'Gregoire Besson': 'gregoire-besson',
  'Eberhardt': 'eberhardt',
  'Gassner': 'gassner',
  'Niemeyer': 'niemeyer',
  'Krone': 'krone',
  'Frost': 'frost',
};

if(brandMap[title]){
  img.src = 'images/brands/' + brandMap[title] + '.png';
} else {
  img.src = 'images/' + imgName + '.jpg';
}
img.onerror = function(){
  this.onerror = null;

  if(brandMap[title]){
    this.src = 'images/brands/' + brandMap[title] + '.jpg';
  } else {
    this.src = 'images/' + imgName + '.png';
  }

  this.onerror = function(){
    imageWrap.innerHTML = '<div class="category-card-placeholder">Slika</div>';
  };
};
  imageWrap.appendChild(img);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'category-card-title';
  titleDiv.textContent = title;

  a.appendChild(imageWrap);
  a.appendChild(titleDiv);

  return a;
}

  function groupProductCount(nodeId){
    const node = NODES[nodeId];
    if(!node) return 0;
    if(node.kind === 'products') return node.products.length;
    return node.children.reduce((sum, cid)=> sum + groupProductCount(cid), 0);
  }

  function renderNodePage(){
    const nodeId = currentNodeId();
    const node = NODES[nodeId];
    if(!node) return;
    document.title = node.title + ' | Plugeks';
qs('#breadcrumb').innerHTML = breadcrumbHtmlForNode(nodeId);
    qs('#pageTitle').textContent = node.title;
    qs('#backLink').href = node.parent ? nodeHref(node.parent) : 'index.html';
    qs('#nodeDesc').textContent =  '';
    // qs('#statCount').textContent = (node.kind === 'products' ? node.products.length : groupProductCount(nodeId)) + ' proizvoda';
    const content = qs('#nodeContent');
    content.innerHTML='';

    if(node.kind === 'links'){
      const wrap = document.createElement('div'); wrap.className='category-grid';
      node.children.forEach(cid=>{
        const child = NODES[cid];
        wrap.appendChild(createSectionCard(child.title, nodeHref(cid), groupProductCount(cid)));
      });
      content.appendChild(wrap);
    } else if(node.kind === 'products'){
      const wrap = document.createElement('div');
wrap.className = 'product-grid';

node.products.forEach(pid => {
  const p = PRODUCTS[pid];

  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = productHref(pid);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-card-image';

  const img = document.createElement('img');
  img.src = 'images/' + p.id + '.jpg';
  img.alt = p.name;
  img.onerror = function () {
    this.onerror = null;
    this.src = 'images/' + p.id + '.png';
    this.onerror = function () {
      this.onerror = null;
      this.src = 'images/' + p.id + '.webp';
      this.onerror = function () {
        imageWrap.innerHTML = '<div class="product-card-placeholder">Slika</div>';
      };
    };
  };

  imageWrap.appendChild(img);

  const title = document.createElement('h3');
  title.className = 'product-card-title';
  title.textContent = p.name;

  card.appendChild(imageWrap);
  card.appendChild(title);

  wrap.appendChild(card);
});

content.appendChild(wrap);
    }
  }

  function renderProductPage(){
    const pid = currentProductId();
    const product = PRODUCTS[pid];
    if(!product) return;
    document.title = product.name + ' | Plugeks';
qs('#breadcrumb').innerHTML = breadcrumbHtmlForProduct(product);
    qs('#backLink').href = inferBackLink(product);
   qs('#prodTitle').textContent = product.name;
qs('#prodText').innerHTML = (product.description || 'Za više informacija i dostupnost pozovite nas.').replace(/\n/g, '<br>');
qs('#metaSection').textContent = product.section;
qs('#metaCategory').textContent = product.category;
qs('#metaGroup').textContent = product.group || 'Direktan proizvod';
   const formats = ["jpg", "png", "webp"];
let imgFound = false;

for (let ext of formats) {
  const img = new Image();
  img.src = "images/" + product.id + "." + ext;

  img.onload = function () {
    if (!imgFound) {
      qs('#imageSlot').innerHTML =
        '<img src="' + img.src + '" style="width:100%;max-width:500px;border-radius:8px;">';
      imgFound = true;
    }
  };
}

setTimeout(() => {
  if (!imgFound) {
    qs('#imageSlot').innerHTML =
      '<div style="padding:40px;text-align:center;color:#888;">Slika uskoro</div>';
  }
}, 300);
if(product.images && product.images.length){
  document.querySelector('#imageSlot').innerHTML = `<img src="${product.images[0]}">`;
}
const thumbs = document.querySelector('.product-thumbs');

if(product.images && thumbs){
  thumbs.innerHTML = '';

  product.images.forEach(src => {
    const div = document.createElement('div');
    div.className = 'thumb-slot';

    const img = document.createElement('img');
    img.src = src;

    div.appendChild(img);

    div.onclick = () => {
      document.querySelector('#imageSlot').innerHTML = `<img src="${src}">`;
    };

    thumbs.appendChild(div);
  });
}
      }
  function inferBackLink(product){
    if(product.section === 'Plugovi'){
      const map = {
        'Raonici':'plugovi-raonici.html',
        'Daske za plug':'plugovi-daske.html',
        'Plazovi':'plugovi-plazovi.html',
        'Vrh / špic raonika':'plugovi-spicevi.html',
        'Umetak / grudi daske':'plugovi-grudi.html',
        'Nastavak / produžetak daske':'plugovi-nastavci.html',
        'Deflektor / povišenje daske':'plugovi-povisenja.html',
        'Rešetke daske':'plugovi-resetke.html'
      };
      for(const [k,v] of Object.entries(map)){
        if(product.category === k) return product.group ? ('pregled.html?node=' + encodeURIComponent(findGroupNodeId(v.replace('.html',''), product.group))) : v;
      }
    }
    if(product.section === 'Podrivači') return 'podrivaci.html';
    if(product.section === 'Drljače') return 'drljace.html';
    if(product.section === 'Freze') return 'freze.html';
    if(product.section === 'Setvospremači'){
      const map = {
        'Opruge':'setvospremaci-opruge.html',
        'Držači / nosači':'setvospremaci-drzaci.html',
        'Brisači traga':'setvospremaci-brisaci.html',
        'Motike i radni delovi':'setvospremaci-motike.html',
        'Rotori i delovi':'setvospremaci-rotori.html'
      };
      return map[product.category] || 'setvospremaci.html';
    }
    return 'delovi-za-masine.html';
  }
  function findGroupNodeId(catId, group){
    const node = NODES[catId];
    if(!node) return catId;
    const found = node.children.find(cid => NODES[cid].title === group);
    return found || catId;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

  function setupDrawer(){
    const btn=document.getElementById('menuToggle');
    const drawer=document.getElementById('mobileDrawer');
    const overlay=document.getElementById('drawerOverlay');
    const closeBtn=document.getElementById('drawerClose');
    const list=document.getElementById('drawerList');
    const title=document.getElementById('drawerTitle');
    if(!drawer || !list || !title) return;
    let stack=[];
    function closeDrawer(){drawer.classList.remove('open');document.body.style.overflow='';stack=[];renderLevel(MENU_TREE,'Meni');}
    function openDrawer(){drawer.classList.add('open');document.body.style.overflow='hidden';renderLevel(MENU_TREE,'Meni');}
    function renderLevel(items, heading){
      title.textContent = heading;
      list.innerHTML='';
      if(stack.length){
        const back=document.createElement('div');back.className='drawer-backbar';
        const backBtn=document.createElement('button');backBtn.className='drawer-back';backBtn.innerHTML='&#8249;';
        backBtn.onclick=function(){const prev=stack.pop(); renderLevel(prev.items, prev.heading);};
        const backTitle=document.createElement('div');backTitle.className='drawer-title-mini';backTitle.textContent=heading;
        back.appendChild(backBtn); back.appendChild(backTitle); list.appendChild(back);
      }
      items.forEach(function(item){
        const row=document.createElement('div'); row.className='drawer-row';
        const link=document.createElement('a'); link.className='drawer-link'; link.textContent=item.title; link.href=item.href || '#';
        link.addEventListener('click', closeDrawer);
        row.appendChild(link);
        if(item.children && item.children.length){
          const arrow=document.createElement('button'); arrow.className='drawer-arrow'; arrow.innerHTML='&#8250;';
          arrow.onclick=function(e){e.preventDefault(); stack.push({items, heading}); renderLevel(item.children, item.title);};
          row.appendChild(arrow);
        }
        list.appendChild(row);
      });
    }
    renderLevel(MENU_TREE,'Meni');
    btn && btn.addEventListener('click', function(e){e.preventDefault(); openDrawer();});
    closeBtn && closeBtn.addEventListener('click', closeDrawer);
    overlay && overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function(e){if(e.key==='Escape') closeDrawer();});
    try{if('scrollRestoration' in history){history.scrollRestoration='manual';}}catch(e){}
    window.addEventListener('pageshow', function(){window.scrollTo(0,0); closeDrawer();});
  }

  function setupPhoneFab(){
    const fab = qs('.phone-fab');
    if(fab){
      fab.href = 'tel:' + PHONE.replace(/[^\d+]/g,'');
      fab.textContent = 'Pozovite nas';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    setupDrawer();
    setupPhoneFab();
    if(document.body.dataset.template === 'node') renderNodePage();
    if(document.body.dataset.template === 'product') renderProductPage();
  });
})();








