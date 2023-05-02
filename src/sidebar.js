import {Link} from 'react-router-dom';
import React from "react";
import "./sidebar.css";

export function SidebarCompany() {
    return (
        <div className="sidebar">
            <Link to="/dashboard/company/" className="sidebar__link">
                Dashboard
            </Link>
            <Link to="/dashboard/company/jobs" className="sidebar__link">
                Jobs
            </Link>
            <Link to="/dashboard/company/settings" className="sidebar__link">
                Settings
            </Link>
        </div>
    );
}

export function SidebarAdmin() {
    return (
        <div className="sidebar">
            <Link to="/dashboard/admin/" className="sidebar__link">
                Dashboard
            </Link>
            <Link to="/dashboard/admin/jobs" className="sidebar__link">
                Jobs
            </Link>
            <Link to="/dashboard/admin/companies" className="sidebar__link">
                Companies
            </Link>
        </div>
    );
}

// export function Navbar() {
//     return (
//         <div className="sidebar">
//             <Navigation
//                 activeItemId="/dashboard"
//                 onSelect={({itemId}) => {
// // maybe push to the route
//                 }}
//                 items={[
//                     {
//                         title: "Dashboard",
//                         itemId: "/dashboard",
//                         cName: "nav-text",
//                     },
//                     {
//                         title: "Management",
//                         itemId: "/management",
//                         cName: "nav-text",
//                         subNav: [
//                             {
//                                 title: "Projects",
//                                 itemId: "/management/projects",
//                                 cName: "sub-nav-text",
//                             },
//                             {
//                                 title: "Members",
//                                 itemId: "/management/members",
//                                 cName: "sub-nav-text",
//                             },
//                         ],
//                     },
//                 ]}
//                 itemClassName="nav-text"
//                 activeItemClassName="active-nav"
//                 subNavClassName="sub-nav-text"
//             />
//         </div>
//     );
// }
//
// export function Test() {
//     return (
//         <div className="sidebar">
//             <Navigation
//                 activeItemId="/dashboard"
//                 onSelect={({itemId}) => {
// // maybe push to the route
//                 }}
//                 items={[
//                     {
//                         title: "Dashboard",
//                         itemId: "/dashboard/admin/",
//                         cName: "nav-text",
//                     },
//                     {
//                         title: "Jobs",
//                         itemId: "/dashboard/admin/jobs",
//                         cName: "nav-text",
//                     },
//                     {
//                         title: "Companies",
//                         itemId: "/dashboard/admin/companies",
//                         cName: "nav-text",
//                     }
//                 ]}
//                 itemClassName="nav-text"
//                 activeItemClassName="active-nav"
//                 subNavClassName="sub-nav-text"
//             />
//         </div>
//     );
// }