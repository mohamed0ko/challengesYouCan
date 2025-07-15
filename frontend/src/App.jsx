import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Route/Layout";
import Prouduct from "./page/Prouduct";
import ProductForm from "./page/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <>
            <Routes>
                {/* Layout يحتوي على Header + Outlet */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Prouduct />} />
                    <Route path="create" element={<ProductForm />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
