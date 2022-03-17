import React, { useState, useEffect } from "react";
import axios from "axios";
import "../design/CoinChart.scss";
import Coin from "./Coin";
import Loading from "./Loading";
import up from "../img/up.png";
import down from "../img/down.png";
import smallUp from "../img/upSmall.png"
import smallDown from "../img/downSmall.png"

 
function CoinChart() {
  const [coins, setCoins] = useState([]);
  const [marketCap, setMarketCap] = useState([]);
  const [search, setSearch] = useState("");
  const [sortFilter, setSortFilter] = useState("")
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [currentlyFiltered, setCurrentlyFiltered] = useState('');
  const [loading, setLoading] = useState(true);   
  
  const URLCoins =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

  const URLGlobal = "https://api.coingecko.com/api/v3/global";

  useEffect(() => {
    async function fetchData() {
      const result = axios
        .get(URLCoins)
        .then((res) => {
          setCoins(res.data);
          setCurrentlyFiltered('');
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }
    const intervalID = setInterval(fetchData, 10000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const result = axios
        .get(URLGlobal)
        .then((res) => {
          setMarketCap(res.data.data.market_cap_change_percentage_24h_usd);
        })
        .catch((error) => console.log(error));
    }
    const intervalID = setInterval(fetchData, 10000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    setFilteredCoins(
      coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase())
      )
    );
    setCurrentlyFiltered('');
  }, [search]);

  
  useEffect(() => {
    setFilteredCoins(coins);
  }, [coins]);


  useEffect(() => {
    setCurrentlyFiltered(sortFilter)
    var sortableItems = coins.slice().sort(function (a, b) {
    if (ascending)
      return a[sortFilter] !== b[sortFilter] ? (a[sortFilter] < b[sortFilter] ? -1 : 1) : 0;
    else return a[sortFilter] !== b[sortFilter] ? (a[sortFilter] > b[sortFilter] ? -1 : 1) : 0;
    });

    setFilteredCoins(sortableItems)
  }, [sortFilter, ascending]);


  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };


  const clearSearch = (e) => {
    setSearch('')
  }

  const requestSort = (categoryFilterBy) => {
    setSortFilter(categoryFilterBy);
    setAscending(!ascending);
  };

  return (
    <div className="coin-app">
      <h1 className="coin-text">
          Today's Cryptocurrency Prices by Market Cap
        </h1>
        {marketCap > 0 ? (
          <h2 className="coin-text">
            The global cryptocurrency market cap today is $1.79 Trillion, a{" "}
            <span className="green">
              {" "}
              {(Math.round(marketCap * 10) / 10).toFixed(1)}%{" "}
            </span>{" "}
            <img className="arrow" src={up} alt="Logo" />
            change in the last 24 hours.
          </h2>
        ) : (
          <h2>
            The global cryptocurrency market cap today is $1.79 Trillion, a
            <span className="red">
              {" "}
              {(Math.round(marketCap * 10) / 10).toFixed(1)}%{" "}
            </span>{" "}
            <img className="arrow" src={down} alt="Logo" />
            change in the last 24 hours.
          </h2>
        )}
      {!loading && <div className="coin-search">
      { <input id="search-btn" type="checkbox" />}
      { <label htmlFor="search-btn" onClick={clearSearch}></label>}
      <input
          id="search-bar"
          type="search"
          className="coin-input "
          onChange={handleChange}
          placeholder="Search"
          value={search}
        />
        <span className="caret"></span>
      </div>}
      {loading ? <Loading /> :
       !filteredCoins.length && search ? 
        <span className="no-result">No Results Found</span>
       : 
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="coin-header" onClick={() => requestSort("name")}>
                Coin
               {currentlyFiltered === 'name' ? ascending ? <img className="filter" src={smallUp} alt="Logo"/> : <img className="filter" src={smallDown} alt="Logo" /> : null } 
              </th>
              <th className="price-header" onClick={() => requestSort("current_price")}>
                Price
                {currentlyFiltered === 'current_price' ? ascending ? <img className="filter" src={smallUp} alt="Logo"/> : <img className="filter" src={smallDown} alt="Logo" /> : null } 
              </th>
              <th className="volume-header" onClick={() => requestSort("total_volume")} >
                24h Volume
                {currentlyFiltered === 'total_volume' ? ascending ? <img className="filter" src={smallUp} alt="Logo"/> : <img className="filter" src={smallDown} alt="Logo" /> : null } 
              </th>
              <th className="precent-header" onClick={() => requestSort("price_change_percentage_24h")}>
                24h
                {currentlyFiltered === 'price_change_percentage_24h' ? ascending ? <img className="filter" src={smallUp} alt="Logo"/> : <img className="filter" src={smallDown} alt="Logo" /> : null } 
              </th>
              <th className="mktCap-header" onClick={() => requestSort("market_cap")}>
                Mkt Cap
                {currentlyFiltered === 'market_cap' ? ascending ? <img className="filter" src={smallUp} alt="Logo"/> : <img className="filter" src={smallDown} alt="Logo" /> : null } 
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => {
              return (
                <tbody>
                  <Coin
                    key={coin.id}
                    name={coin.name}
                    symbol={coin.symbol}
                    price={coin.current_price}
                    volume={coin.total_volume}
                    marketcap={coin.market_cap}
                    image={coin.image}
                    priceChange={coin.price_change_percentage_24h}
                  />
                </tbody>
              );
            })}
          </tbody>
        </table>
       } 
    </div>
  );
}

export default CoinChart;
