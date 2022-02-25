import { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import NewsItem from "./NewsItem";
import PropTypes from "prop-types";

import noImage from "../../Assets/noImage.jpg";
import Loader from "../../Components/Spinner";

class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 10,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capatlizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      page: 1,
      totalResults: 0,
    };
    document.title = `NewsMonkey - ${this.capatlizeFirstLetter(
      this.props.category
    )}`;
  }

  async componentDidMount() {
    const URL = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    let data = await fetch(URL);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const URL = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    let data = await fetch(URL);
    let parsedData = await data.json();

    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center">
          News Monkey - Top {this.capatlizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Loader />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Loader />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-3" key={element.url}>
                    <NewsItem
                      imgUrl={element.urlToImage ? element.urlToImage : noImage}
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
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
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
