import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AboutUs from "../views/AboutUs.vue";
import Products from "../views/Products.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Cart from "../views/Cart.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Checkout from "../views/Checkout.vue";
import UserProfile from "../views/UserProfile.vue";
import Brand from "../views/Brand.vue";
import ResetPassword from "../views/ResetPassword.vue";
import PageNotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: AboutUs,
  },
  {
    path: "/:brand",
    name: "brand",
    component: Brand,
    props: true,
  },
  {
    path: "/:brand/:subbrand",
    name: "products",
    component: Products,
    props: true,
  },
  {
    path: "/:brand/:subbrand/:name",
    name: "detail",
    component: ProductDetail,
    props: true,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
  },
  {
    path: "/user/:nickname",
    name: "profile",
    component: UserProfile,
    props: true,
  },
  {
    path: "/user/reset-password",
    name: "reset",
    component: ResetPassword,
  },
  {
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
