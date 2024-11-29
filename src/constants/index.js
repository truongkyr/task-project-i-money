export const PUBLIC_LAYOUT = "default";

export const PROFILE_OPTIONS = [
    {
      name: "Ví",
      icon: "fa-solid fa-wallet text-2xl",
      route: {
        name: "Wallet",
        params: {},
      },
    },
    {
      name: "Công cụ",
      icon: "fa-solid fa-screwdriver-wrench",
      route: {
        name: "Tools",
        params: {},
      },
    },
    {
      name: "Quyền riêng tư",
      icon: "fa-solid fa-lock",
      route: {
        name: "Private",
        params: {},
      },
    },
    {
      name: "Về chúng tôi",
      icon: "fa-solid fa-circle-info",
      route: {
        name: "About",
        params: {},
      },
    },
    {
      name: "Đăng xuất",
      icon: "fa-solid fa-right-from-bracket",
      route: {
        name: "Logout",
        params: {},
      },
    },
  ];

export const NAV_BOTTOM_ITEMS = [
  {
    icon: "fa-solid fa-house",
    Text: "home",
    name: "home",
  },
  {
    icon: "fa-solid fa-chart-simple",
    Text: "Report",
    name: "Report",
  },
  {
    icon: "fa-solid fa-chart-pie",
    Text: "Budget",
    name: "Budget",
  },
  {
    icon: "fa-solid fa-user",
    Text: "Profile",
    name: "Profile",
  },
];
