export default class Products {
    constructor(productsCenter) {
        this.productsCenter = productsCenter
    }
    async getProducts() {
        try {
            const result = await fetch("products.json")
            const data = await result.json()
            const products = data.items
            return products.map((item) => {
                const { title, price } = item.fields
                const { id } = item.sys
                const image = item.fields.image.fields.file.url
                return { title, price, id, image }
            })
        } catch (error) {
            console.log(error)
        }        
    }
}
