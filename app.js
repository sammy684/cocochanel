// ── 素材規格複製 ──
function copySpecs() {
  var text = "素材規格\n１．1125 x 2435 像素(頂部預留1125 * 390像素底部預留1125 * 540像素)；\n２．635 x 325 像素\n３．690 x 290 像素\n４．660 x 110 像素(左右各預留45 x 110 像素)\n５．690 x 200像素\n６．1920 x 470 像素\n７．1200 x 90 像素\n８．1200 x 70 像素\n９．1200 x 250 像素\n１０．498 x 498 像素\nJPG/PNG<300K";
  var btn = document.querySelector('[data-action="copySpecs"]');
  doCopy(text, btn, '📋 複製素材規格文字');
}

// ── 展開／收合地區清單 ──
function toggleArea(listId) {
  var list = document.getElementById(listId);
  var arrowId = listId === 'city-list' ? 'city-arrow' : 'district-arrow';
  var arrow = document.getElementById(arrowId);
  if (!list || !arrow) return;
  if (list.classList.contains('open')) {
    list.classList.remove('open');
    arrow.classList.remove('open');
  } else {
    list.classList.add('open');
    arrow.classList.add('open');
  }
}

// ── 標籤選取 ──
var selectedTags = [];

function toggleTag(el) {
  var name = el.getAttribute('data-name');
  var idx = selectedTags.indexOf(name);
  if (idx === -1) {
    selectedTags.push(name);
    el.style.fontWeight = '700';
    el.style.outline = '2px solid currentColor';
    el.style.outlineOffset = '2px';
  } else {
    selectedTags.splice(idx, 1);
    el.style.fontWeight = '';
    el.style.outline = '';
    el.style.outlineOffset = '';
  }
  updatePreview();
}

function updatePreview() {
  var preview = document.getElementById('selectedPreview');
  var list = document.getElementById('selectedList');
  if (selectedTags.length === 0) {
    preview.style.display = 'none';
  } else {
    preview.style.display = 'block';
    list.textContent = selectedTags.join('、');
  }
}

function copyTags() {
  if (selectedTags.length === 0) {
    alert('請先點選要複製的標籤！');
    return;
  }
  var text = '精準標籤：' + selectedTags.join('、');
  var btn = document.querySelector('[data-action="copyTags"]');
  doCopy(text, btn, '📋 複製已選標籤');
}

function clearTags() {
  selectedTags = [];
  document.querySelectorAll('.tag.selectable').forEach(function(el) {
    el.style.fontWeight = '';
    el.style.outline = '';
    el.style.outlineOffset = '';
  });
  updatePreview();
}

// ── 通用複製 ──
function doCopy(text, btn, originalLabel) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function() {
      showCopied(btn, originalLabel);
    }).catch(function() {
      legacyCopy(text, btn, originalLabel);
    });
  } else {
    legacyCopy(text, btn, originalLabel);
  }
}

function legacyCopy(text, btn, originalLabel) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showCopied(btn, originalLabel);
  } catch(e) {
    alert('複製失敗，請手動複製：\n' + text);
  }
  document.body.removeChild(ta);
}

function showCopied(btn, originalLabel) {
  if (!btn) return;
  btn.textContent = '✅ 已複製！';
  btn.classList.add('copied');
  setTimeout(function() {
    btn.textContent = originalLabel;
    btn.classList.remove('copied');
  }, 2500);
}

// ── 綁定所有事件（頁面載入後）──
window.onload = function() {

  // 展開縣市 / 鄉鎮
  document.querySelectorAll('.area-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var target = this.getAttribute('data-target');
      toggleArea(target);
    });
  });

  // 標籤點選
  document.querySelectorAll('.tag.selectable').forEach(function(el) {
    el.addEventListener('click', function() {
      toggleTag(this);
    });
  });

  // 按鈕
  document.querySelectorAll('[data-action]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var action = this.getAttribute('data-action');
      if (action === 'copySpecs') copySpecs();
      if (action === 'copyTags') copyTags();
      if (action === 'clearTags') clearTags();
    });
  });

};
