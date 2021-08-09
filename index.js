const express = require("express");

const app = express();
const fs = require("fs");

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

class Contenedor {
	constructor(ruta) {
		this.ruta = ruta;
		this.productos = [];
	}
	async getAll() {
		try {
			const contenido = await fs.promises.readFile(
				this.ruta,
				(err, data) => data
			);
			const parsed = JSON.parse(contenido);
			return parsed;
		} catch (error) {
			if (error.errno === -4058) {
				await fs.promises.writeFile(this.ruta, "[]");
			} else {
				console.log(error);
			}
		}
	}
	async save(producto) {
		try {
			this.productos = await this.getAll();
			if (isEmptyObject(this.productos)) {
				producto.id = 1;
			} else {
				producto.id = this.productos.length + 1;
			}
			this.productos.push(producto);
			await fs.promises.writeFile(this.ruta, JSON.stringify(this.productos));
			return producto.id;
		} catch (error) {
			return null;
		}
	}
	async getById(id) {
		try {
			const productos = await this.getAll();
			return productos.find((producto) => producto.id === id) || null;
		} catch (error) {
			return null;
		}
	}
	async deleteById(id) {
		try {
			const productos = await this.getAll();
			const newArray = productos.filter((producto) => producto.id !== id);
			await fs.promises.writeFile(this.ruta, JSON.stringify(newArray));
		} catch (error) {
			return null;
		}
	}
	async deleteAll() {
		await fs.promises.writeFile(this.ruta, "[]");
	}
}

const contenido = new Contenedor("productos.json");

app.listen(8080, () => {
	console.log("server on port 8080");
});

app.get("/productos", async (req, res) => {
	res.send(await contenido.getAll());
});
app.get("/productoRandom", async (req, res) => {
	const allProducts = await contenido.getAll();
	res.send(
		await contenido.getById(Math.floor(Math.random() * allProducts.length) + 1)
	);
});
