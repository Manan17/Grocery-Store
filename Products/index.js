import { getPrice } from "../sameFns.js";
let user = null;

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

auth.onAuthStateChanged((authUser) => {
  if (authUser) {
    //Logged in
    user = authUser;
    addListToCart();

    setLogout();
    document.querySelector(".signout").addEventListener("click", signOut);
  } else {
    //Log out
    user = null;
  }
  console.log(user);
});

const setLogout = () => {
  document.querySelector(".authmanage").innerHTML = "";
  const html = `<button class="signout btn btn-danger" >Sign Out</button>`;
  document.querySelector(".authmanage").insertAdjacentHTML("afterbegin", html);
};

const signOut = () => {
  auth.signOut();
  const login = `<button
  type="button"
  class="btn btn-success"
  data-toggle="modal"
  data-target="#exampleModal"
>
  Login 🤟
</button>`;
  document.querySelector(".authmanage").innerHTML = "";
  document.querySelector(".authmanage").insertAdjacentHTML("afterbegin", login);
};

const url = "https://api.spoonacular.com/food/products/";
const apiKey = "13057384fc9a47869caed00f16d2b575";
const state = {
  items: [],
  likes: [],
};

const getProducts = async (query, amount) => {
  const res = await axios(
    `${url}search?apiKey=${apiKey}&query=${query}&number=${amount}`
  );
  const items = res.data.products;
  console.log(items);
  state.items = items;
  console.log(state.items);
  items.map(async (item) => {
    item.price = getPrice();
    const detail = await getDetails(item.id);
    console.log(detail);

    const html = `
    <div class="card" id=${item.id}>
    <div class="card-body">
      <img src=${item.image} alt="" class="vege" />

      <h4 class="card-title mb-4">${formatString(item.title)}</h4>            
      <ul class="card-subtitle">      
        <li>${detail[0] ? detail[0].name : "Farm Fresh"}</li>
        <li>${detail[1] ? detail[1].name : "Healthy"}</li>
        <li>${detail[2] ? detail[2].name : "Pure"}</li>
        <li>${detail[3] ? detail[3].name : "Juicy"}</li>        
      </ul>
      <p class="price">${item.price}rs</p>
      <button class="btn btn-success add">Add To Cart</button>
      <span class="like"><i class="far fa-heart"></i></span>

    </div>
  </div>`;
    document.querySelector(".products").insertAdjacentHTML("beforeend", html);
  });

  setTimeout(() => {
    const liked = (event) => {
      event.target.classList.toggle("fas");
    };
    const hearts = document.querySelectorAll(".like");

    hearts.forEach((heart) => {
      heart.addEventListener("click", liked);
    });
  }, 4000);
};

const getDetails = async (id) => {
  const details = await axios(`${url}${id}?apiKey=${apiKey}`);
  const list = details.data.ingredients.slice(0, 4);
  return list;
};

const formatString = (str) => {
  str = str.replace(",", "");
  if (str.length > 15) {
    var newStr = str.slice(0, 15);
    return `${newStr}....`;
  }
  return str;
};

document.querySelector(".cart").addEventListener("mouseover", (event) => {
  event.preventDefault();

  document.querySelector(".cart-panel").style.display = "block";
});

document.querySelector(".cart").addEventListener("mouseout", (event) => {
  event.preventDefault();

  document.querySelector(".cart-panel").style.display = "none";
});

//Add to Cart

document.querySelector(".products").addEventListener("click", (event) => {
  const classname = event.target.className;
  if (classname.includes("add")) {
    const id = parseInt(event.target.parentNode.parentNode.id);
    //Add to State
    if (user) {
      addToStore(id);
    } else {
      alert("Please Log In");
    }
  }
});

const addToStore = (id) => {
  const item = state.items.filter((like) => like.id === id);
  db.collection("carts").doc(user.displayName).collection("items").add({
    title: item[0].title,
    imageUrl: item[0].image,
    price: item[0].price,
  });
  addListToCart();
};

const addListToCart = () => {
  let cartItems;
  console.log("Hello");
  db.collection("carts")
    .doc(user.displayName)
    .collection("items")
    .onSnapshot((snapshot) => {
      state.likes = [];
      snapshot.docs.map((doc) => {
        cartItems = doc.data();
        state.likes.push(cartItems);
      });
    });
  setTimeout(displayList, 2000);
};

const displayList = () => {
  document.querySelector(".cart-list").innerHTML = ``;
  console.log(state.likes);
  state.likes.forEach((like) => {
    const html = `
    <li>
    <figure class="inner-cart">
    <img src=${like.imageUrl} alt="" />
    <h4>${formatString(like.title)}</h4>
    <h6>${like.price}rs</h6>
      </figure>
      </li>`;
    document.querySelector(".cart-list").insertAdjacentHTML("beforeend", html);
  });
};

const setProducts = () => {
  const link = window.location.href;
  const id = link.split("#");

  getProducts(id[1], 10);
};

setProducts();
