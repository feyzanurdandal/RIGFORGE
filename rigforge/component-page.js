
(() => {
  'use strict';
  const body=document.body;
  const key=body.dataset.componentKey;
  const label=body.dataset.componentLabel;
  const cards=[...document.querySelectorAll('.product-card')];
  const filterSelects=[...document.querySelectorAll('[data-filter]')];
  const storageKey=`rigforgeSelected_${key}`;
  const allKeys=['cpu','gpu','motherboard','ram','storage','case','psu','cooler'];
  const $=id=>document.getElementById(id);
  const money=value=>Number(value||0).toLocaleString('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0});
  function readSelection(componentKey){try{return JSON.parse(localStorage.getItem(`rigforgeSelected_${componentKey}`)||'null')}catch{return null}}
  function selections(){return allKeys.map(readSelection).filter(Boolean)}
  function total(){return selections().reduce((sum,item)=>sum+Number(item.price||0),0)}
  function syncBuildToCart(){
    let cart=[];
    try{cart=JSON.parse(localStorage.getItem('rigforgeCart')||'[]')}catch{cart=[]}
    if(!Array.isArray(cart))cart=[];
    const otherItems=cart.filter(item=>item.source!=='builder');
    const buildItems=selections().map(item=>({
      id:`builder-${item.key}`,
      source:'builder',
      componentKey:item.key,
      name:item.name,
      category:item.label,
      price:Number(item.price||0),
      qty:1,
      image:`https://placehold.co/300x300/0f1320/ffffff?text=${encodeURIComponent((item.label||'RF').slice(0,8))}`
    }));
    localStorage.setItem('rigforgeCart',JSON.stringify([...otherItems,...buildItems]));
    document.querySelectorAll('#headerCartCount').forEach(el=>el.textContent=String([...otherItems,...buildItems].reduce((n,x)=>n+Number(x.qty||1),0)));
  }
  function wattage(){return selections().reduce((sum,item)=>sum+Number(item.wattage||0),0)}
  function refreshGlobal(){const count=selections().length;const pct=(count/8)*100;if($('progressText'))$('progressText').textContent=`${count} / 8`;if($('selectedCount'))$('selectedCount').textContent=`${count} / 8`;if($('progressFill'))$('progressFill').style.width=`${pct}%`;if($('buildTotal'))$('buildTotal').textContent=money(total());if($('summaryBuildTotal'))$('summaryBuildTotal').textContent=money(total());if($('estimatedWattage'))$('estimatedWattage').textContent=`${wattage()} W`;}
  function setSelected(card,save=true){cards.forEach(c=>{c.classList.remove('selected');const b=c.querySelector('.select-button');if(b)b.textContent='Bileşeni Seç'});if(!card){if(save){localStorage.removeItem(storageKey);syncBuildToCart();}$('selectedProductName').textContent='Henüz seçilmedi';$('selectedProductPrice').textContent='₺0';$('summarySelectedName').textContent='Seçilmedi';$('previewCode').textContent='RF';$('selectionHint').textContent='Bir ürün seçerek devam edin.';$('addToBuildButton').disabled=true;$('continueButton').classList.add('disabled');refreshGlobal();return}
    card.classList.add('selected');card.querySelector('.select-button').textContent='Seçimi Kaldır';const item={key,label,name:card.dataset.name,brand:card.dataset.brandName,price:Number(card.dataset.price||0),wattage:Number(card.dataset.wattage||0)};if(save){localStorage.setItem(storageKey,JSON.stringify(item));syncBuildToCart();}$('selectedProductName').textContent=item.name;$('selectedProductPrice').textContent=money(item.price);$('summarySelectedName').textContent=item.name;$('previewCode').textContent=(item.brand||label).slice(0,3).toUpperCase();$('selectionHint').textContent='Seçiminiz kaydedildi.';$('addToBuildButton').disabled=false;$('continueButton').classList.remove('disabled');refreshGlobal();}
  function applyFilters(){let visible=0;cards.forEach(card=>{const show=filterSelects.every(select=>select.value==='all'||String(card.dataset[select.dataset.filter])===select.value);card.hidden=!show;if(show)visible++});$('resultCount').textContent=String(visible);$('emptyState').hidden=visible!==0}
  cards.forEach(card=>card.querySelector('.select-button')?.addEventListener('click',()=>{
    const current=readSelection(key);
    if(current && current.name===card.dataset.name){ setSelected(null,true); }
    else { setSelected(card,true); }
  }));
  filterSelects.forEach(select=>select.addEventListener('change',applyFilters));
  $('resetFilters')?.addEventListener('click',()=>{filterSelects.forEach(s=>s.value='all');applyFilters()});
  $('resetSelectionButton')?.addEventListener('click',()=>setSelected(null,true));
  $('addToBuildButton')?.addEventListener('click',()=>{const selected=readSelection(key);if(selected){syncBuildToCart();$('selectionHint').textContent=`${selected.name} sisteme ve sepete eklendi.`;$('continueButton').classList.remove('disabled')}});
  $('saveBuildButton')?.addEventListener('click',()=>{localStorage.setItem('rigforgeSavedBuild',JSON.stringify({savedAt:new Date().toISOString(),parts:selections(),total:total()}));const btn=$('saveBuildButton');const old=btn.textContent;btn.textContent='Kaydedildi ✓';setTimeout(()=>btn.textContent=old,1400)});
  const stored=readSelection(key);const storedCard=stored&&cards.find(c=>c.dataset.name===stored.name);setSelected(storedCard||null,false);syncBuildToCart();applyFilters();refreshGlobal();
})();
