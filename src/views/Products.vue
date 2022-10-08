<template>
  <div v-if="products" id="container">
    <router-link :to="{ name: 'brand', params: { brand: brand } }"
      ><img :src="brandLogo" :alt="brand" id="brand-img"
    /></router-link>
    <div id="sort">
      <span>Sort by: </span>
      <select ref="sort" @change="handleSort">
        <option value="neutral"></option>
        <option value="alphabetical">Alphabetical</option>
        <option value="lowToHigh">Price: Low to high</option>
        <option value="highToLow">Price: High to low</option>
      </select>
    </div>
    <div id="products">
      <div v-for="(item, itemName) in sortedList" :key="itemName" class="item">
        <div class="img-container">
          <img :src="item.Images[0]" :alt="itemName" class="item-img" />
        </div>
        <router-link
          :to="{
            name: 'detail',
            params: { name: itemName, brand: brand, subbrand: subbrand },
          }"
          class="item-name"
          ><h3>{{ itemName }}</h3></router-link
        >
        <div v-if="item.DiscountedPrice" class="discount">
          <p class="item-price">{{ item.Price }}</p>
          <p class="item-discount">
            {{ item.DiscountedPrice }}
          </p>
        </div>
        <p v-else>
          {{ item.Price }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot } from "@firebase/firestore";
import { firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
export default {
  props: ["subbrand", "brand"],
  setup(props) {
    const products = ref(null);
    const brandLogo = ref(null);
    const sort = ref(null);
    const sortedList = ref(null);

    watchEffect(() => {
      window.scrollTo(0, 0);
    });

    onSnapshot(doc(firestore, "products", props.brand), (snap) => {
      for (let item in snap.data()) {
        if (item == props.subbrand) {
          products.value = snap.data()[item];
        }
      }
      sortedList.value = products.value;
      brandLogo.value = snap.data().Logo;
    });

    function handleSort() {
      if (sort.value.value == "alphabetical") {
        let tempArr = [];
        for (let item in products.value) {
          tempArr.push(item);
        }
        let sortedArr = tempArr.sort();
        let obj = {};
        for (let key of sortedArr) {
          for (let value in products.value) {
            if (key == value) {
              obj[key] = products.value[value];
            }
          }
        }
        sortedList.value = obj;
      } else if (sort.value.value == "lowToHigh") {
        let name = [],
          price = [];
        for (let a in products.value) {
          if (products.value[a].DiscountedPrice) {
            name.push(a);
            price.push(
              parseInt(products.value[a].DiscountedPrice.replace("$", ""))
            );
          } else {
            name.push(a);
            price.push(parseInt(products.value[a].Price.replace("$", "")));
          }
        }
        for (let b = 0; b < price.length; b++) {
          for (let c = 0; c < price.length; c++) {
            if (price[c] > price[c + 1]) {
              let d = price[c + 1];
              price[c + 1] = price[c];
              price[c] = d;

              let e = name[c + 1];
              name[c + 1] = name[c];
              name[c] = e;
            }
          }
        }
        let obj = {};
        for (let key of name) {
          for (let value in products.value) {
            if (key == value) {
              obj[key] = products.value[value];
            }
          }
        }
        sortedList.value = obj;
      } else if (sort.value.value == "highToLow") {
        let name = [],
          price = [];
        for (let a in products.value) {
          if (products.value[a].DiscountedPrice) {
            name.push(a);
            price.push(
              parseInt(products.value[a].DiscountedPrice.replace("$", ""))
            );
          } else {
            name.push(a);
            price.push(parseInt(products.value[a].Price.replace("$", "")));
          }
        }
        for (let b = 0; b < price.length; b++) {
          for (let c = 0; c < price.length; c++) {
            if (price[c] < price[c + 1]) {
              let d = price[c + 1];
              price[c + 1] = price[c];
              price[c] = d;

              let e = name[c + 1];
              name[c + 1] = name[c];
              name[c] = e;
            }
          }
        }
        let obj = {};
        for (let key of name) {
          for (let value in products.value) {
            if (key == value) {
              obj[key] = products.value[value];
            }
          }
        }
        sortedList.value = obj;
      } else {
        sortedList.value = products.value;
      }
    }

    return {
      products,
      brandLogo,
      sort,
      handleSort,
      sortedList,
    };
  },
};
</script>

<style scoped>
#container {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
#sort {
  align-self: flex-end;
}
#sort > select,
span {
  font-size: 1.2rem;
}
#container > a {
  width: 40%;
  height: 40%;
  margin: 0 auto;
}
#brand-img {
  width: 100%;
  height: 100%;
}
#products {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
.item {
  background-color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-bottom: 1rem;
}
.img-container {
  width: 100%;
  height: 100%;
}
.item-img {
  border-radius: 0.5rem 0.5rem 0 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.item-name {
  text-decoration: none;
  color: hsl(265, 79%, 40%);
  text-align: center;
  padding: 0 0.5rem;
}
.item-price {
  color: gray;
  text-decoration: line-through;
  font-size: 0.8rem;
}
.discount {
  text-align: center;
}
@media (max-width: 1000px) {
  #products {
    grid-template-columns: repeat(3, 1fr);
  }
  #container > a {
    width: 50%;
    height: 50%;
  }
}
@media (max-width: 768px) {
  #products {
    grid-template-columns: repeat(2, 1fr);
  }
  #container > a {
    width: 60%;
    height: 60%;
  }
}
@media (max-width: 500px) {
  #products {
    grid-template-columns: 1fr;
    margin: 2rem;
  }
  #container > a {
    width: 70%;
    height: 70%;
  }
}
</style>