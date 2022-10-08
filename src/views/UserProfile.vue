<template>
  <div id="container" v-if="userInfo">
    <div id="avatar">
      <img :src="userInfo.avatar" :alt="nickname" @error="altImg" />
      <span class="material-symbols-outlined avatar-edit edit-icon">edit</span>
    </div>
    <div id="info">
      <p class="title">Username:</p>
      <p>{{ userInfo.username }}</p>
      <p class="title">Email:</p>
      <p>{{ userInfo.email }}</p>
      <p class="title">Password:</p>
      <p class="info">
        <span>{{ userInfo.password }}</span
        ><span class="material-symbols-outlined edit-icon" @click="edit"
          >edit</span
        >
        <span class="material-symbols-outlined success"> check_circle </span>
      </p>
      <div class="hide edit">
        <div class="input">
          <input type="password" ref="newPassword" @input="checkPassword" />
          <span class="material-symbols-outlined close-icon" @click="cancelEdit"
            >close</span
          >
          <span
            class="material-symbols-outlined done-icon"
            @click="savePassword"
            >done</span
          >
        </div>
        <ul id="password-req">
          Password must contain:
          <li class="check" :class="{ 'check-password': passwordCheck1 }">
            <span class="material-symbols-outlined"> check_circle </span>
            <span>at least 6 characters</span>
          </li>
          <li class="check" :class="{ 'check-password': passwordCheck2 }">
            <span class="material-symbols-outlined"> check_circle </span>
            <span>at least 1 capital letter</span>
          </li>
        </ul>
        <p v-if="passwordErr" class="error">{{ passwordErr }}</p>
      </div>
      <p class="title">Phone number:</p>
      <div class="info">
        <p v-if="userInfo.phoneNumber" id="phone">
          <span
            v-for="number in userInfo.phoneNumber"
            :key="number"
            class="number"
            >{{ number }}</span
          >
        </p>
        <span v-else>N/A</span>
        <span
          v-if="userInfo.phoneNumber"
          class="material-symbols-outlined edit-icon"
          @click="edit"
          >edit</span
        >
        <span
          class="material-symbols-outlined add-icon"
          v-if="userInfo.phoneNumber"
          @click="addNum"
          >add</span
        >
        <span class="material-symbols-outlined add-icon" v-else @click="edit"
          >add</span
        >
        <span class="material-symbols-outlined success"> check_circle </span>
      </div>
      <div class="hide edit">
        <div v-if="userInfo.phoneNumber" id="input-phone">
          <div
            v-for="number in userInfo.phoneNumber"
            :key="number"
            class="phone-input"
          >
            <input type="text" :value="number" @focus="numLookup" />
            <span
              class="material-symbols-outlined delete-icon"
              @click="removePhone"
              >delete</span
            >
            <span class="material-symbols-outlined done-icon" @click="updateNum"
              >done</span
            >
            <span class="material-symbols-outlined success">
              check_circle
            </span>
          </div>
        </div>
        <div class="input" v-else>
          <input type="text" ref="newPhone" @input="checkPhone" />
          <span class="material-symbols-outlined close-icon" @click="cancelEdit"
            >close</span
          >
          <span class="material-symbols-outlined done-icon" @click="savePhone"
            >done</span
          >
        </div>
        <div class="input add-more">
          <input type="text" ref="morePhone" @input="checkMorePhone" />
          <span class="material-symbols-outlined close-icon" @click="cancelEdit"
            >close</span
          >
          <span class="material-symbols-outlined done-icon" @click="savePhone"
            >done</span
          >
        </div>
        <p v-if="phoneErr" id="phone-err">
          <span class="material-symbols-outlined"> check_circle </span>
          <span>{{ phoneErr }}</span>
        </p>
      </div>
      <p class="title">Delivery address:</p>
      <p class="info">
        <span>N/A</span><span class="material-symbols-outlined">edit</span>
      </p>
    </div>
  </div>
</template>

<script>
import { auth, firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { updatePassword } from "@firebase/auth";
export default {
  props: ["nickname"],
  setup(props) {
    const userInfo = ref(null);
    const newPassword = ref(null);
    const passwordCheck1 = ref(false);
    const passwordRegex1 = /.{6,}/;
    const passwordCheck2 = ref(false);
    const passwordRegex2 = /[A-Z]+/;
    const passwordErr = ref(null);
    const newPhone = ref(null);
    const phoneErr = ref(null);
    const morePhone = ref(null);
    let userId = "";
    let userData = null;
    let password = "";
    let phoneNum = null;
    let currentNum = "";

    const q = query(
      collection(firestore, "users"),
      where("username", "==", props.nickname)
    );

    getDocs(q).then((docs) => {
      docs.forEach((item) => {
        userId = item.id;
        userData = item.data();
        password = userData.password
          .split("")
          .map((x) => x.replace(/./, "*"))
          .join("");
        if (userData.tel) {
          phoneNum = [...userData.tel];
        }
        userInfo.value = {
          avatar: userData.avatar ? userData.avatar : "",
          username: userData.username,
          email: userData.email,
          password: password,
          phoneNumber: phoneNum ? phoneNum : "",
          deliveryAddress: userData.deliveryAddress
            ? userData.deliveryAddress
            : "",
        };
      });
    });

    function altImg(e) {
      e.srcElement.src =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }

    function edit(e) {
      e.path[1].style.display = "none";
      e.path[1].nextSibling.style.display = "block";
    }

    function cancelEdit(e) {
      e.path[2].removeAttribute("style");
      e.path[2].previousSibling.removeAttribute("style");
    }

    function checkPassword() {
      passwordCheck1.value = passwordRegex1.test(newPassword.value.value);
      passwordCheck2.value = passwordRegex2.test(newPassword.value.value);
    }

    function savePassword(e) {
      if (newPassword.value.disabled == false) {
        passwordErr.value = null;
        let user = auth.currentUser;
        newPassword.value.disabled = true;
        e.srcElement.style.opacity = "0.5";
        e.srcElement.style.cursor = "not-allowed";

        updatePassword(user, newPassword.value.value)
          .then(() => {
            updateDoc(doc(firestore, "users", userId), {
              password: newPassword.value.value,
            }).then(() => {
              userInfo.value.password = newPassword.value.value
                .split("")
                .map((x) => x.replace(/./, "*"))
                .join("");
              e.path[2].removeAttribute("style");
              e.path[2].previousSibling.removeAttribute("style");
              e.path[2].previousSibling.lastChild.style.opacity = "1";
              setTimeout(() => {
                e.path[2].previousSibling.lastChild.removeAttribute("style");
              }, 3000);
            });
          })
          .catch((error) => {
            passwordErr.value = error.message;
            newPassword.value.disabled = false;
            e.srcElement.removeAttribute("style");
          });
      }
    }

    function checkPhone() {
      if (
        /\d{10}/.test(newPhone.value.value) &&
        newPhone.value.value.length == 10
      ) {
        phoneErr.value = null;
      } else {
        phoneErr.value = "Phone number must be 10 digit long";
      }
    }
    function checkMorePhone() {
      if (
        /\d{10}/.test(morePhone.value.value) &&
        morePhone.value.value.length == 10
      ) {
        phoneErr.value = null;
      } else {
        phoneErr.value = "Phone number must be 10 digit long";
      }
    }

    function savePhone(e) {
      if (e.srcElement.style.opacity == "") {
        phoneErr.value = null;
        e.srcElement.style.opacity = "0.5";
        e.srcElement.style.cursor = "not-allowed";
        e.path[1].childNodes[0].disabled = true;
        if (userInfo.value.phoneNumber) {
          updateDoc(doc(firestore, "users", userId), {
            tel: arrayUnion(morePhone.value.value),
          }).then(() => {
            phoneNum.push(morePhone.value.value);
            userInfo.value.phoneNumber = [...phoneNum];
            e.path[2].removeAttribute("style");
            e.path[3].childNodes[8].removeAttribute("style");
            e.path[3].childNodes[8].lastChild.style.opacity = "1";
            setTimeout(() => {
              e.path[3].childNodes[8].lastChild.removeAttribute("style");
            }, 3000);
          });
        } else {
          updateDoc(doc(firestore, "users", userId), {
            tel: [newPhone.value.value],
          }).then(() => {
            phoneNum.push(newPhone.value.value);
            userInfo.value.phoneNumber = [...phoneNum];
            e.path[2].removeAttribute("style");
            e.path[3].childNodes[8].removeAttribute("style");
            e.path[3].childNodes[8].lastChild.style.opacity = "1";
            setTimeout(() => {
              e.path[3].childNodes[8].lastChild.removeAttribute("style");
            }, 3000);
          });
        }
      }
    }

    function addNum(e) {
      e.path[1].style.display = "none";
      e.path[1].nextSibling.style.display = "block";
      e.path[1].nextSibling.firstChild.style.display = "none";
      e.path[1].nextSibling.lastElementChild.classList.remove("add-more");
      morePhone.value.value = "";
      phoneErr.value = null;
    }

    function removePhone(e) {
      let removedNum = e.srcElement.previousSibling.value;
      updateDoc(doc(firestore, "users", userId), {
        tel: arrayRemove(removedNum),
      }).then(() => {
        if (phoneNum.length > 1) {
          phoneNum = phoneNum.filter((x) => x != removedNum);
          userInfo.value.phoneNumber = [...phoneNum];
        } else {
          phoneNum = phoneNum.filter((x) => x != removedNum);
          userInfo.value.phoneNumber = "";
          e.path[3].removeAttribute("style");
          e.path[3].previousSibling.removeAttribute("style");
        }
      });
    }

    function numLookup(e) {
      currentNum = e.srcElement.value;
    }

    function updateNum(e) {
      let latestNum = e.path[1].firstElementChild.value;
      if (latestNum.length == 10 && /\d{10}/.test(latestNum)) {
        if (currentNum != "" && latestNum != currentNum) {
        }
      } else {
        phoneErr.value = "Phone number must be 10 digit long";
      }
    }

    return {
      userInfo,
      altImg,
      newPassword,
      edit,
      cancelEdit,
      newPassword,
      savePassword,
      passwordCheck1,
      passwordCheck2,
      checkPassword,
      passwordErr,
      newPhone,
      phoneErr,
      savePhone,
      checkPhone,
      addNum,
      morePhone,
      checkMorePhone,
      removePhone,
      numLookup,
      updateNum,
    };
  },
};
</script>

<style scoped>
#container {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
#avatar {
  margin: 0 auto;
  width: 10rem;
  position: relative;
}
#avatar > img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-edit {
  position: absolute;
  right: -2rem;
  bottom: 0;
  cursor: pointer;
}
#info {
  max-width: 80%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: center;
  font-size: 1.4rem;
}
.title {
  font-size: 1.4rem;
}
.info {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.edit-icon,
.done-icon,
.add-icon,
.delete-icon,
.close-icon {
  font-size: 1.8rem;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0);
  transition: all 0.2s ease-in-out;
}
.edit-icon:hover,
.done-icon:hover,
.add-icon:hover,
.delete-icon:hover,
.close-icon:hover {
  border: 2px solid hsl(265, 79%, 40%);
  border-radius: 0.5rem;
}
.input {
  display: flex;
  gap: 1rem;
  align-items: center;
}
input {
  font-size: 1.3rem;
  width: 10rem;
  border: none;
  padding: 0.5rem;
}
input:focus {
  outline: none;
}
.edit {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
}
.hide {
  display: none;
}
.check-password {
  color: green;
}
#password-req {
  line-height: 1.5rem;
  font-size: 1rem;
}
.check {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  list-style: none;
}
.success {
  color: green;
  font-size: 1.3rem;
  opacity: 0;
  transition: all 0.4s ease-in-out;
}
#phone {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}
.number {
  border: 2px solid hsl(265, 79%, 40%);
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
}
#input-phone {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.phone-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.error {
  color: red;
}
#phone-err {
  font-size: 1rem;
  margin-top: 1rem;
  color: red;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.add-more {
  display: none;
}
</style>