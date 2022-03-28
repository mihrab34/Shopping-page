function Product(props) {
  const { title, price, image } = props.product;
  return (
      <div className="col-lg-4 col-md-6 col-sm-12">
        <div className="card p-5">
          <img src={image} className="card-img-top" alt={title} />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <h5 className="card-price">
              <span>Price: </span>${price}
            </h5>
            <button
              href="#"
              className="btn btn-primary mt-3"
              onClick={() => props.onAddToCart(props.product)}>
              Add To Cart
            </button>
          </div>
        </div>
      </div>
  );
}

function Shop(props) {
  const { products, onAddToCart } = props;
  const shop = products.map((product) => (
    <Product key={product.id} product={product} onAddToCart={onAddToCart} />
  ));
  return (
    <div className="col-8">
      <div className="row">{shop}</div>
    </div>
  );
}

function Wallet(props) {
  const { balance = 0, owner = {} } = props.wallet;
  const { name, phoneNumber, email, address } = owner;
  return (
    <>
      <div id="wallet">
        <h1>Wallet</h1>
        <div>
          <h5>Name: {name}</h5>
          <p>Wallet Balance: {balance}</p>
          <p>phone Number: {phoneNumber}</p>
          <p>Email: {email}</p>
          <p>Address: {address}</p>
        </div>
      </div>
    </>
  );
}

function CartItem(props) {
  const{item} = props;
  return (
    <div>
          <div>{item.title}</div>
          <button onClick={() => onAddToCart(item)}>+</button>
          <div>
            {item.cqty} * ${item.price}
          </div>
        </div>
  )
}

function Cart(props) {
  const { cart } = props;
  return (
    <aside>
      <h2>Cart Items</h2>
      <div>{cart.length === 0 && <div>Cart is empty</div>}</div>
      {cart.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </aside>
  );
}
class Shopping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      wallet: {},
      cart: [],
      // setCartItem: [],
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

  handleAddToCart = (product) => {
    if(product.qty >= 1) {
      const exist = this.state.cart.find((item) => item.id === product.id);
      if (exist) {
        alert(" Product already in Cart");
      }else {
        let cartItem = { ...product, ...{ cqty: 1 }};
        let cart = [...this.state.cart, cartItem];
        this.setState({
        cart: cart
      })
      }
    }
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <h1 className="text-center">Shop Our Products</h1>
          <div className="row">
            <Shop
              products={this.state.products}
              onAddToCart={this.handleAddToCart}
            />
            <div className="col-4">
              <Wallet wallet={this.state.wallet} />
              <Cart cart={this.state.cart} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(<Shopping />, document.getElementById("shopping"));
