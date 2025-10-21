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

// 🧮 Cálculo automático del total
document.getElementById('litrosCompraAceite').addEventListener('input', calcularTotalAceite);
document.getElementById('precioCompraAceite').addEventListener('input', calcularTotalAceite);

function calcularTotalAceite() {
  const litros = parseFloat(document.getElementById('litrosCompraAceite').value) || 0;
  const precio = parseFloat(document.getElementById('precioCompraAceite').value) || 0;
  document.getElementById('totalCompraAceite').value = (litros * precio).toFixed(2);
}

//  Registrar compra → sumar al stock y crear movimiento contable
document.getElementById('formCompraAceite').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreCompraAceite').value;
  const fecha = document.getElementById('fechaCompraAceite').value;
  const litros = parseFloat(document.getElementById('litrosCompraAceite').value) || 0;
  const precio = parseFloat(document.getElementById('precioCompraAceite').value) || 0;
  const total = litros * precio;
  const metodoPago = document.getElementById('metodoPagoAceite').value;

  if (!metodoPago) {
    alert('Seleccioná un método de pago');
    return;
  }

  //  Actualizar stock
  stockAceite += litros;
  actualizarVisualStockAceite();

  // Crear movimiento contable
  const movimientoAceite = {
    tipo: 'Compra de aceite',
    nombre,
    fecha,
    litros,
    precio,
    total,
    metodoPago
  };

  //  Guardar en array temporal o enviar al backend más adelante
  console.log('Movimiento registrado:', movimientoAceite);

  this.reset();
});

// Mostrar stock al cargar la página
actualizarVisualStockAceite();