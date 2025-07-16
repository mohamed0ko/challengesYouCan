import React, { useEffect, useState } from "react";
import ProductApi from "../serveApi/ProductApi";
import { Link } from "react-router-dom";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleFilter = (e) => {
        e.preventDefault();
        const filtered = products.filter((product) => {
            const matchCategory =
                categoryFilter.trim() === "" ||
                product.category?.name
                    ?.toLowerCase()
                    .includes(categoryFilter.toLowerCase());

            const matchMin =
                minPrice === "" || product.price >= parseFloat(minPrice);

            const matchMax =
                maxPrice === "" || product.price <= parseFloat(maxPrice);

            return matchCategory && matchMax && matchMin;
        });
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        ProductApi.all()
            .then((response) => {
                console.log("Response:", response.data);
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch products", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Product List</h2>
                <Link to="/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Create Product
                </Link>
            </div>

            <form onSubmit={handleFilter} className="row g-3 mb-4">
                <div className="col-md-3">
                    <input
                        type="text"
                        id="filter"
                        name="category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="form-control"
                        placeholder="Search by Category..."
                    />
                </div>
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-text">Min</span>
                        <input
                            type="number"
                            id="minPrice"
                            name="minPrice"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="form-control"
                            placeholder="0"
                        />
                        <span className="input-group-text">$</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-text">Max</span>
                        <input
                            type="number"
                            id="maxPrice"
                            name="maxPrice"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="form-control"
                            placeholder="1000"
                        />
                        <span className="input-group-text">$</span>
                    </div>
                </div>
                <div className="col-md-3 d-grid">
                    <button type="submit" className="btn btn-outline-secondary">
                        <i className="fas fa-filter me-2"></i> Filter
                    </button>
                </div>
            </form>

            {filteredProducts?.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="row">
                    {filteredProducts.map((product) => (
                        <div className="col-md-3 mb-4" key={product.id}>
                            <div className="card h-100">
                                <img
                                    src={`http://localhost:8000/storage/${product.image}`}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{
                                        objectFit: "cover",
                                        height: "180px",
                                    }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        {product.name}
                                    </h5>
                                    <p className="card-text">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto d-flex flex-column gap-2">
                                        <span className="btn btn-outline-primary">
                                            ${product.price}
                                        </span>
                                        <span className="btn btn-outline-secondary">
                                            {product.category?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
