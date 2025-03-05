import { v4 as uuidv4 } from "uuid";
import products from "../database/productsDb.js";

const uniqueId = uuidv4();

const getProducts = (req, res) => {
  res.status(200).json({ success: true, products });
};

const addProduct = (req, res) => {
  const productsCopy = products.slice();
  const { productName, productDescription, price, stock } = req.body;
  const requiredFields = [
    "productName",
    "productDescription",
    "price",
    "stock",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  } else {
    const newProduct = {
      id: uniqueId,
      productName: productName,
      description: productDescription,
      price: price,
      stock: Number(stock),
      time: new Date().toString(),
    };
    productsCopy.push(newProduct);
    res.status(200).json({
      success: true,
      message: "product added successfully!",
      newProduct,
    });
  }
};

const getProductById = (req, res) => {
  const { id } = req.params;
  const foundProduct = products.find((product) => product.id === id);

  if (!foundProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found!" });
  } else {
    return res.status(200).json({ success: true, foundProduct });
  }
};

export { getProducts, addProduct, getProductById };
