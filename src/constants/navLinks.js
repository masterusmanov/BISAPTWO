import home from "../assets/images/sidebar/home.svg";
import metod from "../assets/images/sidebar/metod.svg";
import nhh from "../assets/images/sidebar/nhh.svg";
import report from "../assets/images/sidebar/report.svg";
import contact from "../assets/images/sidebar/contact.svg";

const allNavLinks = [
  {
    id: 1,
    title: `sidebar.home`,
    link: "/dashboard/home",
    icon: home,
    roles: ["USER"],
  },
  {
    id: 2,
    title: "role.moderator",
    link: "/dashboard/moderator",
    icon: home,
    roles: ["ADMIN"],
  },
  {
    id: 3,
    title: "ministryorgan",
    link: "/dashboard/minorgan",
    icon: home,
    roles: ["MODERATOR"],
  },
  {
    id: 4,
    title: "sidebar.projecttask",
    link: "/dashboard/projecttask",
    icon: home,
    roles: ["MODERATOR"],
  },
  {
    id: 5,
    title: "sidebar.metod",
    link: "#",
    icon: metod,
    roles: ["USER"],
  },
  {
    id: 6,
    title: "sidebar.nhh",
    link: "#",
    icon: nhh,
    roles: ["USER"],
  },
  {
    id: 7,
    title: "sidebar.report",
    link: "#",
    icon: report,
    roles: ["USER"],
  },
  {
    id: 8,
    title: "sidebar.contact",
    link: "#",
    icon: contact,
    roles: ["USER"],
  },
];

export const getNavLinks = () => {
  const userRole = sessionStorage.getItem("userRole");

  if (!userRole) {
    return [];
  }

  return allNavLinks.filter((link) => link.roles.includes(userRole));
};

export const getAllNavLinks = () => {
  return allNavLinks;
};

export const navLinks = allNavLinks;
