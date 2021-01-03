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
const cartItems = document.querySelector(".cart-items")
let cart = []
let buttonsDOM = []

class UI {
    displayProducts(products) {
        productsCenter.innerHTML = products
            .map(
                ({ title, image, id, price }) => `<article class="product">
                <div class="img-container">
                    <img src="${image}" alt="product" class="product-img">
                    <button class="bag-btn" data-id="${id}">
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
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
        buttonsDOM = [...buttons]
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
                this.setCartValues(cart)
                this.addCartItem(cartItem)
                this.showCart()
            })
        })
    }

    setCartValues(cart) {
        let total = 0
        let itemsTotal = 0
        cart.forEach((product) => {
            total += product.price * product.amount
            itemsTotal += product.amount
        })
        cartTotal.innerHTML = parseFloat(total.toFixed(2))
        cartItems.innerHTML = itemsTotal
    }

    addCartItem(product) {
        const div = document.createElement("div")
        div.classList.add("cart-item")
        div.innerHTML = `
                        <img src="${product.image}" alt="product" />
                        <div>
                            <h4>${product.title}</h4>
                            <h5>$${product.price}</h5>
                            <span class="remove-item" data-id="${product.id}">remove</span>
                        </div>
                        <div>
                            <i class="fas fa-chevron-up" data-id="${product.id}"></i>
                            <p class="item-amount">${product.amount}</p>
                            <i class="fas fa-chevron-down" data-id="${product.id}"></i>
                        </div>
                        `
        cartContent.append(div)
    }

    showCart() {
        cartOverlay.classList.add("transparentBcg")
        $cart.classList.add("showCart")
    }

    hideCart() {
        cartOverlay.classList.remove("transparentBcg")
        $cart.classList.remove("showCart")
    }

    setupApp() {
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
        cartBtn.addEventListener("click", this.showCart)
        cartCloseBtn.addEventListener("click", this.hideCart)
    }
    populateCart(cart) {
        cart.map((product) => this.addCartItem(product))
    }

    cartLogic() {
        clearBtn.addEventListener("click", () => {
            this.clearCart()
        })
    }

    removeCartItem(id, div) {
        const findIndex = cart.findIndex((product) => product.id === id)
        cart.splice(findIndex, 1)
        Storage.saveCart(cart)
        this.setCartValues(cart)
        div.remove()
    }

    clearCart() {        
        let cartItems = cart.map((item) => item.id)
        cartItems.map((id) => this.removeItem(id))
        cartContent.innerHTML = ""
        this.hideCart()
    }

    removeItem(id) {
        cart = cart.filter((item) => item.id !== id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }

    getSingleButton(id) {
        return buttonsDOM.find((button) => button.dataset.id === id)
    }

    increaseCartItem(id) {
        const item = cart.find((item) => item.id === id)
        item.amount++
        Storage.saveCart(cart)
        this.setCartValues(cart)
        // 전체 다 지우고 다시 만들기? or amount만 변경?
    }

    decarseCartItem(id) {}
}

const ui = new UI()
const products = new Products(productsCenter)

ui.setupApp()

products
    .getProducts() //
    .then((products) => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    })
    .then(() => {
        ui.getBagButtons()
        ui.cartLogic()
    })

cartContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
        ui.removeItem(e.target.dataset.id)
    } else if (e.target.classList.contains("fa-chevron-up")) {
        ui.increaseCartItem(e.target.dataset.id)
    } else if (e.target.classList.contains("fa-chevron-down")) {
        ui.decarseCartItem(e.target.dataset.id)
    }
})
