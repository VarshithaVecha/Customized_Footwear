let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick =() =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

let slides = document.querySelectorAll('.slide-container');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

document.querySelectorAll('.featured-image-1').forEach(image_1 =>{
    image_1.addEventListener('click', () =>{
        var src = image_1.getAttribute('src');
        document.querySelector('.big-image-1').src = src;
    });
});

document.querySelectorAll('.featured-image-2').forEach(image_2 =>{
    image_2.addEventListener('click', () =>{
        var src = image_2.getAttribute('src');
        document.querySelector('.big-image-2').src = src;
    });
});

document.querySelectorAll('.featured-image-3').forEach(image_3 =>{
    image_3.addEventListener('click', () =>{
        var src = image_3.getAttribute('src');
        document.querySelector('.big-image-3').src = src;
    });
});




const imageMapping = {
    "red": {
        "smooth": "images/red_smooth.jpg",
        "textured": "images/red_textured.jpg"
    },
    "blue": {
        "smooth": "images/blue_smooth.jpg",
        "textured": "images/blue_textured.jpg"
    },
    "black": {
        "smooth": "images/black_smooth.jpg",
        "textured": "images/black_textured.jpg"
    },
    // Add more mappings as needed
};

// Array to hold cart items
let cart = [];

// Function to add customized product to cart
async function addCustomizedToCart() {
    const color = document.getElementById('color').value;
    const leather = document.getElementById('leather').value;
    const additionalInfo = document.getElementById('additional-info').value;
    const footWidth = document.getElementById('foot-width').value;
    const footHeight = document.getElementById('foot-height').value;

    const imageUrl = 'img/default_image.png'; // Fallback image

    const newItem = {
        type: "Customized Shoes",
        color: color,
        leather: leather,
        additionalInfo: additionalInfo,
        footWidth: footWidth,
        footHeight: footHeight,
        price: 150, // Placeholder price
        imageUrl: imageUrl
    };

    try {
        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            const addedItem = await response.json(); // Assuming the server responds with the added item
            cart.push(addedItem); // Add item to local cart array
            updateCartDisplay(); // Update cart display
            await updateCartCount();
            clearCustomizationFields(); // Clear input fields
        } else {
            console.error('Failed to add item to cart');
            alert('Failed to add product to cart.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to clear customization fields
function clearCustomizationFields() {
    document.getElementById('color').value = '';
    document.getElementById('leather').value = '';
    document.getElementById('additional-info').value = '';
    document.getElementById('foot-width').value = '';
    document.getElementById('foot-height').value = '';
}

// Function to update cart display
async function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalCostDisplay = document.getElementById('total-cost');

    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalCost = 0;

    try {
        const response = await fetch('http://localhost:5000/api/cart');
        const items = await response.json();
        if (items.length === 0) {
            alert('Your cart is empty'); // Show empty cart alert
            totalCostDisplay.innerText = '$0.00'; // Reset total cost display
            return; // Exit the function if there are no items
        }

        for (const item of items) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.type}" class="cart-item-image" />
                <div class="cart-item-details">
                    <p><strong>${item.type}</strong></p>
                    <p>Color: ${item.color}</p>
                    <p>Leather: ${item.leather}</p>
                    <p>Foot Width: ${item.footWidth} cm</p>
                    <p>Foot Height: ${item.footHeight} cm</p>
                    <p>Additional Info: ${item.additionalInfo}</p>
                    <p>Price: $${item.price}</p>
                    <button onclick="removeFromCart('${item._id}')">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
            totalCost += item.price;
        }
        
        totalCostDisplay.innerText = `$${totalCost.toFixed(2)}`; // Show total cost
        alert('Product added to cart');
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

// Function to remove item from cart
async function removeFromCart(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            cart = cart.filter(item => item._id !== id); // Update local cart array
            updateCartDisplay(); // Update cart display
            await updateCartCount();
            alert('Product removed from cart'); // Alert message
        } else {
            console.error('Failed to remove item from cart');
            alert('Failed to remove product from cart.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to handle checkout
function checkout() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days to current date
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    alert(`Your order will be delivered by ${deliveryDate.toLocaleDateString(undefined, options)}`);
}
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(); // Fetch and display cart count on page load
});
async function updateCartCount() {
  try {
      const response = await fetch('http://localhost:5000/api/cart/count');
      const data = await response.json();
      const cartCount = data.count;

      const cartCountElement = document.getElementById('cart-count');
      cartCountElement.innerText = cartCount; // Update the count display
      cartCountElement.style.display = cartCount > 0 ? 'inline' : 'none'; // Show or hide based on count
  } catch (error) {
      console.error('Error fetching cart count:', error);
  }
}
window.onload = function() {
  updateCartCount(); // Fetch and display cart count on page load
};

// Initial display update
updateCartDisplay();




// Show alerts
function showAlert(message) {
    alert(message);
  }
  
  // Handle Signup
  async function handleSignup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      showAlert("Passwords do not match!");
      return;
    }
  
    // Send data to the backend
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword}),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        showAlert(result.message); // "You have successfully created an account"
        closeSignupModal();
      } else {
        showAlert(result.message); // Show error from backend (e.g., "User already exists")
      }
    } catch (error) {
      showAlert("Signup failed. Please try again later.");
    }
  }
  
  // Handle Login
  async function handleLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", result.token); // Save JWT or session token
        showAlert(result.message); // "You have successfully logged in"
        closeLoginModal();
        updateUIAfterLogin();
      } else {
        showAlert(result.message); // Show error message (e.g., "Invalid credentials")
      }
    } catch (error) {
      showAlert("Login failed. Please try again later.");
    }
  }
  
  // Update UI after successful login
  function updateUIAfterLogin() {
    const token = localStorage.getItem("token");
    if (token) {
      document.querySelector(".btn[onclick='openLoginModal()']").style.display = "none";
      document.querySelector(".btn[onclick='openSignupModal()']").style.display = "none";
      document.getElementById("profile").style.display = "block";
  
      // Fetch profile information
      fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        }
      })
      .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load profile"); // Handle non-OK responses
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("profileInitials").textContent = data.email.charAt(0).toUpperCase();
        document.getElementById("userEmail").textContent = data.email;
    })
    .catch(err => {
        showAlert(err.message); // Show error message
    });
    }
  }
  
  // Handle Logout
  function logout() {
    localStorage.removeItem("token");
    showAlert("You have successfully logged out.");
    updateUIAfterLogout();
  }
  
  // Update UI after logout
  function updateUIAfterLogout() {
    document.querySelector(".btn[onclick='openLoginModal()']").style.display = "inline-block";
    document.querySelector(".btn[onclick='openSignupModal()']").style.display = "inline-block";
    document.getElementById("profile").style.display = "none";
  }
  
  // Initialize the page based on login state
  function initializePage() {
    const token = localStorage.getItem("token");
    if (token) {
      updateUIAfterLogin();
    } else {
      updateUIAfterLogout();
    }
  }
  
  // Modal handling (for showing and hiding modals)
  function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
  }
  
  function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
  }
  
  function openSignupModal() {
    document.getElementById("signupModal").style.display = "block";
  }
  
  function closeSignupModal() {
    document.getElementById("signupModal").style.display = "none";
  }
  
  // Initialize page when it loads
  window.onload = initializePage;
  