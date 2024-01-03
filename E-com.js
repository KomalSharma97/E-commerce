
let icon = document.querySelector(".icon");
let ul = document.querySelector("ul");

icon.addEventListener("click", ()=>{
    ul.classList.toggle("showData");
   
    if(ul.className == "showData") {
        document.getElementById("bar").className= "fa-solid fa-xmark";
    } else {
        document.getElementById("bar").className= "fa-solid fa-bars";
    }
})

//navbar
let shops = document.getElementById("shops");
let reviews = document.getElementById("reviews");
let blogs = document.getElementById("blogs");
let contacts = document.getElementById("contacts");

// Shop Content
let shopContent = document.getElementById("shop-products");

shops.addEventListener("click", () => {
    shops.style.color="rgb(4, 219, 219)";
    reviews.style.color="white";
    blogs.style.color="white";
    contacts.style.color="white";

    // Scroll to the shop content
    shopContent.scrollIntoView({ behavior: "smooth" });
     
});

reviews.addEventListener("click", () => {
    reviews.style.color="rgb(4, 219, 219)";
    shops.style.color="white";
    blogs.style.color="white";
    contacts.style.color="white";
    
   
});
blogs.addEventListener("click", () => {
   blogs.style.color="rgb(4, 219, 219)";
   reviews.style.color="white";
    shops.style.color="white";
    contacts.style.color="white";
   
})
contacts.addEventListener("click", () => {
    contacts.style.color="rgb(4, 219, 219)";
    reviews.style.color="white";
    blogs.style.color="white";
    shops.style.color="white";
  
})

// cart open close
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
//Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};
//close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Making Add to cart
// Cart Working JS
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

//Making Function
function ready() {
    // Remove Item From Cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    //Quantity Change
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // Add to cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
       button.addEventListener("click", addCartClicked);
    }
    loadCartItems();
}

//Remove Cart Item
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
}
//Quantity Change
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}

//Add Cart Function
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}
function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("You have already added this item to cart");
            return;
        }
    }
    var cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input
        type="number"
        name=""
        id=""
        value="1"
        class="cart-quantity"
        />
    </div>
    <!--remove item-->
   <i class="fas fa-trash-alt cart-remove"></i>
   `;
   cartShopBox.innerHTML = cartBoxContent;
   cartItems.append(cartShopBox);

   cartShopBox
   .getElementsByClassName("cart-remove")[0]
   .addEventListener("click", removeCartItem );
   cartShopBox
   .getElementsByClassName("cart-quantity")[0]
   .addEventListener("change", quantityChanged);
   saveCartItems();
   updateCartIcon ();
}

//Update Total
function updatetotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    // If Price contain some cents
    total = Math.round(total * 100) / 100;
        document.getElementsByClassName("total-price")[0].innerText = "$" + total;
        //Save Total To LocalStorage
        localStorage.setItem("cartTotal", total);

}

//Keep Item in cart when page refresh with Localstorage
function saveCartItems() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var cartItems = [];

    for (var i=0; i< cartBoxes.length; i++) {
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cart.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var productImg = cartBox.getElementsByClassName("cart-img")[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

}

// Loads In Cart
function loadCartItems () {
    var cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for(var i=0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem("cartTotal");
    if(cartTotal) {
        document.getElementsByClassName("total-price")[0].innerText = "$" + cartTotal;
    }
    updateCartIcon ();
}


// Quantity In Cart Icon
function updateCartIcon () {
    var cartBoxes = document.getElementsByClassName("cart-box");
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", quantity);
}

// Clear Cart Item After Successfully Payment
function clearCart() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = "";
    updatetotal();
    localStorage.removeItem("cartItems");
}


   
//connect

async function connect() {
    // Get input values
    var name = document.getElementById('names').value;
    var number = document.getElementById('number').value;

   // Validate name and number (add your validation logic)

   try {
    // Make a POST request to the /contact route
    const response = await fetch("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, number })
    });

    // Handle the response from the server
    if (response.ok) {
        alert("Contact information saved successfully");
    } else {
        const jsonResponse = await response.json();
        if (jsonResponse.error) {
            // Handle the specific Stripe error
            if (jsonResponse.error.type === 'StripeInvalidRequestError') {
                // Handle the invalid request error
                console.error('StripeInvalidRequestError:', jsonResponse.error.message);
            } else {
                // Handle other types of errors
                console.error('Other error:', jsonResponse.error.message);
            }
        } else {
            // Handle non-Stripe errors
            console.error('Non-Stripe error:', jsonResponse);
        }
        alert("Failed to save contact information");
    }
} catch (error) {
    console.error('Error in connect function:', error);
    alert("An error occurred while saving contact information");
}
}