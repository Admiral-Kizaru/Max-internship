import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import Skeleton from "../components/UI/Skeleton";

const NFTDetails = () => {
  const { id } = useParams();

  const [nftItem, setNftItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getNftItem = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ SINGLE SOURCE OF TRUTH
      const res = await fetch("/explore.json");

      if (!res.ok) {
        throw new Error("Failed to load NFTs");
      }

      const data = await res.json();

      // ✅ FIX: safe ID comparison
      const foundItem = data.find(
        (item) => Number(item.id) === Number(id)
      );

      if (!foundItem) {
        throw new Error("NFT not found");
      }

      setNftItem(foundItem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getNftItem();
  }, [id]);

  // 🔴 ERROR STATE
  if (error) {
    return (
      <div className="container mt90">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  // 🔵 LOADING STATE
  if (loading || !nftItem) {
    return (
      <div className="container mt90">
        <Skeleton width="100%" height="400px" />
      </div>
    );
  }

  return (
    <div id="wrapper">
      <section className="mt90 sm-mt-0">
        <div className="container">
          <div className="row">

            {/* IMAGE */}
            <div className="col-md-6 text-center">
              <img
                src={nftItem.image}
                className="img-fluid img-rounded nft-image"
                alt={nftItem.title}
              />
            </div>

            {/* INFO */}
            <div className="col-md-6">

              <h2>
                {nftItem.title} #{nftItem.id}
              </h2>

              <p>
                Creator ID: {nftItem.authorId}
              </p>

              {/* PRICE */}
              <h6>Price</h6>
              <div className="nft-item-price">
                <img src={EthImage} alt="eth" />
                <span>{nftItem.price} ETH</span>
              </div>

              {/* LIKES */}
              <div style={{ marginTop: "15px" }}>
                ❤️ {nftItem.likes} likes
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default NFTDetails;