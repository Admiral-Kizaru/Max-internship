import React, { useEffect, useState } from "react";
import WOW from "wowjs";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";

const HotCollectionDetails = () => {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

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
        (item) => String(item.id) === String(id) || String(item.nftId) === String(id)
      );

      if (!foundCollection) throw new Error("Collection not found");

      setCollection(foundCollection);
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
    getCollectionDetails();
  }, [id]);

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
          <div className="row">
            <div className="col-md-6 text-center">
              <img
                src={collection.nftImage}
                className="img-fluid img-rounded nft-image"
                alt={collection.title}
              />
            </div>

            <div className="col-md-6">
              <h2>{collection.title}</h2>

              <div className="d-flex flex-row mt20">
                <div className="mr40">
                  <h6>Collection Code</h6>
                  <p>#{collection.code}</p>
                </div>
                <div>
                  <h6>Collection ID</h6>
                  <p>{collection.nftId}</p>
                </div>
              </div>

              <h6>Author</h6>
              <div className="item_author">
                <div className="author_list_pp">
                  <Link to={`/author/${collection.authorId}`}>
                    <img src={collection.authorImage} alt="author" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="author_list_info">
                  <Link to={`/author/${collection.authorId}`}>
                    View Author Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotCollectionDetails;
