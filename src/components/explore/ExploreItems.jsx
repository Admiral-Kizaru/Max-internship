import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import nftImage from "../../images/nftImage.jpg";

const ExploreItems = ({
  nfts = [],
  loading = false,
  sortBy = "default",
  search = "",
}) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch("/authors.json");
        const data = await res.json();

        setAuthors(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Failed to load authors", err);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [sortBy, search]);

  const filteredItems = useMemo(() => {
    return nfts.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [nfts, search]);

  const sortedItems = useMemo(() => {
    const items = [...filteredItems];

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
  }, [filteredItems, sortBy]);

  const visibleItems = sortedItems.slice(0, visibleCount);

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
      {visibleItems.map((item) => {
        const author = authors.find(
          (a) => String(a.authorId) === String(item.authorId)
        );

        return (
          <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
            <div className="nft__item custom-nft-card">
              <div className="author-avatar">
                <Link to={`/author/${author?.authorId || item.authorId}`}>
                  <img
                    src={author?.authorImage || item.authorImage}
                    alt={author?.authorName || "author"}
                  />
                </Link>

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
                  <div className="nft__item_price">{item.price} ETH</div>

                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {visibleItems.length === 0 && (
        <div className="col-12 text-center mt-4">
          <p>No NFTs found.</p>
        </div>
      )}

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