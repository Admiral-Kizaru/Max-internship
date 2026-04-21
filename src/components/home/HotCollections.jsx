import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/hotCollections.json");

        if (!res.ok) throw new Error("Failed to load data");

        const data = await res.json();

        setCollections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
              autoplay={{ delay: 2500 }}
              loop={collections.length > 4}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                1000: { slidesPerView: 4 },
              }}
            >
              {loading
                ? null
                : collections.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="nft_coll">

                        {/* IMAGE CLICK */}
                        <div className="nft_wrap">
                          <Link to={`/hot-collections/${item.id}`}>
                            <img
                              src={item.nftImage}
                              className="img-fluid"
                              alt={item.title}
                            />
                          </Link>
                        </div>

                        {/* AUTHOR */}
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

                        {/* TITLE */}
                        <div className="nft_coll_info">
                          <Link to={`/hot-collections/${item.id}`}>
                            <h4>{item.title}</h4>
                          </Link>
                          <span>Code: {item.code}</span>
                        </div>

                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;