require("dotenv").config();

const { PORT: port, ACCESS_TOKEN: at, MONGO_URI: uri } = process.env;

module.exports = { port, at, uri };
