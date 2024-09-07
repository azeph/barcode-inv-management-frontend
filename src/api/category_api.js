import { BASEURL } from "../../config";

const addCategory = (category) => {
  return fetch(`${BASEURL}/api/category/add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(category),
  });
};

const getAllCategories = () => {
  return fetch(`${BASEURL}/api/category/get/all`);
};

const deleteCategory = (categoryId) => {
  return fetch(`${BASEURL}/api/category/delete/${categoryId}`);
};

export { getAllCategories, addCategory, deleteCategory };
