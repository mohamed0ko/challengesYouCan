import React from "react";

import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <div style={{ padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
}
