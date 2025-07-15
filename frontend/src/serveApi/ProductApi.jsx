import { axiosClient } from "../api/axios";

const ProductApi = {
    all: async () => {
        return await axiosClient.get("/api/product");
    },
    create: async (payload) => {
        return await axiosClient.post("/api/product", payload);
    },
    delete: async (id) => {
        return await axiosClient.delete(`/api/product/${id}`);
    },
    update: async (id, payload) => {
        return await axiosClient.put(`/api/product/${id}`, payload);
    },
    getCategories: async () => {
        return await axiosClient.get("/api/categories");
    },
};
export default ProductApi;
