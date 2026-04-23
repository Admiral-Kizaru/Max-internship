const fs = require("fs");
const path = require("path");

// 👇 FIXED PATH
const inputPath = path.join(__dirname, "../public/hotCollections.json");

const outputCollections = path.join(__dirname, "../public/collections.json");
const outputNFTs = path.join(__dirname, "../public/nfts.json");

const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const collections = [];
const nfts = [];

data.forEach((item) => {
  collections.push({
    id: item.id,
    title: item.title,
    authorId: item.authorId,
    authorImage: item.authorImage,
    bannerImage: item.nftImage,
    code: item.code,
  });

  nfts.push({
    id: item.nftId,
    title: `${item.title} #${item.id}`,
    nftImage: item.nftImage,
    collectionId: item.id,
    authorId: item.authorId,
    price: 0,
    likes: 0,
  });
});

fs.writeFileSync(outputCollections, JSON.stringify(collections, null, 2));
fs.writeFileSync(outputNFTs, JSON.stringify(nfts, null, 2));

console.log("✅ Data converted successfully");