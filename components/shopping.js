function Shop(props) {
  console.log(props);
  const{title, description, price, image} = props.product
  return (
    <div className="col-md-3">
      <div className="card p-5">
        <img src={image} className="card-img-top" alt="Mens Clothing" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <h5 className="card-price">
            <span>Price: </span>
            ${price}
          </h5>
          <button href="#" className="btn btn-primary mt-3">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
class Shopping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      wallet: {},
    };
  }

  /**
   * fetches products stored in data/products.json file and returns an array of product objects
   *
   * @returns {promise<object[]>} products array
   */
  async getProducts() {
    let products = [];
    try {
      const response = await fetch("data/products.json");
      products = await response.json();
    } catch (error) {
      console.log(error);
    } finally {
      return products;
    }
  }
  /**
   * fetches wallet stored in data/wallet.json file and returns wallet object
   * @returns {Promise<object>} wallet object
   */
  async getWallet() {
    let wallet = [];
    try {
      const response = await fetch("data/wallet.json");
      wallet = await response.json();
    } catch (error) {
      console.log(error);
    } finally {
      return wallet;
    }
  }

  async componentDidMount() {
    try {
      const products = await this.getProducts();
      const wallet = await this.getWallet();
      this.setState({
        products,
        wallet,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const shop = this.state.products.map((product) => (
      <Shop key={product.id} product={product} />
    ));
    return (
      <>
        <h1 className="text-center">Shop Our Products</h1>
        <div className="container">
          <div className="row">{shop}</div>
        </div>
      </>
    );
  }
}

ReactDOM.render(<Shopping />, document.getElementById("shopping"));
