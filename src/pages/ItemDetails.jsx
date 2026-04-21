import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import WOW from "wowjs";
import { useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";

const ItemDetails = () => {
  const [nftItem, setNftItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const getNftItem = async () => {
    try {
      if (!id) throw new Error("Missing NFT ID");

      setLoading(true);
      setError(null);

      // ✅ FETCH BOTH FILES FROM PUBLIC
      const [itemsRes, hotRes] = await Promise.all([
        fetch("/newItems.json"),
        fetch("/hotCollections.json"),
      ]);

      if (!itemsRes.ok || !hotRes.ok) {
        throw new Error("Failed to load JSON");
      }

      const itemsData = await itemsRes.json();
      const hotData = await hotRes.json();

      const allItems = [...itemsData, ...hotData];

      const foundItem = allItems.find(
        (item) => String(item.id) === String(id)
      );

      if (!foundItem) throw new Error("NFT not found");

      setNftItem(foundItem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
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
          <div className="row">

            <div className="col-md-6 text-center">
              <img
                src={nftItem.nftImage}
                className="img-fluid img-rounded nft-image"
                alt={nftItem.title}
              />
            </div>

            <div className="col-md-6">
              <h2>{nftItem.title} #{nftItem.tag}</h2>

              <p>{nftItem.description}</p>

              <h6>Price</h6>
              <div className="nft-item-price">
                <img src={EthImage} alt="eth" />
                <span>{nftItem.price}</span>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ItemDetails;