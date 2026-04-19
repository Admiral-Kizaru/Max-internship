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

  const getNftItem = async () => {
  try {
    if (!id) throw new Error("Missing NFT ID in URL");

    setLoading(true);
    setError(null);

    const response = await fetch(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${id}`
    );

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("API returned invalid JSON");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No NFT data returned");
    }

    setNftItem(data);
  } catch (err) {
    console.error(err);
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

  // ERROR STATE
  if (error) {
    return (
      <div className="container mt90">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  // LOADING STATE
  if (loading || !nftItem) {
    return (
      <div id="wrapper">
        <div className="container mt90">
          <div className="row">
            <div className="col-md-6 text-center">
              <Skeleton width="100%" height="400px" />
            </div>

            <div className="col-md-6">
              <Skeleton width="300px" height="40px" />
              <Skeleton width="120px" height="25px" />
              <Skeleton width="100%" height="80px" />

              <div className="mt20">
                <Skeleton width="100px" height="20px" />
                <Skeleton width="150px" height="40px" />
              </div>

              <div className="mt20">
                <Skeleton width="100px" height="20px" />
                <Skeleton width="150px" height="40px" />
              </div>

              <div className="mt20">
                <Skeleton width="80px" height="20px" />
                <Skeleton width="100px" height="20px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">

              {/* IMAGE */}
              <div className="col-md-6 text-center">
                <img
                  src={nftItem.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={nftItem.title}
                />
              </div>

              {/* INFO */}
              <div className="col-md-6">
                <div className="item_info">

                  <h2>
                    {nftItem.title} #{nftItem.tag}
                  </h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {nftItem.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i> {nftItem.likes}
                    </div>
                  </div>

                  <p>{nftItem.description}</p>

                  {/* OWNER */}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftItem.ownerId}`}>
                            <img src={nftItem.ownerImage} alt="owner" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${nftItem.ownerId}`}>
                            {nftItem.ownerName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CREATOR */}
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>

                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftItem.creatorId}`}>
                            <img src={nftItem.creatorImage} alt="creator" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        <div className="author_list_info">
                          <Link to={`/author/${nftItem.creatorId}`}>
                            {nftItem.creatorName}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>

                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="eth" />
                      <span>{nftItem.price}</span>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;