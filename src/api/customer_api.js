import { BASEURL } from '../../config'

const registerCustomer = (customer) => {
    return fetch(`${BASEURL}/api/customer/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(customer),
    });
}

const loginCustomer = (credentials) => {
    return fetch(`${BASEURL}/api/customer/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
    });
}

const getAllCustomers = () => {
    return fetch(`${BASEURL}/api/customer/get/all`);
}

export { registerCustomer, loginCustomer, getAllCustomers }