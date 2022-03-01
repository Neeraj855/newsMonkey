import { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";

import NewsItem from "./NewsItem";
import PropTypes from "prop-types";

import noImage from "../../Assets/noImage.jpg";
import Loader from "../../Components/Spinner";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const capatlizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    const URL = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    let data = await fetch(URL);
    let parsedData = await data.json();

    setArticles(parsedData.articles);
  };

  const scrollToTop = () => window.scroll(0, 0);

  const handlePrevClick = async () => {
    setPage(page - 1);
    updateNews();
    scrollToTop();
  };

  const handleNextClick = async () => {
    if (this.state.page + 1 > Math.ceil(this.state.totalResults / 20)) {
    } else {
      setPage(page + 1);
      updateNews();
      scrollToTop();
    }
  };

  useEffect(async () => {
    updateNews();
    document.title = `NewsMonkey - ${capatlizeFirstLetter(props.category)}`;
    setLoading(false);
  }, []);

  return (
    <>
      <h1 className="text-center my-5">
        News Monkey - Top {capatlizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Loader />}

      <div className="container">
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-3" key={element.url}>
                <NewsItem
                  imgUrl={element.urlToImage ? element.urlToImage : noImage}
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  newsUrl={element.url}
                  author={!element.author ? "Unknown" : element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="container d-flex justify-content-between my-5">
        <button
          disabled={page <= 1}
          type="button"
          className="btn btn-dark"
          onClick={handlePrevClick}
        >
          &larr; Previous
        </button>
        <button
          type="button"
          className="btn btn-dark"
          onClick={handleNextClick}
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 10,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
