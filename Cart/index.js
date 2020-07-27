const config = {
  apiKey: "AIzaSyAcRlr8fwGmLrb7y00Vo7XTIEET2x6cYyw",
  authDomain: "grocery-store-b36e8.firebaseapp.com",
  databaseURL: "https://grocery-store-b36e8.firebaseio.com",
  projectId: "grocery-store-b36e8",
  storageBucket: "grocery-store-b36e8.appspot.com",
  messagingSenderId: "92110725591",
  appId: "1:92110725591:web:7f6f1a95707ab5251c2b92",
  measurementId: "G-0CD9T9FMZL",
};

firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.firestore();
let user = null;
let items = [];

auth.onAuthStateChanged((authUser) => {
  if (authUser) {
    //Logged in
    user = authUser;
  } else {
    //Log out
    user = null;
    document.write("Please Go Back and Login");
  }
  console.log(user);
  setTimeout(addListToCart, 3000);
});

const addListToCart = () => {
  let cartItems;
  db.collection("carts")
    .doc(user.displayName)
    .collection("items")
    .onSnapshot((snapshot) => {
      items = [];
      snapshot.docs.map((doc) => {
        cartItems = { key: doc.id, data: doc.data() };
        items.push(cartItems);
        console.log(cartItems);
        console.log(items);
      });
      displayCart();
    });
};

const displayCart = () => {
  document.querySelector(".container").innerHTML = ``;
  items.forEach((item) => {
    const html = `<div class="card">
        <div class="card-body">
          <div class="row">
            <!-- Image -->
            <div class="col-lg-3">
              <img src=${item.data.imageUrl} alt=${item.data.title} />
            </div>

            <!-- Product Details -->
            <div class="col-lg-7">
              <h2 class="productBrand">${item.data.title}</h2>

              <p class="quantity">1L</p>
              <p class="mrp">MRP : Rs.${item.data.price}</p>
              <!-- Quantity -->
              <div class="input-group" style="width: 120px;">
                <span class="input-group-btn">
                  <button
                    type="button"
                    class="quantity-left-minus btn btn-outline-success btn-number"
                    data-type="minus"
                    data-field=""
                  >
                    -
                  </button>
                </span>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  class="form-control input-number"
                  value="1"
                  min="1"
                  max="50"
                />
                <span class="input-group-btn">
                  <button
                    type="button"
                    class="quantity-right-plus btn btn-outline-success btn-number"
                    data-type="plus"
                    data-field=""
                  >
                    +
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer" style="background-color: white;">
          <div class="remove-buttons row">
            <button
              class="btn col-lg-3 first delete-btn"
              style="border-right: solid gray 1px;"
              id=${item.key}
            >
              Remove
            </button>
            <button class="btn col-lg-7">Move To WhishList</button>
          </div>
        </div>
      </div>`;
    document.querySelector(".container").insertAdjacentHTML("afterbegin", html);
  });
  addDeleteListener();
};

const addDeleteListener = () => {
  document.querySelector(".container").addEventListener("click", (event) => {
    const classes = event.target.classList;
    if (classes.contains("delete-btn")) {
      const id = event.target.id;
      db.collection("carts")
        .doc(user.displayName)
        .collection("items")
        .doc(id)
        .delete()
        .then((res) => console.log("Success"))
        .catch((error) => alert(error));
    }
  });
};
