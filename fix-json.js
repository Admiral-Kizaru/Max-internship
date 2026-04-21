const fs = require("fs");
const path = require("path");

// absolute safe path
const inputPath = path.join(__dirname, "public", "newItems.json");
const outputPath = path.join(__dirname, "public", "newItems.fixed.json");

const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const fixed = data.map((item) => ({
  ...item,
  expiryDate: Date.now() + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000),
}));

fs.writeFileSync(outputPath, JSON.stringify(fixed, null, 2));

console.log("✅ Done: public/newItems.fixed.json created");