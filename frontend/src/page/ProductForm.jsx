import React, { useEffect, useState } from "react";
import { axiosClient } from "../api/axios";
import { z } from "zod";
export default function ProductForm() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: null,
        category_id: "",
    });

    const productSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.coerce.number().positive("Price must be a positive number"),
        category_id: z.string().min(1, "Category is required"),
        image: z.instanceof(File, { message: "Image is required" }),
    });

    useEffect(() => {
        axiosClient
            .get("/api/categories")
            .then(({ data }) => setCategories(data.data))
            .catch((error) =>
                console.error("Failed to load categories", error)
            );
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsedData = productSchema.parse(formData);

            await axiosClient.get("/sanctum/csrf-cookie");

            const payload = new FormData();
            Object.entries(parsedData).forEach(([key, value]) => {
                payload.append(key, value);
            });

            await axiosClient.post("/api/product", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Product created successfully!");
        } catch (error) {
            if (error.name === "ZodError") {
                console.error("Validation errors:", error.errors);
                alert("Validation failed. Check console.");
            } else {
                console.error("Failed to create product:", error);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h1>Create Product</h1>
                <div
                    className="input-group input-group-sm mb-3"
                    style={{ width: "30% " }}
                >
                    <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                    >
                        Name
                    </span>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                    />
                </div>
                <div
                    className="input-group input-group-sm mb-3"
                    style={{ width: "30% " }}
                >
                    <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                    >
                        Description
                    </span>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                    />
                </div>

                <div
                    style={{ width: "30% " }}
                    className="input-group input-group-sm mb-3"
                >
                    <span className="input-group-text"> Price</span>
                    <input
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">.00</span>
                </div>
                <div className="mb-3" style={{ width: "30% " }}>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        name="category_id"
                        onChange={handleChange}
                    >
                        <option value="">Select Category </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3" style={{ width: "30% " }}>
                    <label htmlFor="formFileSm" className="form-label">
                        Images
                    </label>
                    <input
                        name="image"
                        type="file"
                        onChange={handleChange}
                        className="form-control form-control-sm"
                        id="formFileSm"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            </form>
        </div>
    );
}
