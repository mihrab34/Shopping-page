const {
  hashHistory,
  Link,
  Switch,
  Route,
  HashRouter: Router,
  withRouter,
} = ReactRouterDOM;

function Product(props) {
  const { title, price, image, id, qty} = props.product;
  return (
    <section className="col-lg-4 col-md-6 col-sm-12">
      <section className="card p-5">
        <img src={image} className="card-img-top" alt={title} />
        <section className="card-body">
          <Link className="mt-3 py-4 px-3" to={/products/ + id}>
            <h5 className="card-title">{title}</h5>
          </Link>
          <h5 className="card-price">
            <span>Price: </span>${price}
          </h5>
          <h6>
            {qty >= 1 ? (
              <p className="badge bg-success">Available</p>
            ) : (
              <p className="badge bg-danger">Out of stock</p>
            )}
          </h6>
          <AddToCart onAddToCart={props.onAddToCart} />
        </section>
      </section>
    </section>
  );
}

function Shop(props) {
  return props.products.map((product) => (
    <Product
      key={product.id}
      product={product}
      onAddToCart={() => props.onAddToCart(product)}
    />
  ));
}

function AddToCart(props) {
  return (
    <button
      href="#"
      className="btn btn-primary mt-3"
      onClick={props.onAddToCart}
    >
      Add To Cart
    </button>
  );
}

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
    };
  }

  async getProductById(id) {
    let product = {};
    try {
      const response = await fetch("/data/products.json");
      const products = await response.json();
      product = products.find((p) => p.id == id);
    } catch (error) {
      console.log(error);
    }
    return product;
  }

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const product = await this.getProductById(id);
      this.setState({
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // console.log(this.state.product);
    const {
      image,
      title,
      description,
      price,
      rating = {},
      qty,
    } = this.state.product;
    return (
      <section className="container col-12">
        <article className="row mt-4">
          <section className="col-4 p-3">
            <img src={image} className="card-img" alt={title} />
          </section>
          <section className="col-8 p-3">
            <h3>{title}</h3>
            <p>{description}</p>
            <h5>Ratings: {rating.rate}⭐️</h5>
            <h5>Price: ${price}</h5>
            <h6>
              {qty >= 1 ? (
                <p className="badge bg-success">Available</p>
              ) : (
                <p className="badge bg-danger">Out of stock</p>
              )}
            </h6>
            <AddToCart onAddToCart={this.props.onAddToCart} />
          </section>
        </article>
      </section>
    );
  }
}

ProductDetails = withRouter(ProductDetails);

function Wallet(props) {
  const { balance = 0, owner = {} } = props.wallet;
  const { name, phoneNumber, email, address } = owner;
  return (
    <aside>
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
    </aside>
  );
}

function CartItem(props) {
  const { item, onIncrease, onDecrease, onRemove } = props;
  return (
    <div className="row">
      <div className="col-4  p-3">
        <div>{item.title}</div>
      </div>
      <div className="col-2  p-3">
        <p>${item.price}</p>
      </div>

      <div className="col-2  p-3">
        <span className="">
          <button onClick={() => onDecrease(item)}>-</button>
        </span>
        <span className="">{item.cqty}</span>
        <span className="pt-3">
          <button onClick={() => onIncrease(item)}>+</button>
        </span>
      </div>
      <div className="col-2  p-3">
        <p>${item.price * item.cqty}</p>
      </div>
      <div className="col-2 p-3">
        <p onClick={() => onRemove((item))}>
          <i class="bi bi-cart-x"></i>
        </p>
      </div>
    </div>
  );
}

/**
 * It takes an array of cart items and display each of them individually
 * @param {object} props 
 * @prop {array} cart - Array of cart items
 * @prop {function} onIncrease - Function to call when to increase product quantity in cart
 * @prop {function} onDecrease - Function to call when to decrease product quantity in cart
 * @prop {function} onClearCart - Function to call when to clear all cart items
 * @returns cartItem Component
 */
function Cart(props) {
  const { cart = [], onIncrease, onDecrease, onRemove, onClearCart } = props;
  return (
    <aside className="row">
      <h2>Cart Items</h2>
      {cart.length === 0 ? (
        <div>Cart is empty</div>
      ) : (
        <div className="row">
          <div className="d-flex align-center justify-content-between">
            <Link to="/cart" className="p-3">
              View Cart
            </Link>
            <a onClick={onClearCart} className="p-3">
              Clear Cart
            </a>
          </div>

          <div className="col-4 border">
            <p>PRODUCT</p>
          </div>
          <div className="col-2 border">
            <p>PRICE</p>
          </div>
          <div className="col-2 border">
            <p>QUANTITY</p>
          </div>
          <div className="col-2 border">
            <p>SUBTOTAL</p>
          </div>
          <div className="col-2 border">
            <p></p>
          </div>
        </div>
      )}
      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
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
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <h1 className="text-center">Shop Our Products</h1>
              <div className="row">
                <Shop
                  products={this.state.products}
                  onAddToCart={this.props.onAddToCart}
                />
              </div>
            </div>
            <div className="col-4">
              <Wallet wallet={this.state.wallet} />
              <Cart
                cart={this.props.cart}
                onIncrease={this.props.onAddToCart}
                onDecrease={this.props.onDecrease}
                onRemove={this.props.onRemove}
                onClearCart={this.props.onClearCart}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: [],
    };

    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this)
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClearCart = this.handleClearCart.bind(this);
  }
  /**
   * @param {object} product
   * Add a new item to the cart
   *
   *  Steps
   * 1. Check if product quantity is greater than zero(0)
   * 2. If available, check if it already exist in the cart
   * 3. if it doesn't exist,
   * 4. create the cart item object by adding the product and cart quantity
   * 5. push cart item into the cart array
   * 6. then setState of the cart array
   */

  handleAddToCart(product) {
    if (product.qty >= 1) {
      const exist = this.state.cart.find((item) => item.id === product.id);
      if (exist) {
        let cart = this.state.cart.map((item) =>
          item.id === product.id ? { ...exist, cqty: exist.cqty + 1 } : item
        );
        this.setState({ cart: cart });
      } else {
        let cartItem = { ...product, cqty: 1 };
        let cart = [...this.state.cart, cartItem];
        this.setState({
          cart: cart,
        });
      }
    }
  }

  /**
   * 
   * @param {object} product 
   */
  handleIncrease(product) {
    if (product.qty >= 1) {
      const exist = this.state.cart.find((item) => item.id === product.id);
      if (exist) {
        let cart = this.state.cart.map((item) =>
          item.id === product.id ? { ...exist, cqty: exist.cqty + 1 } : item
        );
        this.setState({ cart: cart });
      }
    }
  }

  handleDecrease(product) {
    if (product.cqty >= 1) {
      const exist = this.state.cart.find((item) => item.id === product.id);
      if (exist) {
        let cart = this.state.cart.map((item) =>
          item.id === product.id ? { ...exist, cqty: exist.cqty - 1 } : item
        );
        this.setState({ cart: cart });
      }
    }
  }

  handleRemove (product) {
    let cart = this.state.cart.filter(item => item.id !== product.id)
    this.setState({ cart: cart });
  }

  handleClearCart() {
    let cart = []
    this.setState({ cart: cart });
    // alert('Clear cart')
  }


  render() {
    return (
      <Router>
        <Switch>
          {/* Homepage route */}
          <Route path="/" exact>
            <Shopping
              cart={this.state.cart}
              onAddToCart={this.handleAddToCart}
              onDecrease={this.handleDecrease}
              onRemove={this.handleRemove}
              onClearCart={this.handleClearCart}
            />
          </Route>
          <Route path="/products/:id" className="row">
            <ProductDetails onAddToCart={this.handleAddToCart} />
          </Route>
          <Route path="/cart">
            <Cart
              cart={this.state.cart}
              onIncrease={this.handleIncrease}
              onDecrease={this.handleDecrease}
              onRemove={this.handleRemove}
              onClearCart={this.handleClearCart}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("shopping"));
