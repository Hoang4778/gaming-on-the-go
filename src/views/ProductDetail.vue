<template>
  <div id="container" v-if="product">
    <div id="showcase">
      <div id="slide">
        <div id="img-container">
          <img :src="currentImg" :alt="name" />
        </div>
        <div id="images">
          <div id="slider" ref="slider">
            <img
              v-for="img in product.Images"
              :key="img"
              :src="img"
              :alt="name"
              @click="changeImg"
              ref="image"
              :style="{ transform: isTranslated }"
            />
          </div>
          <i class="fa-solid fa-greater-than" @click="forwardSlide"></i>
          <i class="fa-solid fa-less-than" @click="backwardSlide"></i>
        </div>
      </div>
      <div id="price">
        <h1>{{ name }}</h1>
        <div v-if="product.DiscountedPrice">
          <p id="discount">{{ product.Price }}</p>
          <h2>{{ product.DiscountedPrice }}</h2>
        </div>
        <h2 v-else>{{ product.Price }}</h2>
        <div id="quantity">
          <button id="decrease" @click="decreaseQty">-</button>
          <input type="number" ref="qty" value="1" />
          <button id="increase" @click="increaseQty">+</button>
        </div>
        <button @click="addToCart">Add to cart</button>
      </div>
    </div>
    <div>
      <h1 id="specs-title">Specs:</h1>
      <table id="specs">
        <tr v-for="(detail, specName) in product.Specs" :key="specName">
          <td class="col1">{{ specName }}</td>
          <td class="col2">{{ detail }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { doc, onSnapshot } from "@firebase/firestore";
import { firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import { watch, watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: ["name", "brand", "subbrand"],
  setup(props) {
    const product = ref(null);
    const currentImg = ref("");
    const isTranslated = ref("");
    const image = ref(null);
    const slider = ref(null);
    const qty = ref(null);
    const store = useStore();
    let style = null;
    let slideLength = 0;
    let textSize = 0;
    let step = 0;
    let stepNum = 0;
    let exactStep = 0;
    let count = 0;

    watchEffect(() => {
      window.scrollTo(0, 0);
    });

    onSnapshot(doc(firestore, "products", props.brand), (snap) => {
      for (let item in snap.data()) {
        if (item == props.subbrand) {
          for (let subitem in snap.data()[item]) {
            if (subitem == props.name) {
              product.value = snap.data()[item][subitem];
            }
          }
        }
      }
      currentImg.value = product.value.Images[0];
    });

    function changeImg(e) {
      currentImg.value = e.srcElement.attributes.src.value;
    }

    watch(image, () => {
      style = window.getComputedStyle(slider.value);
      textSize = parseInt(style.fontSize.replace("px", ""));
      slideLength =
        image.value.length * 5 * textSize + (image.value.length - 1) * textSize;
      step = slider.value.offsetWidth;
      exactStep = parseFloat((slideLength / step - 1).toFixed(2));
      stepNum = Math.ceil(slideLength / step - 1);
    });

    function forwardSlide() {
      if (count == stepNum - 1) {
        count = exactStep;
      } else if (count == exactStep) {
        count = 0;
      } else {
        count++;
      }
      isTranslated.value = `translateX(-${count * step}px)`;
    }

    function backwardSlide() {
      if (count == 0) {
        count = exactStep;
      } else if (count == exactStep % 1) {
        count = 0;
      } else {
        count--;
      }
      isTranslated.value = `translateX(-${count * step}px)`;
    }

    function decreaseQty() {
      if (qty.value.value > 1) {
        qty.value.value--;
      }
    }

    function increaseQty() {
      qty.value.value++;
    }

    function addToCart() {
      let cartDetail = JSON.parse(localStorage.getItem("cartItems"));
      let preCartSum = parseInt(localStorage.getItem("cartSum"));
      if (cartDetail && preCartSum) {
        if (cartDetail[props.name]) {
          cartDetail[props.name].quantity =
            parseInt(cartDetail[props.name].quantity) +
            parseInt(qty.value.value);
          localStorage.setItem("cartItems", JSON.stringify(cartDetail));
          localStorage.setItem(
            "cartSum",
            preCartSum + parseInt(qty.value.value)
          );
        } else {
          cartDetail[props.name] = {
            image: currentImg.value,
            quantity: qty.value.value,
            price: product.value.DiscountedPrice
              ? product.value.DiscountedPrice
              : product.value.Price,
          };
          localStorage.setItem("cartItems", JSON.stringify(cartDetail));
          localStorage.setItem(
            "cartSum",
            preCartSum + parseInt(qty.value.value)
          );
        }
      } else {
        cartDetail = {
          [props.name]: {
            image: currentImg.value,
            quantity: qty.value.value,
            price: product.value.DiscountedPrice
              ? product.value.DiscountedPrice
              : product.value.Price,
          },
        };
        localStorage.setItem("cartItems", JSON.stringify(cartDetail));
        localStorage.setItem("cartSum", qty.value.value);
      }
      store.commit("updateCartSum", localStorage.getItem("cartSum"));
    }

    return {
      product,
      currentImg,
      changeImg,
      forwardSlide,
      backwardSlide,
      isTranslated,
      image,
      slider,
      decreaseQty,
      increaseQty,
      qty,
      addToCart,
    };
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem;
}
#showcase {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
#slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
#img-container {
  width: 20rem;
  height: 20rem;
}
#img-container > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
#images {
  position: relative;
}
.fa-solid {
  position: absolute;
}
.fa-solid:hover {
  cursor: pointer;
}
.fa-greater-than {
  top: 40%;
  right: -2rem;
}
.fa-less-than {
  top: 40%;
  left: -2rem;
}
#slider {
  display: flex;
  gap: 1rem;
  width: 17rem;
  overflow: hidden;
}
#slider > img {
  width: 5rem;
  transition: all 0.5s ease;
}
#slider > img:hover {
  cursor: pointer;
}
#price {
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
#price > button {
  width: 50%;
  height: 4rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  border: none;
  font-size: 1.5rem;
}
#price > button:hover {
  cursor: pointer;
}
#price > button:active {
  background-color: white;
  color: hsl(265, 79%, 40%);
  border: 2px solid hsl(265, 79%, 40%);
}
#discount {
  color: gray;
  text-decoration: line-through;
}
#quantity > input,
#decrease,
#increase {
  font-size: 1.2rem;
}
#decrease,
#increase {
  width: 2rem;
  padding: 0.5rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  cursor: pointer;
  border: none;
}
#quantity > input::-webkit-outer-spin-button,
#quantity > input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
#quantity > input {
  width: 5rem;
  height: 2.5rem;
  border: none;
  -moz-appearance: textfield;
  text-align: center;
}
#specs-title {
  margin-bottom: 1rem;
}
#specs {
  border: 1px solid black;
  border-collapse: collapse;
}
.col1 {
  text-align: right;
  padding: 1rem;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  background-color: hsl(265, 79%, 40%);
  color: white;
}
.col2 {
  padding: 1rem;
  border-bottom: 1px solid black;
  background-color: white;
}
@media (max-width: 768px) {
  #showcase {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  #slide > img {
    width: 50vw;
    height: 40vw;
  }
  #price {
    align-items: center;
    text-align: center;
  }
}
</style>