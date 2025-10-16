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
  const [activeTab, setActiveTab] = useState('categories');

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const catData = await getAllCategories();
      const prodData = await getAllProducts();
      setCategories(catData);
      setProducts(prodData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    await addCategory(newCategory);
    setNewCategory("");
    await fetchData();
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

  const handleAddProduct = async () => {
    const { name, price, description, image, category } = newProduct;
    if (!name || !price || !category) return;
    setLoading(true);
    await addProduct({ name, price: Number(price), description, image, category });
    setNewProduct({ name: "", price: "", description: "", image: "", category: "" });
    await fetchData();
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
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store categories and products</p>
      </header>

      <nav className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </nav>

      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Manage Categories</h2>
          </div>
          
          <div className="add-form">
            <div className="form-row">
              <input
                type="text"
                className="form-input"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddCategory}>
                Add Category
              </button>
            </div>
          </div>

          <div className="items-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="item-card">
                {editingCategoryId === cat.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      className="form-input"
                      defaultValue={cat.name}
                      onBlur={(e) => handleUpdateCategory(cat.id, e.target.value)}
                      autoFocus
                    />
                    <div className="card-actions">
                      <button className="btn btn-secondary" onClick={() => setEditingCategoryId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="item-content">
                    <h3 className="item-title">{cat.name}</h3>
                    <div className="card-actions">
                      <button className="btn btn-edit" onClick={() => setEditingCategoryId(cat.id)}>
                        Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteCategory(cat.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Manage Products</h2>
          </div>
          
          <div className="add-form">
            <div className="form-grid">
              <input
                type="text"
                className="form-input"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <select
                className="form-select"
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
              <button className="btn btn-primary btn-full" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>

          <div className="items-grid">
            {products.map((prod) => (
              <div key={prod.id} className="item-card product-card">
                {editingProductId === prod.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      className="form-input"
                      defaultValue={prod.name}
                      onBlur={(e) => handleUpdateProduct(prod.id, { name: e.target.value })}
                    />
                    <input
                      type="number"
                      className="form-input"
                      defaultValue={prod.price}
                      onBlur={(e) => handleUpdateProduct(prod.id, { price: Number(e.target.value) })}
                    />
                    <div className="card-actions">
                      <button className="btn btn-secondary" onClick={() => setEditingProductId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="item-content">
                    {prod.image && (
                      <div className="product-image" style={{backgroundImage: `url(${prod.image})`}} />
                    )}
                    <h3 className="item-title">{prod.name}</h3>
                    <p className="product-price">${prod.price}</p>
                    <p className="product-category">{prod.category}</p>
                    <div className="card-actions">
                      <button className="btn btn-edit" onClick={() => setEditingProductId(prod.id)}>
                        Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteProduct(prod.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}