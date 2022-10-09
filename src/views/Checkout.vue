<template>
  <div id="success" v-if="isSucceeded">
    <h1>Your order has been placed</h1>
    <router-link to="/">Continue shopping</router-link>
  </div>
  <div id="container" v-else>
    <div id="order">
      <h1>Your order</h1>
      <div id="order-list">
        <div v-for="(item, itemName) in cart" :key="item" class="item">
          <h3>{{ itemName }}</h3>
          <p>Qty: {{ item.quantity }}</p>
          <p>{{ item.price }}</p>
        </div>
      </div>
      <h2>
        <span>Subtotal: </span><span>$ {{ subtotal }}</span>
      </h2>
      <p>Shipping fee: $10</p>
      <h2><span>Final total: </span>$ {{ subtotal + 10 }}</h2>
    </div>
    <form id="payment" @submit.prevent="placeOrder">
      <h2>Just to confirm:</h2>
      <div class="address">
        <label>Receiver's name:</label>
        <input type="text" ref="name" />
      </div>
      <div class="address">
        <label>Delivery address:</label>
        <input type="text" ref="address" />
      </div>
      <div class="phone" v-if="userPhone">
        <p>Phone number:</p>
        <div v-for="number in userPhone" :key="number" class="phone-num">
          <input type="checkbox" :value="number" @input="getPhone" />
          <label>{{ number }}</label>
        </div>
      </div>
      <div v-else class="phone">
        <div class="address">
          <label>Phone number:</label>
          <input type="number" ref="newPhone" @input="checkPhone" />
        </div>
        <p class="error">{{ phoneErr }}</p>
      </div>
      <div class="phone">
        <p>Payment method:</p>
        <div class="phone-num">
          <input
            type="radio"
            name="method"
            ref="payByCash"
            @input="hideCardInput"
          />
          <label>Cash on delivery</label>
        </div>
        <div class="phone-num">
          <input
            type="radio"
            name="method"
            ref="payByCard"
            @input="showCardInput"
          />
          <label>Card</label>
        </div>
      </div>
      <div id="card-num" v-show="displayCardInput">
        <input type="number" placeholder="Card number" ref="cardNum" />
        <input type="text" placeholder="Expiry date" ref="expDate" />
        <input type="password" placeholder="CVV" ref="cvv" />
      </div>
      <p class="error">{{ formErr }}</p>
      <button type="submit">Place order</button>
    </form>
  </div>
</template>

<script>
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const cart = JSON.parse(localStorage.getItem("cartItems"));
    const username = localStorage.getItem("username");
    let subtotal = 0;
    let userPhone = ref(null);
    let selectedPhone = [];
    const displayCardInput = ref(false);
    const phoneErr = ref(null);
    const name = ref(null);
    const address = ref(null);
    const newPhone = ref(null);
    const cardNum = ref(null);
    const expDate = ref(null);
    const cvv = ref(null);
    const formErr = ref(null);
    const payByCard = ref(null);
    const payByCash = ref(null);
    const isSucceeded = ref(false);
    let userId = "";

    const q = query(
      collection(firestore, "users"),
      where("username", "==", username)
    );

    getDocs(q).then((docs) => {
      docs.forEach((item) => {
        userId = item.id;
        if (item.data().tel) {
          userPhone.value = [...item.data().tel];
        }
      });
    });

    for (let item in cart) {
      subtotal +=
        parseInt(cart[item].price.replace("$", "")) *
        parseInt(cart[item].quantity);
    }

    function getPhone(e) {
      if (e.srcElement.checked) {
        selectedPhone.push(e.srcElement.value);
      } else {
        selectedPhone = selectedPhone.filter((x) => x != e.srcElement.value);
      }
    }

    function showCardInput() {
      displayCardInput.value = true;
    }

    function hideCardInput() {
      displayCardInput.value = false;
    }

    function checkPhone(e) {
      if (
        /\d{10}/.test(e.srcElement.value) &&
        e.srcElement.value.length == 10
      ) {
        phoneErr.value = null;
      } else {
        phoneErr.value = "Phone number must be 10 digit long";
      }
    }

    function placeOrder(e) {
      if (e.submitter.disabled == false) {
        formErr.value = null;
        e.submitter.disabled = true;
        e.submitter.style.opacity = "0.5";
        e.submitter.style.cursor = "not-allowed";
        if (name.value.value && address.value.value) {
          if (newPhone.value) {
            if (newPhone.value.value) {
              if (payByCard.value.checked) {
                if (
                  cardNum.value.value &&
                  expDate.value.value &&
                  cvv.value.value
                ) {
                  addDoc(collection(firestore, "orders"), {
                    username: username,
                    receiverName: name.value.value,
                    deliveryAddress: address.value.value,
                    contact: newPhone.value.value,
                    order: cart,
                    paymentMethod: "Card",
                  });
                  updateDoc(doc(firestore, "users", userId), {
                    tel: [newPhone.value.value],
                  });
                } else {
                  formErr.value = "Please fullfill your card info";
                  e.submitter.disabled = false;
                  e.submitter.removeAttribute("style");
                }
              } else if (payByCash.value.checked) {
                addDoc(collection(firestore, "orders"), {
                  username: username,
                  receiverName: name.value.value,
                  deliveryAddress: address.value.value,
                  contact: newPhone.value.value,
                  order: cart,
                  paymentMethod: "Cash",
                });
                updateDoc(doc(firestore, "users", userId), {
                  tel: [newPhone.value.value],
                });
              } else {
                formErr.value = "Please choose your payment method";
                e.submitter.disabled = false;
                e.submitter.removeAttribute("style");
              }
            } else {
              formErr.value = "Please add your phone number";
              e.submitter.disabled = false;
              e.submitter.removeAttribute("style");
            }
          } else {
            if (selectedPhone.length == 0) {
              formErr.value = "Please choose your phone number";
              e.submitter.disabled = false;
              e.submitter.removeAttribute("style");
            } else {
              if (payByCard.value.checked) {
                if (
                  cardNum.value.value &&
                  expDate.value.value &&
                  cvv.value.value
                ) {
                  addDoc(collection(firestore, "orders"), {
                    username: username,
                    receiverName: name.value.value,
                    deliveryAddress: address.value.value,
                    contact: selectedPhone,
                    order: cart,
                    paymentMethod: "Card",
                  });
                } else {
                  formErr.value = "Please fullfill your card info";
                  e.submitter.disabled = false;
                  e.submitter.removeAttribute("style");
                }
              } else if (payByCash.value.checked) {
                addDoc(collection(firestore, "orders"), {
                  username: username,
                  receiverName: name.value.value,
                  deliveryAddress: address.value.value,
                  contact: selectedPhone,
                  order: cart,
                  paymentMethod: "Cash",
                });
              } else {
                formErr.value = "Please choose your payment method";
                e.submitter.disabled = false;
                e.submitter.removeAttribute("style");
              }
            }
          }
          store.commit("updateCartSum", 0);
          localStorage.removeItem("cartSum");
          localStorage.removeItem("cartItems");
          isSucceeded.value = true;
        } else {
          formErr.value = "Please fullfill your info";
          e.submitter.disabled = false;
          e.submitter.removeAttribute("style");
        }
      }
    }

    return {
      cart,
      subtotal,
      userPhone,
      getPhone,
      showCardInput,
      hideCardInput,
      displayCardInput,
      phoneErr,
      name,
      address,
      newPhone,
      checkPhone,
      placeOrder,
      cardNum,
      expDate,
      cvv,
      formErr,
      payByCard,
      payByCash,
      isSucceeded,
    };
  },
};
</script>

<style scoped>
#container {
  margin: 2rem 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
#order {
  justify-self: right;
  padding: 0 1rem 1rem 0;
  border-right: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}
#order > h1,
#payment > h2 {
  text-align: center;
  width: 100%;
}
#order > h2 {
  display: flex;
  gap: 1rem;
  align-items: center;
}
#order-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}
.item {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}
#payment {
  width: 100%;
  justify-self: left;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.3rem;
}
.address {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.phone {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.phone > p,
.address > label {
  text-decoration: underline;
}
#payment input {
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
}
#payment input:focus {
  outline: none;
}
.phone-num {
  display: flex;
  gap: 1rem;
  align-items: center;
}
#card-num {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
button[type="submit"] {
  width: 10rem;
  font-size: 1.3rem;
  padding: 1rem;
  border: none;
  background-color: hsl(265, 79%, 40%);
  color: white;
  cursor: pointer;
  align-self: center;
}
.error {
  text-align: center;
  color: red;
}
#success {
  text-align: center;
  margin: 40vh auto;
}
#success > a {
  text-decoration: none;
  color: black;
}
#success > a:hover {
  color: hsl(265, 79%, 40%);
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
@media (max-width: 640px) {
  #container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  #order {
    border-right: none;
    border-bottom: 1px solid black;
  }
}
</style>