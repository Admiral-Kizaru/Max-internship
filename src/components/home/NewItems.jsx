import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import "../../css/styles/style.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [resMain, resTimer] = await Promise.all([
          fetch("/newItems.json"),
          fetch("/newItems.fixed.json"),
        ]);

        if (!resMain.ok || !resTimer.ok) {
          throw new Error("Failed to load JSON files");
        }

        const mainData = await resMain.json();
        const timerData = await resTimer.json();

        const merged = mainData.map((item) => {
          const timerItem = timerData.find((t) => t.id === item.id);

          return {
            ...item,
            expiryDate: timerItem?.expiryDate || null,
          };
        });

        setItems(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};

      items.forEach((item) => {
        if (!item.expiryDate) return;

        const expiryTime = Number(item.expiryDate);
        if (!expiryTime) return;

        const diff = expiryTime - now;

        if (diff <= 0) {
          updated[item.id] = "Expired";
          return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, "0");

        updated[item.id] = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      });

      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">

          <div className="col-lg-12 text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>

          <div className="col-lg-12">

            {/* 🔥 SWIPER CAROUSEL */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500 }}
              loop={items.length > 4}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                1000: { slidesPerView: 4 },
              }}
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SwiperSlide key={i}>
                      <Skeleton width="100%" height="250px" />
                    </SwiperSlide>
                  ))
                : items.map((item) => (
                    <SwiperSlide key={item.id}>

                      <div className="nft__item nft-card">

                        {/* IMAGE WRAPPER */}
                        <div
                          className="nft-image-wrapper"
                          style={{ position: "relative" }}
                        >

                          {/* AUTHOR */}
                          <Link to={`/author/${item.authorId}`}>
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                width: "42px",
                                height: "42px",
                                zIndex: 5,
                              }}
                            >
                              <img
                                src={item.authorImage}
                                alt="author"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  border: "2px solid white",
                                  objectFit: "cover",
                                }}
                              />

                              <span
                                style={{
                                  position: "absolute",
                                  bottom: "-2px",
                                  right: "-2px",
                                  background: "#6c5ce7",
                                  color: "#fff",
                                  fontSize: "10px",
                                  borderRadius: "50%",
                                  padding: "2px 5px",
                                }}
                              >
                                ✔
                              </span>
                            </div>
                          </Link>

                          {/* TIMER */}
                          {item.expiryDate && (
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background:
                                  timeLeft[item.id] === "Expired"
                                    ? "#ffdddd"
                                    : "#f1f2f6",
                                color:
                                  timeLeft[item.id] === "Expired"
                                    ? "#c0392b"
                                    : "#000",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                zIndex: 5,
                              }}
                            >
                              {timeLeft[item.id] || "Loading..."}
                            </div>
                          )}

                          {/* IMAGE */}
                         <Link to={`/nft/${item.nftId}`}>
                            <img
                              src={item.nftImage}
                              alt={item.title}
                              className="lazy nft__item_preview"
                            />
                          </Link>
                        </div>

                        {/* INFO */}
                        <div className="nft__item_info">
                          <Link to={`/nft/${item.nftId}`}>
                            <h4>{item.title}</h4>
                          </Link>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
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

                    </SwiperSlide>
                  ))}
            </Swiper>

          </div>

        </div>
      </div>
    </section>
  );
};

export default NewItems;