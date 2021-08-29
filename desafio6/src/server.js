const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 8080;

server.listen(port, () =>
	console.log(`Servidor activo en http://localhost:${port}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const Contenedor = require("./contenedor");
const contenedorProductos = new Contenedor("./src/data/productos.json");
const contenedorMensajes = new Contenedor("./src/data/mensajes.json");

io.on("connection", async (socket) => {
	const products = await contProductos.getAll();

	socket.emit("productos", products);

	socket.on("nuevoProducto", async (producto) => {
		await contenedorProductos.save(producto);

		io.emit("productos", products);
	});

	const messages = await contenedorMensajes.getAll();

	socket.emit("mensajes", messages);

	socket.on("nuevoMensaje", async (msg) => {
		msg.fyh = new Date().toLocaleString();

		await contenedorMensajes.save(msg);

		io.emit("mensajes", messages);
	});
});
