const express = require("express");
const Contenedor = require("./src/contenedor");
const app = express();
const port = 8088;

app.listen(port, () => {
	console.log("server activo en http://localhost:" + port);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contenedor = new Contenedor("./productos.json");

app.use(express.static("public"));
app.post("/productos", async (req, res) => {
	const { body } = req;

	await contenedor.save(body);

	res.redirect("/");
});

app.set("views", "./views/");
app.set("view engine", "pug");

app.get("/productos", async (req, res) => {
	const productos = await contenedor.getAll();

	res.render("vistaProductos", { productos });
});
