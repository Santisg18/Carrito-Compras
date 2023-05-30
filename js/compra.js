const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');


cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //Cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });


}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function() {
            window.location = "index.html";
        })
    } else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    } else {
        (function() {
            emailjs.init("user_6p3X7klYE50i0w65MvTfD");
        })();


        var myform = $("form#procesar-pago");

        myform.submit(function(event) {
            event.preventDefault();

            //Change to your service ID, or keep using the default service
            var service_id = "default_service";
            var template_id = "template_JxlylaCJ";

            const cargandoGif = document.querySelector('#cargando');
            cargandoGif.style.display = 'block';

            const enviado = document.createElement('img');
            enviado.src = 'img/mail.gif';
            enviado.style.display = 'block';
            enviado.width = '150';

            myform.find("button").text("Sending...");
            emailjs.sendForm(service_id, template_id, myform[0])
                .then(function() {
                    cargandoGif.style.display = 'none';
                    document.querySelector('#loaders').appendChild(enviado);

                    setTimeout(() => {
                        enviado.remove();
                        compra.vaciarLocalStorage();
                        window.location = "index.html";
                    }, 2000);


                }, function(err) {
                    alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
                    myform.find("button").text("Send");
                });
            return false;

        });






    }
}