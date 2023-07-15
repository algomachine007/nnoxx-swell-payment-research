import { useEffect } from "react";
import "./App.css";

import swell from "swell-js";
const NEXT_PUBLIC_KEY_FRONTEND = "pk_OzGDoTyCo2Na5ivhvXhkGn4nVVx6N7VN";
const BACKEND_API_KEY = "5YA6e6BeSlngL9mR2OogoOOoSFnNGDaX";
swell.init("nnoxx-staging", "pk_OzGDoTyCo2Na5ivhvXhkGn4nVVx6N7VN");

const createCart = async () => {
  await swell.cart.setItems([]); //Used to reset the cart on init
  await swell.cart.addItem({
    product_id: "63fff1df95416c00134d3ad7",
  });
  // await payNowApple();
};

async function payNow() {
  try {
    await swell.payment.createElements({
      google: {
        elementId: "googlepay-button", // Default: googlepay-button
        locale: "en", // Default: en
        style: {
          color: "<button-color>", // Default: black
          type: "<button-type>", // Default: buy
          sizeMode: "<button-size-mode>", // Default: fill
        },
        require: {
          // Requested data in Google Pay modal
          shipping: true, // Default: false
          email: true, // Default: false
          phone: true, // Default: false
        },
        classes: {
          base: "<button-container-class>", // Optional, the base class applied to the container
        },
        onSuccess: () => {}, // Optional, called on submit Google Pay modal
        onError: (error) => {
          console.log(error);
        }, // Optional, called on payment error
      },
    });
    console.log("clicked");
  } catch (error) {
    console.log(error);
    console.log("clicked");
  }
}

async function payNowApple() {
  try {
    await swell.payment.createElements({
      apple: {
        elementId: "applepay-button", // Default: applepay-button
        style: {
          theme: "<button-theme>", // Default: black
          type: "<button-type>", // Default: plain
          height: "<button-height>", // Default: 40px
        },
        require: {
          // Requested data in Apple Pay modal
          shipping: true, // Default: false
          name: true, // Default: false
          email: true, // Default: false
          phone: true, // Default: false
        },
        classes: {
          base: "paymentRequestButton", // Optional, the base class applied to the container
          // The following classes only work with Stripe Apple Pay
          complete: "<button-complete-class>", // Optional, the class name to apply when the Element is complete
          empty: "<button-empty-class>", // Optional, the class name to apply when the Element is empty
          focus: "<button-focus-class>", // Optional, the class name to apply when the Element is focused
          invalid: "<button-invalid-class>", // Optional, the class name to apply when the Element is invalid
          webkitAutofill: "<button-webkit-autofill-class>", // Optional, the class name to apply when the Element has its value autofilled by the browser (only on Chrome and Safari)
        },
        onSuccess: () => {}, // Optional, called on submit Apple Pay modal
        onError: (error) => {
          console.log(error);
        }, // Optional, called on payment error
      },
    });
    console.log("clicked");
  } catch (error) {
    console.log(error);
    console.log("clicked");
  }
}

function App() {
  useEffect(() => {
    createCart();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await swell.cart.get("");
        console.log("cart data", data);
      } catch (error) {
        console.log(error);
      }
    })();
  });
  return (
    <>
      GPAY
      <div id="googlepay-button">Rendered Here</div>
      <div id="applepay-button">Rendered Here</div>
      <button id="googlepay-button" onClick={payNow}>
        Google
      </button>
      <button id="applepay-button" onClick={payNowApple}>
        Apple
      </button>
      <button onClick={createCart}>Create Cart Apple</button>
    </>
  );
}

export default App;
