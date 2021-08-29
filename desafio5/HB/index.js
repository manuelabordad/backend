const express = require("express");
const handlebars = require("express-handlebars");
const Contenedor = require("./src/contenedor");
const app = express();
const port = 8089;

app.listen(port, () => {
	console.log("server activo en http://localhost:" + port);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contenedor = new Contenedor("./productos.json");

app.use(express.static("public"));

app.engine(
	"hbs",
	handlebars({
		layoutsDir: __dirname + "/views",
		extname: "hbs",

		defaultLayout: "layout",
	})
);
app.set("view engine", "hbs");
app.post("/productos", async (req, res) => {
	const { body } = req;

	await contenedor.save(body);

	res.redirect("/");
});

app.get("/", (req, res) => {
	res.render("form", { layout: "layout" });
});

app.get("/productos", async (req, res) => {
	const productos = await contenedor.getAll();

	res.render("products", {
		layout: "layout",
		productos,
	});
});
