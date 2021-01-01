import Products from "./Products.js"
import Storage from "./Storage.js"

const cartBtn = document.querySelector(".cart-btn")
const cartOverlay = document.querySelector(".cart-overlay")
const $cart = document.querySelector(".cart")
const cartCloseBtn = document.querySelector(".close-cart")
const productsCenter = document.querySelector(".products-center")
const clearBtn = document.querySelector(".clear-cart")
const cartContent = document.querySelector(".cart-content")
const cartTotal = document.querySelector(".cart-total")
let cart = Storage.getCart()

class UI {
    displayProducts(products) {
        productsCenter.innerHTML = products
            .map(
                ({ title, image, id, price }) => `<article class="product">
                <div class="img-container">
                    <img src="${image}" alt="product" class="product-img">
                    <button class="bag-btn" data-id="${id}">
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${title}</h3>
                <h4>$${price}</h4>
            </article>`
            )
            .join("")
    }

    getBagButtons() {
        const buttons = document.querySelectorAll(".bag-btn")
        buttons.forEach((button) => {
            const id = button.dataset.id
            const inCart = cart.find((item) => item.id === id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }
            button.addEventListener("click", (e) => {
                e.target.innerHTML = "In Cart"
                e.target.disabled = true
                const cartItem = { ...Storage.getProduct(id), amount: 1 }
                cart = [...cart, cartItem]
                Storage.saveCart(cart)
            })
        })
    }
}

const ui = new UI()
const products = new Products(productsCenter)

products
    .getProducts() //
    .then((products) => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    })
    .then(() => ui.getBagButtons())

cartBtn.addEventListener("click", showCart)
cartCloseBtn.addEventListener("click", hiddenCart)
clearBtn.addEventListener("click", clearCart)

function showCart() {
    cartOverlay.style.visibility = "visible"
    $cart.classList.add("showCart")
}

function hiddenCart() {
    cartOverlay.style.visibility = "hidden"
    $cart.classList.remove("showCart")
}

function clearCart() {
    cartContent.innerHTML = ""
    cartTotal.innerHTML = "0"
}
