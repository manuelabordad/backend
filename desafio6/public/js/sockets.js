const socket = io.connect();
socket.on("productos", (products) => {
	const html = tableRows(products);

	document.getElementById("productsTable").innerHTML = html;
});

const tableRows = (products) =>
	products
		.map(
			(product) =>
				`
        <tr>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td><img style="width:6vw;" class="img-thumbnail" src=${product.thumbnail}></td>
        </tr>
    `
		)
		.join(" ");

const user = document.getElementById("user");
const message = document.getElementById("msg");
const send = document.getElementById("send");
const messageForm = document.getElementById("messageForm");

messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msg = {
		author: user.value,
		text: message.value,
	};

	socket.emit("nuevoMensaje", msg);

	messageForm.reset();

	message.focus();
});

socket.on("mensajes", (msg) => {
	const html = listaMensajes(msg);

	document.getElementById("mensajes").innerHTML = html;
});

const listaMensajes = (mensajes) =>
	mensajes
		.map(
			(msg) =>
				`
      <div>
        <b style="color:blue;">${msg.author}</b>
        [<span style="color:brown;">${msg.fyh}</span>] :
        <i style="color:green;">${msg.text}</i>
      </div>
    `
		)
		.join(" ");
