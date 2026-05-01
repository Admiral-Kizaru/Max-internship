import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import WOW from "wowjs";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";

const ItemDetails = () => {
  const [nftItem, setNftItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getNftItem = async () => {
      try {
        if (!id) throw new Error("Missing NFT ID");

        setLoading(true);
        setError(null);

        const [exploreRes, newItemsRes, authorsRes] = await Promise.all([
          fetch("/explore.json"),
          fetch("/newItems.fixed.json"),
          fetch("/authors.json"),
        ]);

        if (!exploreRes.ok || !newItemsRes.ok || !authorsRes.ok) {
          throw new Error("Failed to load NFT data");
        }

        const exploreData = await exploreRes.json();
        const newItemsData = await newItemsRes.json();
        const authorsData = await authorsRes.json();

        const authors = Array.isArray(authorsData)
          ? authorsData
          : [authorsData];

        const authorNfts = authors.flatMap((author) =>
          (author.nftCollection || []).map((nft) => ({
            ...nft,
            authorId: author.authorId,
            authorImage: author.authorImage,
            authorName: author.authorName,
          }))
        );

        const allItems = [
          ...exploreData,
          ...newItemsData,
          ...authorNfts,
        ];

        const foundItem = allItems.find(
          (item) => String(item.nftId) === String(id)
        );

        if (!foundItem) throw new Error("NFT not found");

        const matchedAuthor = authors.find(
          (author) =>
            String(author.authorId) === String(foundItem.authorId) ||
            String(author.id) === String(foundItem.authorId)
        );

        setNftItem({
          ...foundItem,

          ownerName:
            foundItem.ownerName || matchedAuthor?.authorName || "Lori Hart",
          ownerImage:
            foundItem.ownerImage ||
            matchedAuthor?.authorImage ||
            foundItem.authorImage,
          ownerId:
            foundItem.ownerId || matchedAuthor?.authorId || foundItem.authorId,

          creatorName:
            foundItem.creatorName || matchedAuthor?.authorName || "Lori Hart",
          creatorImage:
            foundItem.creatorImage ||
            matchedAuthor?.authorImage ||
            foundItem.authorImage,
          creatorId:
            foundItem.creatorId || matchedAuthor?.authorId || foundItem.authorId,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getNftItem();
  }, [id]);

  if (error) {
    return (
      <div className="container mt90">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  if (loading || !nftItem) {
    return (
      <div id="wrapper">
        <div className="container mt90">
          <Skeleton width="100%" height="400px" />
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <section className="mt90 sm-mt-0">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-md-6">
              <img
                src={nftItem.nftImage}
                alt={nftItem.title}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-md-6">
              <h1 style={{ fontWeight: "700", marginBottom: "15px" }}>
                {nftItem.title} #{nftItem.nftId}
              </h1>

              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <span style={{ background: "#f3f0ff", padding: "5px 14px" }}>
                  <i className="fa fa-eye"></i> {nftItem.views || 0}
                </span>

                <span style={{ background: "#f3f0ff", padding: "5px 14px" }}>
                  <i className="fa fa-heart"></i> {nftItem.likes}
                </span>
              </div>

              <p style={{ maxWidth: "520px", lineHeight: "1.7" }}>
                {nftItem.description || "No description available."}
              </p>

              <h6 style={{ marginTop: "22px", fontWeight: "700" }}>Owner</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img
                  src={nftItem.ownerImage}
                  alt={nftItem.ownerName}
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <Link to={`/author/${nftItem.ownerId}`} style={{ fontWeight: "700" }}>
                  {nftItem.ownerName}
                </Link>
              </div>

              <h6 style={{ marginTop: "18px", fontWeight: "700" }}>Creator</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img
                  src={nftItem.creatorImage}
                  alt={nftItem.creatorName}
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <Link to={`/author/${nftItem.creatorId}`} style={{ fontWeight: "700" }}>
                  {nftItem.creatorName}
                </Link>
              </div>

              <h6 style={{ marginTop: "25px", fontWeight: "700" }}>Price</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={EthImage} alt="eth" style={{ width: "24px" }} />
                <span style={{ fontSize: "28px", fontWeight: "700" }}>
                  {nftItem.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ItemDetails;