import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const AuthorItems = ({ authorId }) => {
  const [nfts, setNfts] = useState([]);

  // 🔥 FETCH NFTs FROM PUBLIC FOLDER
  useEffect(() => {
    fetch("/nfts.json")
      .then((res) => res.json())
      .then((data) => setNfts(data))
      .catch((err) => console.error("Failed to load NFTs:", err));
  }, []);

  // 🔥 FILTER BY AUTHOR ID
  const items = nfts.filter(
    (nft) => String(nft.authorId) === String(authorId)
  );

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
              <div className="nft__item">

                <div className="author_list_pp">
                  <Link to="">
                    <img className="lazy" src={AuthorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>

                <div className="nft__item_wrap">
                  <Link to={`/item-details/${item.id}`}>
                    <img
                      src={item.image || nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${item.id}`}>
                    <h4>{item.title}</h4>
                  </Link>

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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;