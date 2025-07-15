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
                <button>Create Product</button>
            </Link>

            {/* Filter Form */}
            <form onSubmit={handleFilter}>
                <label htmlFor="filter">Filter by category:</label>
                <input
                    type="text"
                    id="filter"
                    name="category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                />
                <br /> <br />
                <label htmlFor="minPrice">Min Price</label>
                <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <br />
                <label htmlFor="maxPrice">Min Price</label>
                <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <br /> <br />
                <button type="submit">Filter</button>
            </form>

            {/* Products List */}
            {(filteredProducts?.length || 0) === 0 ? (
                <p>No products found.</p>
            ) : (
                <div style={{ display: "flex" }}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} style={{ marginLeft: "30px" }}>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
