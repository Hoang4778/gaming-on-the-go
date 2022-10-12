<template>
  <nav>
    <img alt="page-logo" src="../assets/Gaming-on-the-go-logo.png" />
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li id="brand">
        <span>Brands</span>
        <ul id="brand-list">
          <li v-for="brand in brandList" :key="brand">
            <router-link :to="{ name: 'brand', params: { brand: brand } }">{{
              brand
            }}</router-link>
          </li>
        </ul>
      </li>
      <li><router-link to="/about">About us</router-link></li>
      <li v-if="username" id="login">
        <ul>
          <li>
            <router-link
              :to="{ name: 'profile', params: { nickname: username } }"
              ><i class="fa-solid fa-user"></i> {{ username }}
            </router-link>
          </li>
          <li>
            <button @click="handleLogout" class="logout">Logout</button>
          </li>
        </ul>
      </li>
      <li v-else id="login">
        <ul>
          <li>
            <router-link to="/login">Login</router-link>
          </li>
          <li>
            <router-link to="/signup">Signup</router-link>
          </li>
        </ul>
      </li>
    </ul>
    <ul id="hamburger">
      <li>
        <router-link class="cart" to="/cart"
          ><i class="fa-solid fa-cart-shopping"></i>
          <span class="item-num">{{ itemNum }}</span>
        </router-link>
      </li>
      <li>
        <i class="fa-solid fa-bars" @click="dropdownMenu"></i>
      </li>
    </ul>
  </nav>
  <ul
    class="mobile-links"
    :class="{ dropdown: isDropped }"
    @click="isDropped = !isDropped"
  >
    <li><router-link to="/">Home</router-link></li>
    <li id="mobile-brand">
      <span>Brands</span>
      <ul id="mobile-brand-list">
        <li v-for="brand in brandList" :key="brand">
          <router-link :to="{ name: 'brand', params: { brand: brand } }">{{
            brand
          }}</router-link>
        </li>
      </ul>
    </li>
    <li><router-link to="/about">About us</router-link></li>
    <li v-if="username" id="mobile-login">
      <ul>
        <li>
          <router-link :to="{ name: 'profile', params: { nickname: username } }"
            ><i class="fa-solid fa-user"></i> {{ username }}
          </router-link>
        </li>
        <li>
          <button @click="handleLogout" class="logout">Logout</button>
        </li>
      </ul>
    </li>
    <li v-else id="mobile-login">
      <ul>
        <li>
          <router-link to="/login">Login</router-link>
        </li>
        <li>
          <router-link to="/signup">Signup</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { collection, onSnapshot } from "@firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import { signOut } from "@firebase/auth";

export default {
  setup() {
    const store = useStore();
    const username = computed(() =>
      store.state.nickname ? store.state.nickname : ""
    );
    const brandList = ref(null);
    const isDropped = ref(false);
    const itemNum = computed(() =>
      store.state.cartSum ? store.state.cartSum : 0
    );

    onSnapshot(collection(firestore, "products"), (snap) => {
      let item = snap.docs.map((doc) => {
        return doc.id;
      });
      brandList.value = item;
    });

    function handleLogout() {
      window.localStorage.removeItem("username");
      signOut(auth);
      store.commit("updateUsername", "");
    }

    function dropdownMenu() {
      isDropped.value = !isDropped.value;
    }

    return {
      handleLogout,
      username,
      brandList,
      dropdownMenu,
      isDropped,
      itemNum,
    };
  },
};
</script>

<style scoped>
.mobile-links {
  display: none;
}
nav {
  background-color: hsl(265, 79%, 40%);
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  height: 6rem;
  padding: 0 5%;
}
nav > img {
  margin-right: auto;
}
a {
  text-decoration: none;
  color: white;
}
li {
  list-style: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-links > li > a {
  padding: 2rem 0;
}
.nav-links > li > a:hover {
  border-bottom: 3px solid white;
}
#brand {
  color: white;
  position: relative;
}
#brand > span {
  padding: 2rem 0;
  cursor: pointer;
}
#brand-list {
  background-color: hsl(265, 79%, 40%);
  position: absolute;
  top: 1.4rem;
  left: -0.5rem;
  z-index: 2;
  padding-top: 2.4rem;
  transform-origin: 0 0;
  transform: rotateX(90deg);
  transition: all 0.5s ease;
}
#brand:hover #brand-list {
  transform: rotateX(0deg);
}
#brand-list > li {
  padding: 0.5rem 1rem;
}
#brand-list > li:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: gray;
}
#login > ul {
  height: 6rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
#login > ul > li > a {
  padding: 2rem 0;
}
#login > ul > li > a:hover {
  border-bottom: 3px solid white;
}
#hamburger {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}
.fa-bars {
  font-size: 2rem;
  cursor: pointer;
  display: none;
}
.cart {
  position: relative;
}
.item-num {
  width: 1.5rem;
  background-color: black;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  top: -1rem;
  left: 1rem;
}
.logout {
  color: white;
  font-size: 1.4rem;
  border: none;
  background-color: hsl(265, 79%, 40%);
  cursor: pointer;
}
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .fa-bars {
    display: block;
  }
  .mobile-links {
    font-size: 1.4rem;
    display: block;
    position: absolute;
    top: 6rem;
    z-index: 1;
    width: 100%;
    background-color: hsl(265, 79%, 40%);
    transform-origin: 0 0;
    transform: rotateX(90deg);
    transition: all 0.5s ease;
  }
  .mobile-links > li {
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
  .mobile-links > li > a:hover {
    border-bottom: 3px solid white;
  }
  #mobile-brand span {
    color: white;
    cursor: pointer;
  }
  #mobile-brand span:hover {
    border-bottom: 3px solid white;
  }
  #mobile-brand-list {
    height: 100%;
    background-color: hsl(265, 79%, 40%);
    position: absolute;
    left: 8rem;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    transform-origin: 0 0;
    transform: rotateY(90deg);
    transition: all 0.5s ease;
  }
  #mobile-brand:hover #mobile-brand-list {
    transform: rotateY(0deg);
  }
  #mobile-brand-list > li > a:hover {
    border-bottom: 3px solid white;
  }
  #mobile-login > ul > li {
    padding: 0 0.5rem 1rem 0;
  }
  #mobile-login > ul > li > a:hover {
    border-bottom: 3px solid white;
  }
  .dropdown {
    transform: rotateX(0deg);
  }
  nav {
    position: relative;
    z-index: 2;
  }
}
</style>