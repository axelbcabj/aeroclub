// 🔢 Cargar stock inicial desde localStorage o usar 6 por defecto
let stockAceite = parseFloat(localStorage.getItem('stockAceite')) || 6;

// 🔄 Mostrar el stock en todos los spans disponibles
function actualizarVisualStockAceite() {
  const spanPrincipal = document.getElementById('stockAceitePrincipal');
  const spanInicio = document.getElementById('stockAceiteInicio');
  const spanResumen = document.getElementById('stockAceiteResumen');

  if (spanPrincipal) spanPrincipal.textContent = stockAceite;
  if (spanInicio) spanInicio.textContent = stockAceite;
  if (spanResumen) spanResumen.textContent = stockAceite;

  localStorage.setItem('stockAceite', stockAceite);
}

// ✅ Registrar carga de aceite → restar del stock
document.getElementById('formCargaAceite').addEventListener('submit', function(e) {
  e.preventDefault();
  const litros = parseFloat(document.getElementById('litrosAceite').value) || 0;

  if (litros > stockAceite) {
    alert('No hay suficiente stock de aceite para esta carga');
    return;
  }

  stockAceite -= litros;
  actualizarVisualStockAceite();
  this.reset();
});

// 🚀 Mostrar stock al cargar la página
actualizarVisualStockAceite();