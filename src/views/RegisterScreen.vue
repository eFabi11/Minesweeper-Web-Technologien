<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <section class="container mt-4 active">
    <h2>User Registration</h2>
    <p>Register with your email or sign in using Google.</p>

    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter your password"
          required
        />
      </div>

      <!-- Register Button -->
      <button
        type="submit"
        class="btn btn-primary btn-block"
        @click="register">
        Register
      </button>

      <!-- Sign-In Button -->
      <button
        type="submit"
        class="btn btn-primary btn-block"
        @click="signIn">
        Sign In
      </button>
    </form>
    <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    <div class="mt-4">
      <p>Or</p>

        <!-- Sign-In Buttons -->
        <div class="d-flex flex-wrap justify-content-center align-items-center">
          <!-- GitHub Button -->
          <button class="btn btn-github btn-custom mx-2" @click="signInWithGitHub">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" class="icon-only" />
          </button>

          <!-- Google Button -->
          <button class="btn btn-google btn-custom mx-2" @click="signInWithGoogle">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="icon-only" />
          </button>

          <!-- Microsoft Button -->
          <button class="btn btn-microsoft btn-custom mx-2" @click="signInWithMicrosoft">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Logo" class="icon-only" />
          </button>

          <!-- Apple Button -->
          <button class="btn btn-apple btn-custom mx-2" @click="signInWithApple">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" class="icon-only" />
          </button>

          <!-- Twitter Button -->
          <button class="btn btn-twitter btn-custom mx-2" @click="signInWithTwitter">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter Logo" class="icon-only" />
          </button>

          <!-- Facebook Button -->
          <button class="btn btn-facebook btn-custom mx-2" @click="signInWithFacebook">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook Logo" class="icon-only" />
          </button>
        </div>
    </div>
    </section>
  </div>
</template>

<script>
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
    OAuthProvider,
    TwitterAuthProvider,
    FacebookAuthProvider
    } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    register() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
          console.log("Successfully registered user:", auth.currentUser);
          this.$emit('signed-in');
      })
      .catch((error) => {
          console.error("Error registering user:", error.code);
          alert(error.message);
      });
    },
    signIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        console.log("Successfully signed in user:", auth.currentUser);
        this.$emit('signed-in');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            this.error = "Invalid email format. Please enter a valid email address.";
            break;
          case "auth/user-not-found":
            this.error = "User not found. Please check your email and password.";
            break;
          case "auth/wrong-password":
            this.error = "Incorrect password. Please enter the correct password.";
            break;
          case "auth/invalid-credential":
            this.error = "Invalid credentials. Please enter a correct E-Mail and Password.";
            break;
        }
      });
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
      .then(() => {
        console.log("Successfully signed in with Google:", getAuth().currentUser);
        this.$emit('signed-in');
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.code);
        alert(error.message);
      });
    },
    signInWithGitHub() {
      const provider = new GithubAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then(() => {
          console.log("Successfully signed in with GitHub:", getAuth().currentUser);
          this.$emit('signed-in');
        })
        .catch((error) => {
          console.error("Error signing in with GitHub:", error.code);
          alert(error.message);
        });
    },
    signInWithMicrosoft() {
      const provider = new OAuthProvider('microsoft.com');
      signInWithPopup(getAuth(), provider)
        .then(() => {
          console.log("Successfully signed in with Microsoft:", getAuth().currentUser);
          this.$emit('signed-in');
        })
        .catch((error) => {
          console.error("Error signing in with Microsoft:", error.code);
          alert(error.message);
        });
    },
    signInWithApple() {
      const provider = new OAuthProvider('apple.com');
      signInWithPopup(getAuth(), provider)
        .then(() => {
          console.log("Successfully signed in with Apple:", getAuth().currentUser);
          this.$emit('signed-in');
        })
        .catch((error) => {
          console.error("Error signing in with Apple:", error.code);
          alert(error.message);
        });
    },
    signInWithTwitter() {
      const provider = new TwitterAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then(() => {
          console.log("Successfully signed in with Twitter:", getAuth().currentUser);
          this.$emit('signed-in');
        })
        .catch((error) => {
          console.error("Error signing in with Twitter:", error.code);
          alert(error.message);
        });
    },
    signInWithFacebook() {
      const provider = new FacebookAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then(() => {
          console.log("Successfully signed in with Facebook:", getAuth().currentUser);
          this.$emit('signed-in');
        })
        .catch((error) => {
          console.error("Error signing in with Facebook:", error.code);
          alert(error.message);
        });
    },
  }
};
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Bitter');
    @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    /* General styles */
    * {
        font-family: 'Bitter', 'Arial', sans-serif;
        text-align: center;
    }

    /* Active section styling */
    section.active {
        border: 2px solid #007bff;
        background-color: rgba(0, 123, 255, 0.04);
    }

    .container {
        background-color: rgba(255, 255, 255, 0.75);
        padding: 60px;
        border-radius: 100px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #007bff;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 20px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .btn-block {
      width: 100%;
    }

    button {
      transition: transform 0.2s;
    }

    button:hover {
      transform: scale(1.05);
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .container {
            padding: 30px;
        }
    }

    @media (max-width: 576px) {
        .container {
            padding: 20px;
        }
    }

    /* Button Custom Styles */
    .btn-custom {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      font-size: 16px;
      border-radius: 5px;
      color: white;
      border: none;
      height: 60px; /* Consistent size for buttons */
      width: 60px;  /* Consistent size for buttons */
    }

    /* Icon Styling */
    .icon-only {
      width: 32px;
      height: 32px;
    }

    /* Responsive Wrapping */
    .d-flex {
      flex-wrap: wrap;
    }
</style>
