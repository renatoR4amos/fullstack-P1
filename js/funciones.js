// funciones.js - script de la tienda nexustech
// catalogo, carro de compras y panel de administracion

var productosDefecto = [
  { id: 1, nombre: "Mouse Logitech G203", precio: 19990, desc: "Sensor 8000 DPI con luces RGB", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80" },
  { id: 2, nombre: "Teclado HyperX Alloy", precio: 49990, desc: "Switches mecanicos y marco de acero", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80" },
  { id: 3, nombre: "Audifonos Razer", precio: 39990, desc: "Sonido surround con cancelacion de ruido", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80" },
  { id: 4, nombre: "Monitor ASUS 24", precio: 129990, desc: "Panel IPS 144Hz 1ms para juegos", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80" }
];

function obtenerProductos() {
  var d = localStorage.getItem("productosNexus");
  if (!d) { localStorage.setItem("productosNexus", JSON.stringify(productosDefecto)); return productosDefecto; }
  return JSON.parse(d);
}
function guardarProductos(l) { localStorage.setItem("productosNexus", JSON.stringify(l)); }
function obtenerCarro() { var d = localStorage.getItem("carroNexus"); return d ? JSON.parse(d) : []; }
function guardarCarro(l) { localStorage.setItem("carroNexus", JSON.stringify(l)); }
function formatoCLP(v) { return "$" + Number(v).toLocaleString("es-CL"); }
function esCorreoValido(c) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c); }

function limpiarSpans() {
  var spans = document.querySelectorAll(".error-msg");
  for (var i = 0; i < spans.length; i++) spans[i].textContent = "";
}

function actualizarContadorCarro() {
  var badge = document.getElementById("cuentaCarro");
  if (!badge) return;
  var items = obtenerCarro(), total = 0;
  for (var i = 0; i < items.length; i++) total += items[i].cant;
  badge.textContent = total;
}

document.addEventListener("DOMContentLoaded", function() {
  actualizarContadorCarro();
  var btnUser = document.getElementById("btnAutoUser"), btnAdmin = document.getElementById("btnAutoAdmin");
  if (btnUser) btnUser.onclick = function() {
    document.getElementById("txtCorreo").value = "cliente@gmail.com";
    document.getElementById("txtClave").value = "1234";
    limpiarSpans();
  };
  if (btnAdmin) btnAdmin.onclick = function() {
    document.getElementById("txtCorreo").value = "admin@gmail.com";
    document.getElementById("txtClave").value = "admin";
    limpiarSpans();
  };

  var formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
      e.preventDefault();
      limpiarSpans();
      var correo = document.getElementById("txtCorreo").value.trim();
      var clave = document.getElementById("txtClave").value;
      var err = false;
      if (correo === "") {
        document.getElementById("errCorreo").textContent = "debes poner tu correo";
        err = true;
      } else if (!esCorreoValido(correo)) {
        document.getElementById("errCorreo").textContent = "el formato de correo no es valido";
        err = true;
      }
      if (clave === "") {
        document.getElementById("errClave").textContent = "falta la clave secreta";
        err = true;
      }
      if (err) return;

      if (correo === "admin@gmail.com" && clave === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "catalogo.html";
      }
    });
  }

  if (document.getElementById("contenedorProductos")) pintarCatalogo();

  if (document.getElementById("cuerpoCarro")) {
    pintarTablaCarro();
    var btnVaciar = document.getElementById("btnVaciarCarro");
    if (btnVaciar) btnVaciar.onclick = function() {
      guardarCarro([]); pintarTablaCarro(); actualizarContadorCarro();
    };
    var btnPagar = document.getElementById("btnPagar");
    if (btnPagar) btnPagar.onclick = function() {
      if (obtenerCarro().length === 0) return;
      var av = document.getElementById("avisoPago");
      if (av) {
        av.classList.remove("d-none");
        setTimeout(function() { av.classList.add("d-none"); }, 3500);
      }
    };
  }

  var formAdmin = document.getElementById("formAdmin");
  if (formAdmin) {
    pintarTablaAdmin();
    formAdmin.addEventListener("submit", function(e) {
      e.preventDefault();
      var id = document.getElementById("adminId").value;
      var nom = document.getElementById("adminNom").value.trim();
      var prec = parseInt(document.getElementById("adminPrecio").value, 10);
      var errSpan = document.getElementById("errAdmin");
      if (nom === "" || isNaN(prec) || prec <= 0) {
        if (errSpan) errSpan.textContent = "debes poner un nombre y precio valido";
        return;
      }
      if (errSpan) errSpan.textContent = "";

      var prods = obtenerProductos();
      if (id !== "") {
        for (var k = 0; k < prods.length; k++) {
          if (prods[k].id === parseInt(id, 10)) { prods[k].nombre = nom; prods[k].precio = prec; break; }
        }
      } else {
        prods.push({ id: prods.length + 1, nombre: nom, precio: prec, desc: "Componente nuevo", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80" });
      }
      guardarProductos(prods); pintarTablaAdmin(); formAdmin.reset();
      document.getElementById("adminId").value = "";
    });
  }
});

function pintarCatalogo() {
  var c = document.getElementById("contenedorProductos");
  if (!c) return;
  var prods = obtenerProductos(); c.innerHTML = "";
  for (var i = 0; i < prods.length; i++) {
    var p = prods[i], col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-3";
    col.innerHTML = '<article class="tarjeta-prod h-100 d-flex flex-column justify-content-between">' +
                      '<div><img src="' + p.img + '" alt="' + p.nombre + '"><h3 class="h6 fw-bold mb-1">' + p.nombre + '</h3><p class="small text-muted mb-2">' + p.desc + '</p></div>' +
                      '<div><div class="precio">' + formatoCLP(p.precio) + '</div><button type="button" class="btn btn-sm btn-info w-100 fw-bold" onclick="agregarAlCarro(' + p.id + ')">Añadir al carro</button></div>' +
                    '</article>';
    c.appendChild(col);
  }
}

function agregarAlCarro(id) {
  var prods = obtenerProductos(), prod = null;
  for (var i = 0; i < prods.length; i++) { if (prods[i].id === id) { prod = prods[i]; break; } }
  if (!prod) return;
  var carro = obtenerCarro(), existe = false;
  for (var j = 0; j < carro.length; j++) {
    if (carro[j].id === id) { carro[j].cant += 1; existe = true; break; }
  }
  if (!existe) carro.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cant: 1 });
  guardarCarro(carro); actualizarContadorCarro();
}

function pintarTablaCarro() {
  var tb = document.getElementById("cuerpoCarro"), tot = document.getElementById("totalCarro");
  if (!tb) return;
  var carro = obtenerCarro(); tb.innerHTML = ""; var total = 0;
  if (carro.length === 0) {
    tb.innerHTML = '<tr><td colspan="4" class="text-center text-muted">tu carro esta vacio actualmente</td></tr>';
  } else {
    for (var i = 0; i < carro.length; i++) {
      var sub = carro[i].precio * carro[i].cant; total += sub;
      var tr = document.createElement("tr");
      tr.innerHTML = '<td>' + carro[i].nombre + '</td><td>' + formatoCLP(carro[i].precio) + '</td><td>' + carro[i].cant + '</td><td>' + formatoCLP(sub) + '</td>';
      tb.appendChild(tr);
    }
  }
  if (tot) tot.textContent = formatoCLP(total);
}

function pintarTablaAdmin() {
  var tb = document.getElementById("cuerpoAdmin");
  if (!tb) return;
  var prods = obtenerProductos(); tb.innerHTML = "";
  for (var i = 0; i < prods.length; i++) {
    var p = prods[i], tr = document.createElement("tr");
    tr.innerHTML = '<td>' + p.nombre + '</td><td>' + formatoCLP(p.precio) + '</td><td>' +
                   '<button type="button" class="btn btn-sm btn-outline-info me-1" onclick="editarProductoAdmin(' + p.id + ')">Editar</button>' +
                   '<button type="button" class="btn btn-sm btn-outline-danger" onclick="borrarProductoAdmin(' + p.id + ')">Borrar</button></td>';
    tb.appendChild(tr);
  }
}

function editarProductoAdmin(id) {
  var prods = obtenerProductos();
  for (var i = 0; i < prods.length; i++) {
    if (prods[i].id === id) {
      document.getElementById("adminId").value = prods[i].id;
      document.getElementById("adminNom").value = prods[i].nombre;
      document.getElementById("adminPrecio").value = prods[i].precio; break;
    }
  }
}

function borrarProductoAdmin(id) {
  var prods = obtenerProductos(), nuevo = [];
  for (var i = 0; i < prods.length; i++) { if (prods[i].id !== id) nuevo.push(prods[i]); }
  guardarProductos(nuevo); pintarTablaAdmin();
}