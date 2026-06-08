(function() {
  if (!location.pathname.includes('claim.html')) return;
  chrome.runtime.sendMessage({ type: 'GET_CLAIM_TOKEN' }, function(resp) {
    if (!resp || !resp.token) {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0f;color:#aaa;font-family:sans-serif;font-size:14px;text-align:center;padding:20px"><div>Debes obtener tu clave a través del enlace oficial en la extensión.</div></div>';
      return;
    }
    var keyEl = document.getElementById('keyDisplay');
    var copyBtn = document.getElementById('copyBtn');
    fetch('https://zyphorion-key.gabrielito010101010101.workers.dev/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resp.token })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.success && data.key) {
        if (keyEl) keyEl.textContent = data.key;
        if (copyBtn) copyBtn.disabled = false;
        chrome.runtime.sendMessage({ type: 'CLAIM_KEY', key: data.key });
      } else {
        if (keyEl) keyEl.textContent = 'Enlace expirado. Volvé a la extensión e intentá de nuevo.';
      }
    }).catch(function() {
      if (keyEl) keyEl.textContent = 'Error de conexión.';
    });
  });
})();