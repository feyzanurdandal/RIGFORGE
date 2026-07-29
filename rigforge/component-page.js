(() => {
  'use strict';

  const body = document.body;
  const key = body.dataset.componentKey;
  const label = body.dataset.componentLabel;
  const cards = [...document.querySelectorAll('.product-card')];
  const filterSelects = [...document.querySelectorAll('[data-filter]')];
  const storageKey = `rigforgeSelected_${key}`;
  const allKeys = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'case', 'psu', 'cooler'];
  const $ = id => document.getElementById(id);
  const money = value => Number(value || 0).toLocaleString('tr-TR', {
    style: 'currency', currency: 'TRY', maximumFractionDigits: 0
  });

  function readSelection(componentKey) {
    try { return JSON.parse(localStorage.getItem(`rigforgeSelected_${componentKey}`) || 'null'); }
    catch { return null; }
  }

  function selections() { return allKeys.map(readSelection).filter(Boolean); }
  function total() { return selections().reduce((sum, item) => sum + Number(item.price || 0), 0); }
  function wattage() { return selections().reduce((sum, item) => sum + Number(item.wattage || 0), 0); }
  function normalize(value) { return String(value || '').trim().toLowerCase(); }
  function splitList(value) { return normalize(value).split(',').map(x => x.trim()).filter(Boolean); }

  function itemFromCard(card) {
    return {
      key,
      label,
      name: card.dataset.name,
      brand: card.dataset.brandName,
      price: Number(card.dataset.price || 0),
      wattage: Number(card.dataset.wattage || 0),
      socket: normalize(card.dataset.socket) || null,
      memoryType: normalize(card.dataset.memoryType || card.dataset.type) || null,
      formFactor: normalize(card.dataset.formFactor) || null,
      supportedFormFactors: splitList(card.dataset.supportedFormFactors),
      supportedSockets: splitList(card.dataset.supportedSockets),
      psuWatt: Number(card.dataset.watt || 0)
    };
  }

  function syncBuildToCart() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('rigforgeCart') || '[]'); }
    catch { cart = []; }
    if (!Array.isArray(cart)) cart = [];
    const otherItems = cart.filter(item => item.source !== 'builder');
    const buildItems = selections().map(item => ({
      id: `builder-${item.key}`,
      source: 'builder',
      componentKey: item.key,
      name: item.name,
      category: item.label,
      price: Number(item.price || 0),
      qty: 1,
      image: `https://placehold.co/300x300/0f1320/ffffff?text=${encodeURIComponent((item.label || 'RF').slice(0, 8))}`
    }));
    const finalCart = [...otherItems, ...buildItems];
    localStorage.setItem('rigforgeCart', JSON.stringify(finalCart));
    document.querySelectorAll('#headerCartCount').forEach(el => {
      el.textContent = String(finalCart.reduce((n, x) => n + Number(x.qty || 1), 0));
    });
  }

  function refreshGlobal() {
    const count = selections().length;
    const pct = (count / 8) * 100;
    if ($('progressText')) $('progressText').textContent = `${count} / 8`;
    if ($('selectedCount')) $('selectedCount').textContent = `${count} / 8`;
    if ($('progressFill')) $('progressFill').style.width = `${pct}%`;
    if ($('buildTotal')) $('buildTotal').textContent = money(total());
    if ($('summaryBuildTotal')) $('summaryBuildTotal').textContent = money(total());
    if ($('estimatedWattage')) $('estimatedWattage').textContent = `${wattage()} W`;
  }

  function showCompatibilityError(card, message) {
    card.classList.remove('incompatible');
    void card.offsetWidth;
    card.classList.add('incompatible');
    setTimeout(() => card.classList.remove('incompatible'), 1800);

    let box = document.getElementById('compatibilityAlert');
    if (!box) {
      box = document.createElement('div');
      box.id = 'compatibilityAlert';
      box.className = 'compatibility-alert';
      box.setAttribute('role', 'alert');
      document.body.appendChild(box);
    }
    box.innerHTML = `<strong>Uyumsuz bileşen</strong><span>${message}</span><button type="button" aria-label="Kapat">×</button>`;
    box.classList.add('show');
    box.querySelector('button').onclick = () => box.classList.remove('show');
    clearTimeout(showCompatibilityError.timer);
    showCompatibilityError.timer = setTimeout(() => box.classList.remove('show'), 5500);
  }

  function checkCompatibility(componentKey, card) {
    const candidate = itemFromCard(card);
    const cpu = readSelection('cpu');
    const motherboard = readSelection('motherboard');

    if (componentKey === 'motherboard' && cpu?.socket && candidate.socket && normalize(cpu.socket) !== candidate.socket) {
      return `${cpu.name} işlemcisi ${String(cpu.socket).toUpperCase()} soket kullanıyor. ${candidate.name} ise ${candidate.socket.toUpperCase()} soketli.`;
    }

    if (componentKey === 'cpu' && motherboard?.socket && candidate.socket && normalize(motherboard.socket) !== candidate.socket) {
      return `${motherboard.name} anakartı ${String(motherboard.socket).toUpperCase()} soket kullanıyor. ${candidate.name} ise ${candidate.socket.toUpperCase()} soketli.`;
    }

    if (componentKey === 'ram' && motherboard?.memoryType && candidate.memoryType && normalize(motherboard.memoryType) !== candidate.memoryType) {
      return `${motherboard.name} anakartı ${String(motherboard.memoryType).toUpperCase()} RAM destekliyor. Seçtiğiniz bellek ${candidate.memoryType.toUpperCase()}.`;
    }

    if (componentKey === 'motherboard') {
      const ram = readSelection('ram');
      if (ram?.memoryType && candidate.memoryType && normalize(ram.memoryType) !== candidate.memoryType) {
        return `${ram.name} ${String(ram.memoryType).toUpperCase()} türünde. Seçtiğiniz anakart yalnızca ${candidate.memoryType.toUpperCase()} bellek destekliyor.`;
      }
      const selectedCase = readSelection('case');
      if (selectedCase?.supportedFormFactors?.length && candidate.formFactor && !selectedCase.supportedFormFactors.map(normalize).includes(candidate.formFactor)) {
        return `${candidate.formFactor.toUpperCase()} anakart, seçili ${selectedCase.name} kasaya sığmıyor.`;
      }
    }

    if (componentKey === 'case' && motherboard?.formFactor && candidate.supportedFormFactors.length && !candidate.supportedFormFactors.includes(normalize(motherboard.formFactor))) {
      return `${String(motherboard.formFactor).toUpperCase()} anakart, ${candidate.name} kasaya sığmıyor.`;
    }

    if (componentKey === 'cooler' && cpu?.socket && candidate.supportedSockets.length && !candidate.supportedSockets.includes(normalize(cpu.socket))) {
      return `${candidate.name}, seçili işlemcinin ${String(cpu.socket).toUpperCase()} soketini desteklemiyor.`;
    }

    if (componentKey === 'cpu') {
      const cooler = readSelection('cooler');
      if (cooler?.supportedSockets?.length && candidate.socket && !cooler.supportedSockets.map(normalize).includes(candidate.socket)) {
        return `${cooler.name} soğutucu ${candidate.socket.toUpperCase()} soketi desteklemiyor.`;
      }
    }

    if (componentKey === 'psu') {
      const required = Math.ceil((wattage() + 100) * 1.25);
      if (candidate.psuWatt && candidate.psuWatt < required) {
        return `Bu sistem için en az yaklaşık ${required} W güç kaynağı öneriliyor. Seçtiğiniz model ${candidate.psuWatt} W.`;
      }
    }

    return null;
  }

  function setSelected(card, save = true) {
    cards.forEach(c => {
      c.classList.remove('selected');
      const b = c.querySelector('.select-button');
      if (b) b.textContent = 'Bileşeni Seç';
    });

    if (!card) {
      if (save) {
        localStorage.removeItem(storageKey);
        syncBuildToCart();
      }
      if ($('selectedProductName')) $('selectedProductName').textContent = 'Henüz seçilmedi';
      if ($('selectedProductPrice')) $('selectedProductPrice').textContent = '₺0';
      if ($('summarySelectedName')) $('summarySelectedName').textContent = 'Seçilmedi';
      if ($('previewCode')) $('previewCode').textContent = 'RF';
      if ($('selectionHint')) $('selectionHint').textContent = 'Bir ürün seçerek devam edin.';
      if ($('addToBuildButton')) $('addToBuildButton').disabled = true;
      if ($('continueButton')) $('continueButton').classList.add('disabled');
      refreshGlobal();
      return;
    }

    card.classList.add('selected');
    const selectButton = card.querySelector('.select-button');
    if (selectButton) selectButton.textContent = 'Seçimi Kaldır';
    const item = itemFromCard(card);

    if (save) {
      localStorage.setItem(storageKey, JSON.stringify(item));
      syncBuildToCart();
    }
    if ($('selectedProductName')) $('selectedProductName').textContent = item.name;
    if ($('selectedProductPrice')) $('selectedProductPrice').textContent = money(item.price);
    if ($('summarySelectedName')) $('summarySelectedName').textContent = item.name;
    if ($('previewCode')) $('previewCode').textContent = (item.brand || label).slice(0, 3).toUpperCase();
    if ($('selectionHint')) $('selectionHint').textContent = 'Seçiminiz kaydedildi.';
    if ($('addToBuildButton')) $('addToBuildButton').disabled = false;
    if ($('continueButton')) $('continueButton').classList.remove('disabled');
    refreshGlobal();
  }

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const show = filterSelects.every(select => select.value === 'all' || String(card.dataset[select.dataset.filter]) === select.value);
      card.hidden = !show;
      if (show) visible++;
    });
    if ($('resultCount')) $('resultCount').textContent = String(visible);
    if ($('emptyState')) $('emptyState').hidden = visible !== 0;
  }

  cards.forEach(card => card.querySelector('.select-button')?.addEventListener('click', () => {
    const current = readSelection(key);
    if (current && current.name === card.dataset.name) {
      setSelected(null, true);
      return;
    }

    const error = checkCompatibility(key, card);
    if (error) {
      showCompatibilityError(card, error);
      return;
    }
    setSelected(card, true);
  }));

  filterSelects.forEach(select => select.addEventListener('change', applyFilters));
  $('resetFilters')?.addEventListener('click', () => { filterSelects.forEach(s => s.value = 'all'); applyFilters(); });
  $('resetSelectionButton')?.addEventListener('click', () => setSelected(null, true));
  $('addToBuildButton')?.addEventListener('click', () => {
    const selected = readSelection(key);
    if (selected) {
      syncBuildToCart();
      if ($('selectionHint')) $('selectionHint').textContent = `${selected.name} sisteme ve sepete eklendi.`;
      if ($('continueButton')) $('continueButton').classList.remove('disabled');
    }
  });
  $('saveBuildButton')?.addEventListener('click', () => {
    localStorage.setItem('rigforgeSavedBuild', JSON.stringify({ savedAt: new Date().toISOString(), parts: selections(), total: total() }));
    const btn = $('saveBuildButton');
    if (!btn) return;
    const old = btn.textContent;
    btn.textContent = 'Kaydedildi ✓';
    setTimeout(() => btn.textContent = old, 1400);
  });

  const stored = readSelection(key);
  const storedCard = stored && cards.find(c => c.dataset.name === stored.name);
  if (storedCard) {
    // Eski kayıtlarda teknik özellikler yoksa otomatik olarak günceller.
    localStorage.setItem(storageKey, JSON.stringify(itemFromCard(storedCard)));
  }
  setSelected(storedCard || null, false);
  syncBuildToCart();
  applyFilters();
  refreshGlobal();
})();
