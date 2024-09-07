import { BASEURL } from '../../config'

const addProduct = (product) => {
    return fetch(`${BASEURL}/api/product/add`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(product),
    });
}

const productUpdate = (product) => {
    return fetch(`${BASEURL}/api/product/update`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(product),
    });
}

const getAllProducts = (storeID) => {
    return fetch(`${BASEURL}/api/product/get/${storeID}`);
}

const deleteProduct = (productID) => {
    return fetch(`${BASEURL}/api/product/delete/${productID}`);
}

export {
    addProduct,
    getAllProducts,
    productUpdate,
    deleteProduct
}