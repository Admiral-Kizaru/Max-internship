import React, { useEffect, useState } from "react";
import SubHeader from "../images/subheader.jpg";
import ExploreItems from "../components/explore/ExploreItems";

const Explore = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");

  // 🔥 FETCH explore.json (API source)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("/explore.json");
        const data = await res.json();

        setNfts(data);
      } catch (err) {
        console.error("Failed to load NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">

        {/* HEADER */}
        <section
          id="subheader"
          className="text-light"
          style={{ background: `url("${SubHeader}") top` }}
        >
          <div className="center-y relative text-center">
            <div className="container">
              <h1>Explore</h1>
            </div>
          </div>
        </section>

        <section>
          <div className="container">

            {/* 🔥 CONTROLS (SORT + SEARCH) */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

              {/* SORT */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Most Liked</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
              </select>

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search NFTs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />

            </div>

            {/* ITEMS */}
            <div className="row">
              <ExploreItems
                nfts={nfts}
                loading={loading}
                sortBy={sortBy}
                search={search}
              />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Explore;