import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";

const Author = () => {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Follow button state
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);

        const res = await fetch("/authors.json");

        if (!res.ok) {
          throw new Error("Failed to load authors");
        }

        const data = await res.json();

        const foundAuthor = Array.isArray(data)
          ? data.find(
              (item) =>
                String(item.id) === String(id) ||
                String(item.authorId) === String(id)
            )
          : data;

        if (!foundAuthor) {
          throw new Error("Author not found");
        }

        setAuthor(foundAuthor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchAuthor();
  }, [id]);

  if (loading) {
  return (
    <div id="wrapper">
      <section className="mt90">
        <div className="container">

          {/* AUTHOR HEADER SKELETON */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                className="skeleton-box"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                }}
              ></div>

              <div>
                <div className="skeleton-box" style={{ width: "180px", height: "20px", marginBottom: "10px" }}></div>
                <div className="skeleton-box" style={{ width: "120px", height: "16px", marginBottom: "8px" }}></div>
                <div className="skeleton-box" style={{ width: "200px", height: "16px" }}></div>
              </div>
            </div>

            <div className="skeleton-box" style={{ width: "120px", height: "40px" }}></div>
          </div>

          {/* NFT GRID SKELETON */}
          <div className="row">
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
          </div>

        </div>
      </section>
    </div>
  );
}

  if (error) {
    return (
      <div className="container mt90">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <section className="mt90">
        <div className="container">

          {/* AUTHOR HEADER */}
          <div
            className="author-profile"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img
                src={author.authorImage}
                alt={author.authorName}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <h2>{author.authorName}</h2>
                <p>@{author.tag}</p>
                <p>{author.address?.slice(0, 18)}...</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <strong>
                {isFollowing ? author.followers + 1 : author.followers} followers
              </strong>

              <button
                onClick={() => setIsFollowing((prev) => !prev)}
                style={{
                  background: isFollowing ? "#e6e6e6" : "#6f5cff",
                  color: isFollowing ? "#333" : "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div className="row mt-4">
            {author.nftCollection.map((nft) => (
              <div key={nft.id} className="col-lg-3 col-md-6 col-sm-6">
                <div className="nft__item">
                  <div className="nft__item_wrap">
                    <Link to={`/nft/${nft.nftId}`}>
                      <img
                        src={nft.nftImage}
                        alt={nft.title}
                        className="nft__item_preview"
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={`/nft/${nft.nftId}`}>
                      <h4>{nft.title}</h4>
                    </Link>

                    <div className="nft__item_price">
                      <img src={EthImage} alt="eth" />
                      {nft.price} ETH
                    </div>

                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{nft.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Author;