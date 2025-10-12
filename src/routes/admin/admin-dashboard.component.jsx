import React, { useState } from 'react';
import './admin-dashboard.styles.scss';

const defaultFormFields = {
    title: '',
    price: '',
    category: '',
    imageUrl: '',
    description: ''
};

const AdminDashboard = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('Product added (frontend only)');
        setTimeout(() => {
            setLoading(false);
            setFormFields(defaultFormFields);
        }, 1000);
    };

    return (
        <div className="admin-dashboard">
            <h2>Add New Product</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Product Title"
                    value={formFields.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formFields.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formFields.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formFields.imageUrl}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formFields.description}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
            </form>
            {success && <div className="success-msg">{success}</div>}
            {error && <div className="error-msg">{error}</div>}
        </div>
    );
};

export default AdminDashboard;