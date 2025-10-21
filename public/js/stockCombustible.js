// 🔢 Cargar stock inicial desde localStorage o usar 1200 por defecto
let stockActual = parseFloat(localStorage.getItem('stockCombustible')) || 1200;

// 🔄 Mostrar el stock en todos los spans disponibles
function actualizarVisualStock() {
  const stockSpans = ['stockInicio', 'stockPrincipal', 'stockResumen'];
  stockSpans.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = stockActual;
  });
  localStorage.setItem('stockCombustible', stockActual);
}

// 🧮 Cálculo automático del total en compra
document.getElementById('litrosCompra').addEventListener('input', calcularTotalCompra);
document.getElementById('precioCompra').addEventListener('input', calcularTotalCompra);

function calcularTotalCompra() {
  const litros = parseFloat(document.getElementById('litrosCompra').value) || 0;
  const precio = parseFloat(document.getElementById('precioCompra').value) || 0;
  document.getElementById('totalCompra').value = (litros * precio).toFixed(2);
}

// 🧮 Cálculo automático del total en venta
document.getElementById('litrosVenta').addEventListener('input', calcularTotalVenta);
document.getElementById('precioVenta').addEventListener('input', calcularTotalVenta);

function calcularTotalVenta() {
  const litros = parseFloat(document.getElementById('litrosVenta').value) || 0;
  const precio = parseFloat(document.getElementById('precioVenta').value) || 0;
  document.getElementById('totalVenta').value = (litros * precio).toFixed(2);
}

// ✅ Registrar compra: sumar al stock
document.getElementById('formCompra').addEventListener('submit', function(e) {
  e.preventDefault();
  const litros = parseFloat(document.getElementById('litrosCompra').value) || 0;
  stockActual += litros;
  actualizarVisualStock();
  this.reset();
});

// ✅ Registrar venta: restar del stock
document.getElementById('formVenta').addEventListener('submit', function(e) {
  e.preventDefault();
  const litros = parseFloat(document.getElementById('litrosVenta').value) || 0;
  if (litros > stockActual) {
    alert('No hay suficiente stock para esta venta');
    return;
  }
  stockActual -= litros;
  actualizarVisualStock();
  this.reset();
});

// ✅ Registrar carga desde stockCombustible.html
document.getElementById('formCargaCombustible').addEventListener('submit', function(e) {
  e.preventDefault();
  const litros = parseFloat(document.getElementById('litros').value) || 0;
  stockActual += litros;
  actualizarVisualStock();
  this.reset();
});

// 🚀 Mostrar stock al cargar la página
actualizarVisualStock();