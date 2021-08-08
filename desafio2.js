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
(async () => {
	await contenido.save({ title: "apple pie", price: 20000, url: "otraURL" });

	await contenido.save({ title: "cupcackes", price: 10000, url: "otraURL" });
	await contenido.save({
		title: "chocolate cake",
		price: 40000,
		url: "otraURL",
	});
	console.log(await contenido.getAll());
	console.log(await contenido.getById(2), "getById");
	await contenido.deleteById(3);
	console.log(await contenido.getAll(), "id deleted");
	await contenido.deleteAll();
	console.log(await contenido.getAll(), "delete all");
})();
