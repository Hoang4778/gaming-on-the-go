<template>
  <div v-if="isReset" id="reset">
    <h1>Your password has been reset!</h1>
    <h3>
      Back to where we were in <span>{{ counter }}</span>
    </h3>
  </div>
  <div id="container" v-else>
    <h1>Reset password</h1>
    <form @submit.prevent="resetPassword">
      <input
        type="password"
        placeholder="New password"
        id="new-password"
        ref="newPass"
        @input="passwordCheck"
      />
      <ul id="password-req">
        Password must contain:
        <li :class="{ 'password-check-1': passwordCheck1 }">
          <span class="material-symbols-outlined"> check_circle </span>
          <span>at least 6 characters</span>
        </li>
        <li :class="{ 'password-check-2': passwordCheck2 }">
          <span class="material-symbols-outlined"> check_circle </span>
          <span>at least 1 capital letter</span>
        </li>
      </ul>
      <div id="confirm-password">
        <input
          type="password"
          placeholder="Confirm password"
          ref="confirmPass"
          @input="passwordConfirm"
        />
        <span
          class="material-symbols-outlined confirm-icon"
          :class="{ confirm: isConfirmed }"
        >
          check_circle
        </span>
      </div>
      <button type="submit" ref="submit">Change password</button>
    </form>
    <h3 v-if="err" id="error">{{ err }}</h3>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { auth, firestore } from "@/firebase/config";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { signInWithEmailAndPassword, updatePassword } from "@firebase/auth";
import router from "@/router";
export default {
  setup() {
    const isReset = ref(false);
    const counter = ref(3);
    const newPass = ref(null);
    const passwordCheck1 = ref(false);
    const passwordCheck2 = ref(false);
    const passwordRegex1 = /.{6,}/;
    const passwordRegex2 = /[A-Z]+/;
    const isConfirmed = ref(false);
    const confirmPass = ref(null);
    const err = ref(null);
    const submit = ref(null);

    function passwordCheck() {
      passwordCheck1.value = passwordRegex1.test(newPass.value.value);
      passwordCheck2.value = passwordRegex2.test(newPass.value.value);
    }

    function passwordConfirm() {
      if (confirmPass.value.value == newPass.value.value) {
        isConfirmed.value = true;
      } else {
        isConfirmed.value = false;
      }
    }

    async function resetPassword() {
      if (submit.value.disabled == false) {
        err.value = null;
        if (!newPass.value.value) {
          err.value = "Please type in your password";
        } else if (!confirmPass.value.value) {
          err.value = "Please confirm your password";
        } else {
          submit.value.disabled = true;
          submit.value.textContent = "Changing password...";
          submit.value.style.opacity = "0.5";
          submit.value.style.cursor = "not-allowed";
          let pass = newPass.value.value;
          let email = localStorage.getItem("verifiedEmail");
          let currentPass = "";
          let id = "";
          const q = query(
            collection(firestore, "users"),
            where("email", "==", email)
          );
          const docs = await getDocs(q);
          docs.forEach((item) => {
            id = item.id;
            currentPass = item.data().password;
            signInWithEmailAndPassword(auth, email, currentPass)
              .then(() => {
                let user = auth.currentUser;
                updatePassword(user, pass)
                  .then(async () => {
                    await updateDoc(doc(firestore, "users", id), {
                      password: pass,
                    });
                    localStorage.removeItem("verifiedEmail");
                  })
                  .catch((error) => {
                    err.value = error.message;
                    submit.value.disabled = false;
                    submit.value.textContent = "Change password";
                    submit.value.removeAttribute("style");
                  });
              })
              .catch((error) => {
                err.value = error.message;
                submit.value.disabled = false;
                submit.value.textContent = "Change password";
                submit.value.removeAttribute("style");
              });
          });
          isReset.value = true;
          setInterval(() => {
            counter.value--;
            if (counter.value == 0) {
              router.back();
            }
          }, 1000);
        }
      }
    }

    return {
      isReset,
      counter,
      newPass,
      passwordCheck1,
      passwordCheck2,
      passwordCheck,
      resetPassword,
      passwordConfirm,
      confirmPass,
      err,
      isConfirmed,
      submit,
    };
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
form {
  width: 22rem;
  border: 2px solid hsl(265, 79%, 40%);
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: stretch;
  gap: 1rem;
}
input {
  width: 100%;
  font-size: 1.2rem;
  padding: 0.5rem;
  border: none;
}
input:focus {
  outline: none;
}
#password-req {
  line-height: 1.5rem;
}
#password-req > li {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.password-check-1,
.password-check-2 {
  color: green;
}
button {
  font-size: 1.2rem;
  padding: 1rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  cursor: pointer;
  border: none;
}
#reset {
  text-align: center;
  margin: 40vh 0;
}
#reset > h3 > span {
  color: hsl(265, 79%, 40%);
}
#confirm-password {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.confirm-icon {
  display: none;
}
.confirm {
  color: green;
  display: block;
}
#error {
  color: red;
}
</style>