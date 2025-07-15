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
                <label>Name:</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />{" "}
                <br />
                <br />
                <label>Description:</label>
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />{" "}
                <br />
                <br />
                <label>Price:</label>
                <input
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                />{" "}
                <br />
                <br />
                <label>Image: </label>
                <input name="image" type="file" onChange={handleChange} />{" "}
                <br />
                <br />
                <label>Category: </label>
                <select name="category_id" onChange={handleChange}>
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                        </option>
                    ))}
                </select>{" "}
                <br />
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
