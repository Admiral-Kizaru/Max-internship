import React, { useEffect, useState } from "react";
import WOW from "wowjs";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";
import EthImage from "../images/ethereum.svg";

const HotCollectionDetails = () => {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

 useEffect(() => {
  const getCollectionDetails = async () => {
    try {
      if (!id) throw new Error("Missing collection ID");

      setLoading(true);
      setError(null);

      const response = await fetch("/hotCollections.json");

      if (!response.ok) {
        throw new Error("Failed to load collections");
      }

      const collections = await response.json();

      const foundCollection = collections.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.nftId) === String(id)
      );

      if (!foundCollection) throw new Error("Collection not found");

      setCollection(foundCollection);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  getCollectionDetails();
}, [id]);

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
    window.scrollTo(0, 0);
  }, []);

 

  if (error) {
    return (
      <div className="container mt90">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  if (loading || !collection) {
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
                src={collection.nftImage}
                alt={collection.title}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-md-6">
              <h1 style={{ fontWeight: "700", marginBottom: "15px" }}>
                {collection.title} #{collection.code || collection.nftId}
              </h1>

              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <span style={{ background: "#f3f0ff", padding: "5px 14px" }}>
                  <i className="fa fa-eye"></i> {collection.views || 656}
                </span>

                <span style={{ background: "#f3f0ff", padding: "5px 14px" }}>
                  <i className="fa fa-heart"></i> {collection.likes || 68}
                </span>
              </div>

              <p style={{ maxWidth: "520px", lineHeight: "1.7" }}>
                {collection.description ||
                  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
              </p>

              <h6 style={{ marginTop: "22px", fontWeight: "700" }}>Owner</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ position: "relative" }}>
                  <Link to={`/author/${collection.authorId}`}>
                    <img
                      src={collection.authorImage}
                      alt="owner"
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "-3px",
                        bottom: "-3px",
                        background: "#6f5cff",
                        color: "white",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa fa-check"></i>
                    </span>
                  </Link>
                </div>

                <Link
                  to={`/author/${collection.authorId}`}
                  style={{ fontWeight: "700" }}
                >
                  {collection.ownerName || collection.authorName || "Lori Hart"}
                </Link>
              </div>

              <h6 style={{ marginTop: "18px", fontWeight: "700" }}>Creator</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ position: "relative" }}>
                  <Link to={`/author/${collection.authorId}`}>
                    <img
                      src={collection.creatorImage || collection.authorImage}
                      alt="creator"
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "-3px",
                        bottom: "-3px",
                        background: "#6f5cff",
                        color: "white",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa fa-check"></i>
                    </span>
                  </Link>
                </div>

                <Link
                  to={`/author/${collection.authorId}`}
                  style={{ fontWeight: "700" }}
                >
                  {collection.creatorName || collection.authorName || "Jimmy Wright"}
                </Link>
              </div>

              <h6 style={{ marginTop: "25px", fontWeight: "700" }}>Price</h6>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={EthImage} alt="eth" style={{ width: "24px" }} />
                <span style={{ fontSize: "28px", fontWeight: "700" }}>
                  {collection.price || 0.29}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HotCollectionDetails;