const express = require("express");
const router = express.Router();
const Contenedor = require("./contenedor");
const app = express();
const port = 8082;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/productos", router);
app.listen(port, () => {
	console.log("server activo en http://localhost:" + port);
});

const contenido = new Contenedor("./src/productos.json");

router.getAll("/api/productos", async (req, res) => {
	const todos = await contenedor.getAll();

	res.send(todos);
});
router.getById("/api/productos/:id", async (req, res) => {
	try {
		const productos = await this.getAll();
		return productos.find((producto) => producto.id === id) || null;
	} catch (error) {
		return { error: "producto no encontrado" };
	}
});

router.post("/api/productos", async (req, res) => {
	const { body } = req;

	await contenedor.saveNewProduct(body);

	res.send(body);
});
router.delete("/api/productos/:id", async (req, res) => {
	const { id } = req.params;

	const borrado = await contenedor.deleteById(id);

	if (borrado) {
		res.send({ borrado });
	} else {
		res.send("El producto que se intenta borrar no existe.");
	}
});

router.put("/api/productos/:id", async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	const anterior = await contenedor.getById(id);

	const nuevo = await contenedor.updateById(id, body);

	if (anterior) {
		res.send({ anterior, nuevo });
	} else {
		res.send("El producto que se intenta actualizar no existe.");
	}
});

// (async () => {
// 	await contenido.save({ title: "apple pie", price: 20000, url: "otraURL" });

// 	await contenido.save({ title: "cupcackes", price: 10000, url: "otraURL" });
// 	await contenido.save({
// 		title: "chocolate cake",
// 		price: 40000,
// 		url: "otraURL",
// 	});
// 	console.log(await contenido.getAll());
// 	console.log(await contenido.getById(2), "getById");
// })();
