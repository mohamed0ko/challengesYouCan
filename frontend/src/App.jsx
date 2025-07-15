import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Route/Layout";
import Prouduct from "./page/Prouduct";
import ProductForm from "./page/ProductForm";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />} />

                <Route index path="/prouduct" element={<Prouduct />} />
                <Route path="/create" element={<ProductForm />} />
            </Routes>
        </>
    );
}

export default App;
