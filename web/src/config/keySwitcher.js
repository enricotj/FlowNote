if (process.env.NODE_ENV === "production") {
	module.exports = require("./prodKey");
} else {
	module.exports = require("./devKey");
}