export default class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id) {
        const products = JSON.parse(localStorage.getItem("products"))
        return products.find((product) => product.id === id)
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"))
    }
}