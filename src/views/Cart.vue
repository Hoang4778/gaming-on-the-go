<template>
  <h1>Your cart</h1>
  <div v-if="items">
    <div id="clear">
      <button @click="clearItems">Clear</button>
      <button @click="clearAll">Clear all</button>
    </div>
    <div id="items">
      <div v-for="(item, itemName) in items" :key="itemName" class="item">
        <input
          type="checkbox"
          ref="checkboxes"
          @click="handleCheck"
          :name="itemName"
        />
        <img :src="item.image" alt="product-image" />
        <p class="name">{{ itemName }}</p>
        <div id="quantity">
          <button id="decrease" @click="decreaseQty">-</button>
          <input type="number" :value="item.quantity" ref="qty" />
          <button id="increase" @click="increaseQty">+</button>
        </div>
        <p class="price">{{ item.price }}</p>
        <span class="material-symbols-outlined delete" @click="deleteItem"
          >delete</span
        >
      </div>
    </div>
    <div id="checkout">
      <h2>
        <strong>Total amount:</strong><span>{{ totalAmount }}</span>
      </h2>
      <h2>
        <strong>Subtotal:</strong><span>${{ subtotal }}</span>
      </h2>
      <button @click="checkout">Checkout</button>
    </div>
  </div>
  <div v-else id="empty">
    <h2>...is empty!</h2>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const items = ref(null);
    const totalAmount = ref(0);
    const checkboxes = ref(null);
    const subtotal = ref(0);
    const qty = ref(0);
    const store = useStore();
    const router = useRouter();

    items.value = JSON.parse(localStorage.getItem("cartItems"));
    totalAmount.value = parseInt(localStorage.getItem("cartSum"));

    for (let item in items.value) {
      subtotal.value +=
        parseInt(items.value[item].price.replace("$", "")) *
        parseInt(items.value[item].quantity);
    }

    function clearAll() {
      const confirm = window.confirm(
        "Are you sure about clearing all in your cart?"
      );
      if (confirm) {
        items.value = null;
        localStorage.removeItem("cartSum");
        localStorage.removeItem("cartItems");
        store.commit("updateCartSum", 0);
      }
    }

    function handleCheck(e) {
      if (e.srcElement.checked) {
        e.path[1].classList.add("check");
      } else {
        e.path[1].classList.remove("check");
      }
    }

    function clearItems(e) {
      let tempArr = [];
      let totalItem = 0;
      let totalPrice = 0;
      let itemGroup = e.path[2].childNodes[1].children;
      for (let item of itemGroup) {
        if (item.childNodes[0].checked) {
          let itemName = item.childNodes[2].textContent;
          let itemNum = parseInt(item.childNodes[3].childNodes[1].value);
          let itemPrice = parseInt(
            item.childNodes[4].textContent.replace("$", "")
          );
          tempArr.push([itemName]);
          totalItem = totalItem + itemNum;
          totalPrice = totalPrice + itemPrice * itemNum;
        }
      }
      tempArr.forEach((name) => delete items.value[name]);
      store.commit("updateCartSum", totalAmount.value - totalItem);
      totalAmount.value -= totalItem;
      subtotal.value -= totalPrice;
      if (totalAmount.value == 0 && Object.keys(items.value).length == 0) {
        localStorage.removeItem("cartSum");
        localStorage.removeItem("cartItems");
        items.value = null;
      } else {
        localStorage.setItem("cartSum", totalAmount.value);
        localStorage.setItem("cartItems", JSON.stringify(items.value));
      }
    }

    function increaseQty(e) {
      store.commit("updateCartSum", totalAmount.value + 1);
      localStorage.setItem("cartSum", totalAmount.value + 1);
      items.value[e.path[1].previousSibling.textContent].quantity =
        parseInt(items.value[e.path[1].previousSibling.textContent].quantity) +
        1;
      localStorage.setItem("cartItems", JSON.stringify(items.value));
      totalAmount.value += 1;
      subtotal.value += parseInt(
        e.path[2].childNodes[4].textContent.replace("$", "")
      );
    }

    function decreaseQty(e) {
      if (e.path[1].childNodes[1].value > 1) {
        store.commit("updateCartSum", totalAmount.value - 1);
        localStorage.setItem("cartSum", totalAmount.value - 1);
        items.value[e.path[1].previousSibling.textContent].quantity =
          parseInt(
            items.value[e.path[1].previousSibling.textContent].quantity
          ) - 1;
        localStorage.setItem("cartItems", JSON.stringify(items.value));
        totalAmount.value -= 1;
        subtotal.value -= parseInt(
          e.path[2].childNodes[4].textContent.replace("$", "")
        );
      }
    }

    function deleteItem(e) {
      let itemName = e.path[1].childNodes[2].textContent;
      let itemNum = e.path[1].childNodes[3].childNodes[1].value;
      let itemPrice = parseInt(
        e.path[1].childNodes[4].textContent.replace("$", "")
      );
      delete items.value[itemName];
      store.commit("updateCartSum", totalAmount.value - itemNum);
      totalAmount.value -= itemNum;
      subtotal.value -= itemPrice * itemNum;
      if (totalAmount.value == 0 && Object.keys(items.value).length == 0) {
        localStorage.removeItem("cartSum");
        localStorage.removeItem("cartItems");
        items.value = null;
      } else {
        localStorage.setItem("cartSum", totalAmount.value);
        localStorage.setItem("cartItems", JSON.stringify(items.value));
      }
    }

    function checkout() {
      if (store.state.nickname) {
        router.push("/checkout");
      } else {
        router.push("/login");
      }
    }

    return {
      items,
      totalAmount,
      subtotal,
      clearAll,
      handleCheck,
      clearItems,
      checkboxes,
      increaseQty,
      decreaseQty,
      qty,
      deleteItem,
      checkout,
    };
  },
};
</script>

<style scoped>
h1 {
  margin: 1rem 0;
  text-align: center;
}
#clear {
  margin: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
#clear > button {
  background-color: hsl(265, 79%, 40%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.1rem;
}
#items {
  margin: 0 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.item {
  height: 7rem;
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  border: none;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item > input[type="checkbox"] {
  cursor: pointer;
}
.item > img {
  width: 6.5rem;
  justify-self: flex-start;
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
#quantity {
  display: flex;
}
#quantity > input::-webkit-outer-spin-button,
#quantity > input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
#quantity > input {
  width: 3rem;
  height: 2.5rem;
  border: none;
  -moz-appearance: textfield;
  text-align: center;
}
.name {
  width: 30%;
  justify-self: flex-start;
}
.price {
  width: 10%;
  justify-self: flex-end;
}
.check {
  border: 2px solid hsl(265, 79%, 40%);
}
#checkout {
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}
#checkout > h2 {
  display: flex;
  gap: 2rem;
}
#checkout > button {
  background-color: hsl(265, 79%, 40%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.1rem;
}
.delete {
  cursor: pointer;
}
strong {
  text-decoration: underline;
}
#empty {
  padding: 40vh 0;
  text-align: center;
}
@media (max-width: 640px) {
  #items {
    margin: 0 0 1rem;
  }
  .item {
    padding: 0 0.5rem;
  }
  #quantity {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }
}
</style>