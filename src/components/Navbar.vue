<template>
  <nav v-if="display">
    <img alt="page-logo" src="../assets/Gaming-on-the-go-logo.png" />
    <ul class="nav-links" v-if="username" :class="{ menu: isDropped }">
      <li><router-link to="/">Home</router-link></li>
      <li class="brands" @mouseenter="displayBrands">
        Brands
        <ul
          class="brand-list"
          :class="{ 'show-brand': brandDisplay }"
          @mouseleave="hideBrands"
        >
          <li v-for="brand in brandList" :key="brand">
            <router-link :to="{ name: 'brand', params: { brand: brand } }">{{
              brand
            }}</router-link>
          </li>
        </ul>
      </li>
      <li><router-link to="/about">About us</router-link></li>
      <li id="desktop-user">
        <router-link :to="{ name: 'profile', params: { nickname: username } }"
          ><i class="fa-solid fa-user"></i> {{ username }}
        </router-link>
      </li>
      <li><button id="logout" @click="handleLogout">Log out</button></li>
    </ul>
    <ul class="nav-links" v-else :class="{ menu: isDropped }">
      <li><router-link to="/">Home</router-link></li>
      <li class="brands" @mouseenter="displayBrands">
        Brands
        <ul
          class="brand-list"
          :class="{ 'show-brand': brandDisplay }"
          @mouseleave="hideBrands"
        >
          <li v-for="brand in brandList" :key="brand">
            <router-link :to="{ name: 'brand', params: { brand: brand } }">{{
              brand
            }}</router-link>
          </li>
        </ul>
      </li>
      <li><router-link to="/about">About us</router-link></li>
      <li><router-link to="/login">Log in</router-link></li>
      <li><router-link to="/signup">Sign up</router-link></li>
    </ul>
    <p id="mobile-user" v-if="username">
      <router-link :to="{ name: 'profile', params: { nickname: username } }"
        ><i class="fa-solid fa-user"></i> {{ username }}
      </router-link>
    </p>
    <span
      class="material-symbols-outlined logout"
      @click="handleLogout"
      v-if="username"
      >logout</span
    >
    <router-link class="cart" to="/cart"
      ><i class="fa-solid fa-cart-shopping"></i>
      <span class="item-num">{{ itemNum }}</span>
    </router-link>
    <i class="fa-solid fa-bars" @click="dropdownMenu"></i>
  </nav>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { collection, onSnapshot } from "@firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import { signOut } from "@firebase/auth";

export default {
  setup() {
    const display = ref(true);
    const store = useStore();
    const username = computed(() =>
      store.state.nickname ? store.state.nickname : ""
    );
    const brandList = ref(null);
    const brandDisplay = ref(false);
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

    function displayBrands() {
      brandDisplay.value = true;
    }

    function hideBrands() {
      brandDisplay.value = false;
    }

    function handleLogout() {
      window.localStorage.removeItem("username");
      signOut(auth);
      store.commit("updateUsername", "");
    }

    function dropdownMenu() {
      isDropped.value = !isDropped.value;
    }

    return {
      display,
      handleLogout,
      username,
      brandList,
      displayBrands,
      hideBrands,
      brandDisplay,
      dropdownMenu,
      isDropped,
      itemNum,
    };
  },
};
</script>

<style scoped>
nav {
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-around;
  background-color: hsl(265, 79%, 40%);
  align-items: center;
}
nav > img {
  height: 5rem;
}
.fa-bars {
  color: white;
  font-size: 2rem;
  display: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
}
.nav-links > li {
  list-style: none;
}
.nav-links li a {
  text-decoration: none;
  color: white;
}
.brands {
  color: white;
  position: relative;
}
.brands:hover {
  cursor: pointer;
}
.brand-list {
  position: absolute;
  top: 3rem;
  display: none;
  z-index: 2;
}
.brand-list > li {
  list-style: none;
  background-color: hsl(265, 79%, 40%);
  padding: 0 1rem 0.5rem;
}
.brand-list li a {
  text-decoration: none;
  color: white;
}
.brand-list li:hover {
  border-bottom: 2px solid white;
}
.fa-user {
  color: white;
}
#mobile-user {
  display: none;
  font-size: 1.2rem;
}
#mobile-user > a {
  text-decoration: none;
  color: white;
}
.cart {
  position: relative;
  color: white;
}
.item-num {
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  border: 2px solid black;
  background-color: black;
  border-radius: 50%;
  position: absolute;
  top: -1rem;
  left: 0.5rem;
}
.show-brand {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
#logout {
  font-size: 1.2rem;
  color: white;
  border: none;
  background-color: hsl(265, 79%, 40%);
  cursor: pointer;
}
.logout {
  display: none;
  color: white;
  cursor: pointer;
}
@media (max-width: 600px) {
  .fa-bars {
    display: block;
  }
  .fa-bars:hover {
    cursor: pointer;
  }
  nav {
    position: relative;
    z-index: 2;
  }
  .nav-links {
    width: 100%;
    padding: 2rem 0 0 1rem;
    position: absolute;
    top: -15rem;
    left: 0;
    background-color: hsl(265, 79%, 40%);
    flex-direction: column;
    align-items: flex-start;
    z-index: -1;
    transition: all 0.5s ease-in-out;
  }
  .brand-list {
    top: -3.2rem;
    left: 5rem;
  }
  .menu {
    transform: translateY(20rem);
  }
  #desktop-user {
    display: none;
  }
  #mobile-user {
    display: block;
  }
  #logout {
    display: none;
  }
  .logout {
    display: block;
  }
}
</style>