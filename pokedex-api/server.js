require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const POKEDEX = require("./pokedex");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

// validation middleware
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  console.log("validate bearer token authentication");
  // validate that token exists
  // check to see if authToken doesn't match apiToken
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

function handleGettypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGettypes);

function handleGetPokemeon(req, res) {
  res.json("Hello, Pokemon!");
}

app.get("/pokemon", function handleGetPokemeon(req, res) {
  let response = POKEDEX.pokemon;
  const { name, type } = req.query;
  // filter our pokemon by name if name query param is present
  if (name) {
    response = response.filter((pokemon) => {
      // case sensitive
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
    });
  }
  // filter pokemon by type if type query param is present
  if (type) {
    response = response.filter((pokemen) => {
      pokemon.type.includes(req.query.type);
    });
  }
  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
