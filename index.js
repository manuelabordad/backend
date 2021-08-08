const express = require("express");
const app = express();
app.listen(8080, () => {
	console.log("server on port 8080");
});

app.get("/productos", (req, res) => {});
app.get("/productoRandom", (req, res) => {});
