const {
  hashHistory,
  Link,
  Switch,
  Route,
  HashRouter: Router,
  withRouter
} = ReactRouterDOM;

function Product(props) {
  const { title, price, image,id } = props.product;
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

          <button
            href="#"
            className="btn btn-primary mt-3"
            onClick={() => props.onAddToCart(props.product)}
          >
            Add To Cart
          </button>
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
        onAddToCart={props.onAddToCart}
      />
    ));
}

class ProductDetails extends React.Component {
  async getProductById (id) {
    let product={}
    try {
      const response = await fetch("/data/products.json");
       const products = await response.json();
       product = products.find(p => p.id == id);
      
    } catch (error) {
      console.log(error);
    }
    return product;
  }

  
render() {
  const { id } = this.props.match.params;
  this.getProductById(id);

  return (
    <>
      <h1>Product Details</h1>
      
    </>
    // <section className="col-12">
    //     <article className="row">
    //       <section className="col-4">
    //         <img src={image} className="card-img" alt={title} />
    //       </section>
    //       <section className="col-7">
    //         <h3>{title}</h3>
    //         <p>{description}</p>
    //         {/* <h5>Ratings: {rating.rate}</h5> */}
    //         <h5>Price: ${price}</h5>
    //         <button
    //           href="#"
    //           className="btn btn-primary mt-3"
    //           onClick={() => props.onAddToCart(props.product)}
    //         >
    //           Add To Cart
    //         </button>
    //       </section>
    //     </article>
    //   </section>
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
  const { item } = props;
  return (
    <div>
      <div>{item.title}</div>
      <button onClick={() => onAddToCart(item)}>+</button>
      <div>
        {item.cqty} * ${item.price}
        <Link to="/cart">View Cart</Link>
      </div>
    </div>
  );
}

function Cart(props) {
  const { cart =[] } = props;
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
    if (product.qty >= 1) {
      const exist = this.state.cart.find((item) => item.id === product.id);
      if (exist) {
        alert(" Product already in Cart");
      } else {
        let cartItem = { ...product, cqty: 1 };
        let cart = [...this.state.cart, cartItem];
        this.setState({
          cart: cart,
        });
      }
    }
  };

  render() {
    
    return (
      <>
        <div className="container-fluid">
          <div className="row">
                  <div className="col-8">
                    <h1 className="text-center">Shop Our Products</h1>
                    <div className="row">
                      <Shop products={this.state.products} onAddToCart={this.handleAddToCart} />
                    </div>
                  </div>
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

function App() {
  return (
    <Router>
      <Switch>
        {/* Homepage route */}
        <Route path="/" exact component={Shopping}></Route>
        <Route path="/products/:id" className="row">
          <ProductDetails />
        </Route>
        <Route path="/cart" >
          <Cart />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("shopping"));
