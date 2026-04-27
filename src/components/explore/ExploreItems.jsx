import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import nftImage from "../../images/nftImage.jpg";

const ExploreItems = ({ sortBy = "default" }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  // 🔥 FETCH FROM explore.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("/explore.json");
        const data = await res.json();

        setNfts(data);
      } catch (err) {
        console.error("Failed to load explore.json", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // reset pagination when sort changes
  useEffect(() => {
    setVisibleCount(8);
  }, [sortBy]);

  // SORT LOGIC
  const sortedItems = useMemo(() => {
    const items = [...nfts];

    switch (sortBy) {
      case "default":
      case "likes":
        return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));

      case "price_low_high":
        return items.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
        );

      case "price_high_low":
        return items.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
        );

      default:
        return items;
    }
  }, [nfts, sortBy]);

  const visibleItems = sortedItems.slice(0, visibleCount);

  // LOADING STATE
  if (loading) {
    return (
      <>
        {new Array(8).fill(0).map((_, i) => (
          <div key={i} className="col-lg-3 col-md-6 col-sm-6">
            <div className="nft__item">
              <div className="nft__item_wrap">
                <div className="skeleton-box image"></div>
              </div>
              <div className="nft__item_info">
                <div className="skeleton-box title"></div>
                <div className="skeleton-box price"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {visibleItems.map((item) => (
  <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
    <div className="nft__item custom-nft-card">

      {/* AUTHOR ICON */}
      <div className="author-avatar">
        <img src={item.authorImage} alt="author" />
        <span className="verified-badge">
          <i className="fa fa-check"></i>
        </span>
      </div>

      <div className="nft__item_wrap custom-image-wrap">
        <Link to={`/nft/${item.nftId}`}>
          <img
            src={item.nftImage || nftImage}
            alt={item.title}
            className="nft__item_preview"
          />
        </Link>
      </div>

      <div className="nft__item_info custom-nft-info">
        <Link to={`/nft/${item.nftId}`}>
          <h4>{item.title}</h4>
        </Link>

        <div className="nft-bottom-row">
          <div className="nft__item_price">
            {item.price} ETH
          </div>

          <div className="nft__item_like">
            <i className="fa fa-heart"></i>
            <span>{item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
))}

      {/* LOAD MORE */}
      {visibleCount < sortedItems.length && (
        <div className="col-12 text-center mt-4">
          <button
            className="btn-main"
            onClick={() => setVisibleCount((prev) => prev + 4)}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;