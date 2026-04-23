import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("/topSellers.json");

        if (!res.ok) throw new Error("Failed to load sellers");

        const data = await res.json();
        console.log("TOP SELLERS DATA:", data); 
        

        // 🔥 MAP YOUR ACTUAL DATA STRUCTURE
        const formatted = data.map((item) => ({
          id: item.authorId,
          name: item.authorName,
          image: item.authorImage,
          sales: item.price,
        }));

        setSellers(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">

          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">

              {loading
                ? new Array(6).fill(0).map((_, i) => (
                    <li key={i}>Loading...</li>
                  ))
                : sellers.map((seller) => (
                    <li key={seller.id}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.id}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.image}
                            alt={seller.name}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      <div className="author_list_info">
                        <Link to={`/author/${seller.id}`}>
                          {seller.name}
                        </Link>
                        <span>{seller.sales} ETH</span>
                      </div>
                    </li>
                  ))}

            </ol>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TopSellers;