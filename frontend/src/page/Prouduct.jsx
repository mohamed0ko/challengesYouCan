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
            const matchCategory = product.category?.name
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
        <div>
            <h2>Product List</h2>
            <Link to="/create">
                <div class="input-group-append" style={{ textAlign: "end" }}>
                    <button class="btn btn-outline-secondary" type="submit">
                        <i class="fas fa-search">Create Product</i>
                    </button>
                </div>
            </Link>

            {/* Filter Form */}
            <form onSubmit={handleFilter}>
                <div class="input-group mb-3" style={{ width: "20% " }}>
                    <input
                        type="text"
                        id="filter"
                        name="category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        class="form-control"
                        placeholder="Search by Category..."
                        aria-label="Search"
                    />
                </div>
                <div
                    style={{ width: "20% " }}
                    className="input-group input-group-sm mb-2"
                >
                    <span className="input-group-text">Min Price</span>
                    <input
                        type="text"
                        id="minPrice"
                        name="minPrice"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">.00</span>
                </div>
                <div
                    style={{ width: "20% " }}
                    className="input-group input-group-sm mb-2"
                >
                    <span className="input-group-text">Max Price</span>
                    <input
                        type="text"
                        id="maxPrice"
                        name="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">.00</span>
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="submit">
                        <i class="fas fa-search">Filter</i>
                    </button>
                </div>
            </form>

            {/* Products List */}
            {(filteredProducts?.length || 0) === 0 ? (
                <p>No products found.</p>
            ) : (
                <div style={{ display: "flex" }}>
                    {filteredProducts.map((product) => (
                        /*  <div key={product.id} style={{ marginLeft: "30px" }}>
                            <p>
                                Name: <strong>{product.name}</strong>
                            </p>
                            <p> Price:${product.price}</p>

                            <p>Description:{product.description}</p>

                            <p> Category: {product.category?.name}</p>

                            <img
                                src={`http://localhost:8000/storage/${product.image}`}
                                alt={product.name}
                                style={{
                                    width: "150px",
                                    height: "auto",
                                    marginTop: "5px",
                                }}
                            />
                        </div> */
                        <div
                            classNameName="card"
                            style={{ width: "14rem" }}
                            key={product.id}
                        >
                            <img
                                style={{ width: "80% " }}
                                src={`http://localhost:8000/storage/${product.image}`}
                                alt={product.name}
                            />
                            <div classNameName="card-body">
                                <h5 classNameName="card-title">
                                    {product.name}
                                </h5>
                                <p classNameName="card-text">
                                    {product.description}
                                </p>
                                <a href="" classNameName="btn btn-primary">
                                    ${product.price}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
