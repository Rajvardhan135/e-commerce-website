export const getAllCategories = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories')
        const data = await response.json()
        return data;
    } catch (error) {
    }

}

export const getProducts = async (category) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`)
        const data = await response.json()
        return data;
    } catch (error) {
    }
}

export const getAllProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json()
        return data;
    } catch (error) {
    }
}
