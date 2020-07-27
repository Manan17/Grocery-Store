// const config = {
//   apiKey: "AIzaSyAcRlr8fwGmLrb7y00Vo7XTIEET2x6cYyw",
//   authDomain: "grocery-store-b36e8.firebaseapp.com",
//   databaseURL: "https://grocery-store-b36e8.firebaseio.com",
//   projectId: "grocery-store-b36e8",
//   storageBucket: "grocery-store-b36e8.appspot.com",
//   messagingSenderId: "92110725591",
//   appId: "1:92110725591:web:7f6f1a95707ab5251c2b92",
//   measurementId: "G-0CD9T9FMZL",
// };

// firebase.initializeApp(config);
// const auth = firebase.auth();

// const signUp = (event) => {
//   event.preventDefault();

//   email = document.getElementById("email").value;
//   password = document.getElementById("password").value;
//   username = document.getElementById("username").value;
//   auth
//     .createUserWithEmailAndPassword(email, password)
//     .then((authUser) => {
//       return authUser.user.updateProfile({
//         displayName: username,
//       });
//     })
//     .catch((error) => alert(error));
//   alert("Proceed to Sign In");
// };

// const signIn = (event) => {
//   event.preventDefault();
//   email = document.getElementById("email").value;
//   password = document.getElementById("password").value;
//   auth
//     .signInWithEmailAndPassword(email, password)
//     .catch((error) => alert(error));
// };
import { getPrice } from "../sameFns.js";

let likes = [];

const vegiesData = [
  {
    id: "1",
    title: "Bread",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSFWmvxfaxAI-No8HIMV_BqYLdDDrN1OkQDiQ&usqp=CAU",
    price: 45,
  },
  {
    id: "2",
    title: "Coca Cola",
    imageUrl: "https://etimg.etb2bimg.com/photo/75519265.cms",
    price: 20,
  },
  {
    id: "3",
    title: "Biscuits",
    imageUrl:
      "https://5.imimg.com/data5/BB/RG/MY-41210511/britannia-biscuit-in-pune-500x500.jpg",
    price: 30,
  },
  {
    price: 600,
    id: "4",
    title: "Chicken",
    imageUrl:
      "https://static.wixstatic.com/media/c73640_a699f2b086fe41ce8031fadc5b97b8c7~mv2.jpg/v1/fill/w_516,h_516,al_c,q_80,usm_0.66_1.00_0.01/c73640_a699f2b086fe41ce8031fadc5b97b8c7~mv2.webp",
  },
  {
    id: "5",
    title: "Tomatoes",
    imageUrl:
      "https://i.ndtvimg.com/i/2018-04/tomato-650_650x400_51523426878.jpg",
    price: 20,
  },
  {
    id: "6",
    title: "Fruit Basket",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTK6pCgp2uDokqKa9Zj_ZhGvJ2-cfmwXP1awQ&usqp=CAU",
    price: 800,
  },
  {
    id: "7",
    title: "Veges Basket",
    imageUrl:
      "https://www.paniercadeauelizabeth.com/media/original/50028-Panier-bio-grand.jpg",
    price: 750,
  },
  {
    id: "8",
    title: "Mangoes",
    imageUrl:
      "https://cdn.telanganatoday.com/wp-content/uploads/2020/04/MAngoes.jpg",
    price: 60,
  },
  {
    id: "9",
    title: "Milk",
    imageUrl:
      "https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/09/20/Pictures/_61433f0c-bcb9-11e8-95ec-91800d079bb4.jpg",
    price: 45,
  },
  {
    id: "10",
    title: "Dairy Basket",
    imageUrl:
      "https://image.shutterstock.com/z/stock-photo-basket-of-dairy-products-in-the-grass-with-french-text-for-organic-agriculture-571533073.jpg",
    price: 999,
  },
  {
    id: "11",
    title: "Cheese",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT9SrXv1bpIW6McCp9LayxqUbQIhvf0zVLjjQ&usqp=CAU",
    price: 55,
  },
  {
    id: "12",
    title: "Ghee",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQmtpprvQ6ZC_8cJj9q8y4t8sVsIotBbnXsGA&usqp=CAU",
    price: 90,
  },
];

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

const signIn = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      window.location.replace("/index.html");
    })
    .catch((error) => alert(error));
};

auth.onAuthStateChanged((authUser) => {
  if (authUser) {
    //Logged in
    user = authUser;
    setLogout();
    document.querySelector(".signout").addEventListener("click", signOut);
    setTimeout(addListToCart, 5000);
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

document.getElementById("signinbtn").addEventListener("click", signIn);

const liked = (event) => {
  event.target.classList.toggle("fas");
};
const hearts = document.querySelectorAll(".like");

hearts.forEach((heart) => {
  heart.addEventListener("click", liked);
});

//Add to Cart
document.querySelector(".container").addEventListener("click", (event) => {
  const classname = event.target.className;
  if (classname.includes("add")) {
    const id = parseInt(event.target.parentNode.parentNode.id);
    console.log(id);
    //Add to State
    if (user) {
      addToStore(id);
    } else {
      alert("Please Log In");
    }
  }
});

const addToStore = (id) => {
  const item = vegiesData.filter((like) => like.id == id);
  console.log(item);
  db.collection("carts").doc(user.displayName).collection("items").add({
    title: item[0].title,
    imageUrl: item[0].imageUrl,
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
      likes = [];
      snapshot.docs.map((doc) => {
        cartItems = doc.data();
        likes.push(cartItems);
      });
    });
  setTimeout(displayList, 2000);
};

const displayList = () => {
  document.querySelector(".cart-list").innerHTML = ``;
  likes.forEach((like) => {
    const html = `
    <li>
    <figure class="inner-cart">
    <img src=${like.imageUrl} alt="" />
    <h4>${formatString(like.title)}</h4>
    <h6 class="cart-price">${like.price}rs</h6>
      </figure>
      </li>`;
    document.querySelector(".cart-list").insertAdjacentHTML("beforeend", html);
  });
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

window.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    const query = document.getElementById("searchbox").value;
    if (query) {
      window.location.replace(`Products/products.html#${query}`);
    }
  }
});

// const displayProducts = () => {
//   vegiesData.map((veggie) => {
//     const html = `
//     <div class="card">
//     <div class="card-body">
//       <img src=${veggie.imageUrl} alt="" class="vege" />

//       <h4 class="card-title mt-5">${veggie.title}</h4>
//       <p class="card-subtitle">Fresh Juicy right from Arizona</p>
//       <p class="price">${veggie.price}rs</p>
//       <button class="btn btn-success add">Add To Cart</button>
//       <span class="like"><i class="far fa-heart"></i></span>

//     </div>
//   </div>`;
//     document.querySelector(".veggies").insertAdjacentHTML("afterbegin", html);
//   });
//   const liked = (event) => {
//     console.log(event.target.childNodes);
//   };
//   const hearts = document.querySelectorAll(".like");

//   hearts.forEach((heart) => {
//     heart.addEventListener("click", liked);
//   });
// };
