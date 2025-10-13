import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  getAllProducts,
  addCategory,
  addProduct,
  updateCategory,
  updateProduct,
  deleteCategory,
  deleteProduct,
} from "../../utils/firebase/firebaseAdminServices";
import "./admin-dashboard.styles.scss";

export default function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const catData = await getAllCategories();
    const prodData = await getAllProducts();
    setCategories(catData);
    setProducts(prodData);
  };

  /* ============================
     🔹 CATEGORY HANDLERS
  ============================= */
  const handleAddCategory = async () => {
    if (!newCategory) return;
    await addCategory(newCategory);
    setNewCategory("");
    fetchData();
  };

  const handleUpdateCategory = async (id, name) => {
    await updateCategory(id, name);
    setEditingCategoryId(null);
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchData();
    }
  };

  /* ============================
     🔹 PRODUCT HANDLERS
  ============================= */
  const handleAddProduct = async () => {
    const { name, price, description, image, category } = newProduct;
    if (!name || !price || !category) return;
    await addProduct({ name, price: Number(price), description, image, category });
    setNewProduct({ name: "", price: "", description: "", image: "", category: "" });
    fetchData();
  };

  const handleUpdateProduct = async (id, data) => {
    await updateProduct(id, data);
    setEditingProductId(null);
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchData();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      {/* ====== Categories ====== */}
      <section>
        <h3>Categories</h3>
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>

        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {editingCategoryId === cat.id ? (
                <>
                  <input
                    type="text"
                    defaultValue={cat.name}
                    onBlur={(e) => handleUpdateCategory(cat.id, e.target.value)}
                  />
                  <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {cat.name}{" "}
                  <button onClick={() => setEditingCategoryId(cat.id)}>Edit</button>{" "}
                  <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ====== Products ====== */}
      <section>
        <h3>Products</h3>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddProduct}>Add Product</button>

        <ul>
          {products.map((prod) => (
            <li key={prod.id}>
              {editingProductId === prod.id ? (
                <>
                  <input
                    type="text"
                    defaultValue={prod.name}
                    onBlur={(e) => handleUpdateProduct(prod.id, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    defaultValue={prod.price}
                    onBlur={(e) => handleUpdateProduct(prod.id, { price: Number(e.target.value) })}
                  />
                  <button onClick={() => setEditingProductId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {prod.name} (${prod.price}) - {prod.category}{" "}
                  <button onClick={() => setEditingProductId(prod.id)}>Edit</button>{" "}
                  <button onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
