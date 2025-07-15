import React from "react";
import Header from "../page/Header";

import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <Header />
            <div style={{ padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
}
