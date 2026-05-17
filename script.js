
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
      'masine':'masine.html',
    
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

  if(product.category === 'Malčeri za bagere'){
    parts.push({ title: 'Malčeri za bagere', href: 'pregled.html?node=malceri-za-bagere' });
  } else {
    parts.push({ title: 'Malčeri', href: 'pregled.html?node=malceri' });
  }
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





  const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": []
};

let position = 1;

// Početna
breadcrumbSchema.itemListElement.push({
  "@type": "ListItem",
  "position": position++,
  "name": "Početna",
  "item": "https://plugeks.rs/"
});

// Delovi
breadcrumbSchema.itemListElement.push({
  "@type": "ListItem",
  "position": position++,
  "name": "Delovi za mašine",
  "item": "https://plugeks.rs/delovi-za-masine.html"
});

// Sekcija
breadcrumbSchema.itemListElement.push({
  "@type": "ListItem",
  "position": position++,
  "name": product.section,
  "item": "https://plugeks.rs/"
});

// Proizvod
breadcrumbSchema.itemListElement.push({
  "@type": "ListItem",
  "position": position++,
  "name": product.name,
  "item": productUrl
});

// Dodavanje u head
const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(breadcrumbSchema);
document.head.appendChild(script);
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
  'Alpego': 'alpego',
  'Amazone': 'amazone',
  'Artera': 'artera',
  'Breviglieri': 'breviglieri',
  'Carraro': 'carraro',
  'Celli': 'celli',
  'Euroma': 'euroma',
  'Feraboli': 'ferabolli',
  'Forigo': 'forigo',
  'Frandent': 'frandent',
  'Howard': 'howard',
  'Maletti': 'maletti',
  'Maschio': 'maschio',
  'Morra': 'morra',
  'Pegoraro': 'pegoraro',
  'Perugini': 'perugini',
  'Remac': 'remac',
  'Sicma / Landsberg': 'sicma',
  'Vigolo': 'vigolo',
  'Lely': 'lely',
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
  img.loading = "lazy";
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
    const productUrl = "https://plugeks.rs/proizvod.html?id=" + encodeURIComponent(product.id);


// OG TITLE
let ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) {
  ogTitle.setAttribute("content", product.name + " | Plugeks");
}

// OG DESCRIPTION
let ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc) {
  ogDesc.setAttribute(
    "content",
    product.name + " - prodaja i dostupnost u Srbiji. Kontaktirajte Plugeks."
  );
}

// OG URL
let ogUrl = document.querySelector('meta[property="og:url"]');
if (ogUrl) {
  ogUrl.setAttribute(
    "content",
    "https://plugeks.rs/proizvod.html?id=" + encodeURIComponent(product.id)
  );
}



let ogImage = document.querySelector('meta[property="og:image"]');

if (ogImage) {
  ogImage.setAttribute(
    "content",
    "https://plugeks.rs/images/" + product.id + ".jpg"
  );
}



document.querySelector('meta[property="og:title"]')?.setAttribute(
  "content",
  product.name + " | Plugeks"
);
    let metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) {
 metaDesc.setAttribute(
  "content",
  product.name + " - prodaja i dostupnost u Srbiji. Kontaktirajte Plugeks za cenu i poručivanje delova za poljoprivredne mašine."
);
}

let canonical = document.querySelector('link[rel="canonical"]');

if (!canonical) {
  canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  document.head.appendChild(canonical);
}

canonical.setAttribute(
  "href",
  "https://plugeks.rs/proizvod.html?id=" + encodeURIComponent(product.id)
);
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
 '<img src="' + img.src + '" alt="' + product.name + '" loading="lazy">'
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
 document.querySelector('#imageSlot').innerHTML =
  `<img src="${product.images[0]}" alt="${product.name}" loading="lazy">`;
}
const thumbs = document.querySelector('.product-thumbs');

if(product.images && thumbs){
  thumbs.innerHTML = '';

  product.images.forEach(src => {
    const div = document.createElement('div');
    div.className = 'thumb-slot';

    const img = document.createElement('img');
    img.src = src;
img.alt = product.name;
img.loading = "lazy";
    div.appendChild(img);

    div.onclick = () => {document.querySelector('#imageSlot').innerHTML =
  `<img src="${src}" alt="${product.name}" loading="lazy">`;
      
    };

    thumbs.appendChild(div);
  });
}





const oldProductSchema = document.querySelector('#productSchema');
if (oldProductSchema) oldProductSchema.remove();

const productSchema = document.createElement("script");
productSchema.type = "application/ld+json";
productSchema.id = "productSchema";

productSchema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description || product.name + " u ponudi Plugeks.",
  "image": "https://plugeks.rs/images/" + product.id + ".jpg",
  "brand": {
    "@type": "Brand",
    "name": product.group || "Plugeks"
  },
  "category": product.category || "Delovi za poljoprivredne mašine",
  "url": productUrl,
  "offers": {
    "@type": "Offer",
    "url": productUrl,
    "priceCurrency": "RSD",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "LocalBusiness",
      "name": "Plugeks",
      "telephone": "+381621948387",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Žabalj",
        "addressCountry": "RS"
      }
    }
  }
});

document.head.appendChild(productSchema);
setupProductNavigation(pid);
setupProductShare(product);



























let recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");

recent = recent.filter(id => id !== pid);
recent.unshift(pid);
recent = recent.slice(0, 6);

localStorage.setItem("recentProducts", JSON.stringify(recent));
      }
  function inferBackLink(product){
    if(product.section === 'Mašine'){
  if(product.category === 'Malčeri za bagere'){
    return 'pregled.html?node=malceri-za-bagere';
  }
  return 'pregled.html?node=malceri';
}
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






function setupProductNavigation(currentProductId){
  const prevBtn = document.getElementById("prevProductBtn");
  const nextBtn = document.getElementById("nextProductBtn");

  if(!prevBtn || !nextBtn) return;

  let productList = [];

  Object.values(NODES).forEach(node => {
    if(node.kind === "products" && node.products && node.products.includes(currentProductId)){
      productList = node.products;
    }
  });

  const currentIndex = productList.indexOf(currentProductId);

  if(currentIndex === -1) return;

  if(currentIndex > 0){
    prevBtn.onclick = function(){
      window.location.href = productHref(productList[currentIndex - 1]);
    };
  } else {
    prevBtn.disabled = true;
  }

  if(currentIndex < productList.length - 1){
    nextBtn.onclick = function(){
      window.location.href = productHref(productList[currentIndex + 1]);
    };
  } else {
    nextBtn.disabled = true;
  }
}













function setupProductShare(product){

  const btn = document.getElementById("shareProductBtn");

  if(!btn) return;

  btn.addEventListener("click", async () => {

    const shareData = {
      title: product.name + " | Plugeks",
      text: product.name,
      url: window.location.href
    };

    // TELEFON
    if(navigator.share){

      try{
        await navigator.share(shareData);
      } catch(err){}

    }

    // DESKTOP FALLBACK
    else{

      try{

        await navigator.clipboard.writeText(window.location.href);

        btn.textContent = "Link kopiran";

        setTimeout(() => {
          btn.textContent = "Podeli proizvod";
        }, 2000);

      } catch(err){

        alert(window.location.href);

      }

    }

  });

}





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
    setupQuickSearch();
    setupPhoneFab();
    if(document.body.dataset.template === 'node') renderNodePage();
    if(document.body.dataset.template === 'product') renderProductPage();
  
  renderRecentProductsHome();
  
  const topSlider = document.querySelector('.top-products-grid');

if(topSlider && window.innerWidth < 768){
  let index = 0;

  setInterval(() => {
    const cards = topSlider.querySelectorAll('.top-product-card');
    if(!cards.length) return;

    index = (index + 1) % cards.length;

    topSlider.scrollTo({
      left: cards[index].offsetLeft - topSlider.offsetLeft,
      behavior: 'smooth'
    });
  }, 3000);
}
  
  
  });
})();




// ======================
// Nedavno gledani proizvodi
// ======================

(function () {

  const CURRENT_ID = window.currentProduct?.id;

  if (!CURRENT_ID) return;

  let recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");

  recent = recent.filter(id => id !== CURRENT_ID);

  recent.unshift(CURRENT_ID);

  recent = recent.slice(0, 6);

  localStorage.setItem("recentProducts", JSON.stringify(recent));

})();

/*function renderRecentProducts() {

  const recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");

  if (!recent.length) return;

  const validProducts = recent
    .map(id => window.SITE_DATA.products[id])
    .filter(Boolean);

  if (!validProducts.length) return;

  const section = document.createElement("section");

  section.className = "recent-products-section";

  section.innerHTML = `
    <div class="container">
      <h2 class="recent-title">Nedavno ste gledali</h2>

      <div class="recent-products-grid">
        ${validProducts.map(product => `
          <a class="recent-product-card" href="proizvod.html?id=${product.id}">
            <img src="images/${product.id}.jpg" alt="${product.name}">
            <span>${product.name}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(section);
}

document.addEventListener("DOMContentLoaded", renderRecentProducts);
*/






























































function renderRecentProductsHome(){
  const grid = document.querySelector("#recentProductsGrid");
  const section = document.querySelector("#recentProductsSection");

  if(!grid || !section) return;

  const recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");

  const products = recent
    .map(id => PRODUCTS[id])
    .filter(Boolean);

  if(!products.length) return;

  grid.innerHTML = products.map(p => `
    <a class="product-card" href="proizvod.html?id=${p.id}">
      <div class="product-card-image">
        <img 
          src="images/${p.id}.jpg" 
          alt="${p.name}"
          onerror="
            this.onerror=function(){
              this.onerror=function(){
                this.parentElement.innerHTML='<div class=&quot;product-card-placeholder&quot;>Slika</div>';
              };
              this.src='images/${p.id}.webp';
            };
            this.src='images/${p.id}.png';
          "
        >
      </div>
      <h3 class="product-card-title">${p.name}</h3>
    </a>
  `).join("");

  section.style.display = "block";
}











function setupQuickSearch(){






 const NODES = window.SITE_DATA.nodes;

  function nodeHref(id){
    const map = {
      'delovi-za-masine':'delovi-za-masine.html',
      'plugovi':'plugovi.html',
      'podrivaci':'podrivaci.html',
      'drljace':'drljace.html',
      'freze':'freze.html',
      'setvospremaci':'setvospremaci.html',
      'masine':'masine.html',
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











  const modal = document.getElementById('quickSearchModal');
  const openBtn = document.getElementById('quickSearchOpen');
  const closeBtn = document.getElementById('quickSearchClose');

  const type = document.getElementById('quickType');
  const level1 = document.getElementById('quickLevel1');
  const level2 = document.getElementById('quickLevel2');
  const level3 = document.getElementById('quickLevel3');
  const go = document.getElementById('quickSearchGo');

  if(!modal || !openBtn) return;

  let selectedNode = null;

  function fillSelect(select, nodeIds, placeholder){
    select.innerHTML = `<option value="">${placeholder}</option>`;
    nodeIds.forEach(id => {
      const node = NODES[id];
      if(node){
        select.innerHTML += `<option value="${id}">${node.title}</option>`;
      }
    });
    select.disabled = false;
  }

  function reset(select, placeholder){
    select.innerHTML = `<option value="">${placeholder}</option>`;
    select.disabled = true;
  }

  openBtn.onclick = () => modal.classList.add('open');
  closeBtn.onclick = () => modal.classList.remove('open');

  modal.onclick = e => {
    if(e.target === modal) modal.classList.remove('open');
  };

  type.onchange = function(){
    selectedNode = null;
    reset(level1, 'Izaberi kategoriju');
    reset(level2, 'Izaberi podkategoriju');
    reset(level3, 'Izaberi brend / grupu');

    const node = NODES[this.value];
    if(node && node.children){
      fillSelect(level1, node.children, 'Izaberi kategoriju');
    }
  };

  level1.onchange = function(){
    selectedNode = this.value;
    reset(level2, 'Izaberi podkategoriju');
    reset(level3, 'Izaberi brend / grupu');

    const node = NODES[this.value];
    if(node && node.children && node.children.length){
      fillSelect(level2, node.children, 'Izaberi podkategoriju');
    }
  };

  level2.onchange = function(){
    selectedNode = this.value;
    reset(level3, 'Izaberi brend / grupu');

    const node = NODES[this.value];
    if(node && node.children && node.children.length){
      fillSelect(level3, node.children, 'Izaberi brend / grupu');
    }
  };

  level3.onchange = function(){
    selectedNode = this.value;
  };

  go.onclick = function(){
    if(selectedNode){
      window.location.href = nodeHref(selectedNode);
    }
  };
}
