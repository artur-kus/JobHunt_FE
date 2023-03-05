import { Navigation } from "react-minimal-side-navigation";
import React from "react";
import "./sidebar.css";

export function SidebarCompany() {
    return (
        <div className="sidebar">
            <Navigation
                activeItemId="/dashboard"
                onSelect={({ itemId }) => {
// maybe push to the route
                }}
                items={[
                    {
                        title: "Dashboard",
                        itemId: "/dashboard",
                        cName: "nav-text",
                    },
                    {
                        title: "Management",
                        itemId: "/management",
                        cName: "nav-text",
                        subNav: [
                            {
                                title: "Projects",
                                itemId: "/management/projects",
                                cName: "sub-nav-text",
                            },
                            {
                                title: "Members",
                                itemId: "/management/members",
                                cName: "sub-nav-text",
                            },
                        ],
                    },
                ]}
                itemClassName="nav-text"
                activeItemClassName="active-nav"
                subNavClassName="sub-nav-text"
            />
        </div>
    );
}

export function SidebarAdmin() {
    return (
        <div className="sidebar">
            <Navigation
                activeItemId="/dashboard"
                onSelect={({ itemId }) => {
// maybe push to the route
                }}
                items={[
                    {
                        title: "Dashboard",
                        itemId: "/admin/dashboard",
                        cName: "nav-text",
                    },
                    {
                        title: "Users",
                        itemId: "/admin/users",
                        cName: "nav-text",
                    }]}
                itemClassName="nav-text"
                activeItemClassName="active-nav"
                subNavClassName="sub-nav-text"
            />
        </div>
    );
}