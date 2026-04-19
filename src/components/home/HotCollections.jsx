import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import collections from "../../hotCollections.json";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../css/styles/skeleton.css";

const HotCollections = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(collections || []);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const SkeletonCard = () => (
    <div className="nft_coll">
      <div className="nft_wrap skeleton-box" />
      <div className="nft_coll_pp skeleton-circle" />
      <div className="nft_coll_info">
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
      </div>
    </div>
  );

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2"></div>
          </div>

          <div className="col-lg-12">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                1000: { slidesPerView: 4 },
              }}
            >
              {loading
  ? Array.from({ length: 4 }).map((_, i) => (
      <SwiperSlide key={i}>
        <SkeletonCard />
      </SwiperSlide>
    ))
  : data.map((item) => {
      console.log("FULL ITEM:", item);
      console.log("ITEM ID:", item.id);

      return (
        <SwiperSlide key={item.id}>
          <div className="nft_coll">

            <div className="nft_wrap">
              <Link to={`/item-details/${item.nftId}`}>
                <img
                  src={item.nftImage}
                  className="img-fluid"
                  alt={item.title}
                />
              </Link>
            </div>

            <div className="nft_coll_pp">
              <Link to={`/author/${item.authorId}`}>
                <img
                  className="pp-coll"
                  src={item.authorImage}
                  alt="author"
                />
              </Link>
              <i className="fa fa-check"></i>
            </div>

            <div className="nft_coll_info">
              <Link to={`/item-details/${item.nftId}`}>
                <h4>{item.title}</h4>
              </Link>
              <span>Code: {item.code}</span>
            </div>

          </div>
        </SwiperSlide>
      );
    })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
