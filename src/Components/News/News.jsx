import { Component } from "react";
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

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      page: 1,
      loading: false,
    };
    document.title = `NewsMonkey - ${this.props.category}`
  }

  async updateNews() {
    this.updateNews();
  }

  async componentDidMount() {
    const API_KEY = "YOUR_API_KEY_HERE";
    const URL = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true });
    let data = await fetch(URL);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  handlePreviousClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">News Monkey - Top Headlines</h1>
        {this.state.loading && <Loader />}
        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => {
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
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            onClick={this.handlePreviousClick}
            type="button"
            className="btn btn-warning"
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-warning"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
