import { useEffect, useState } from "react";
import "./App.css";

import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import swell from "swell-js";

swell.init("nnoxx-staging", import.meta.env.VITE_SWELL_PUBLIC_KEY);

const STRIPE_PUBLIC_KEY =
  "pk_test_51M34D4L3jXIJJMcYZHDQq4I4vNQ50GLjGFaxp9VgQmLKxb6kNcDWSDWtUngEDzt2P0Do0PcDGPCR1KlTYSReXYeY00YSymwxQP";

const STRIPE_SECRET_KEY =
  "sk_test_51M34D4L3jXIJJMcYw0EZZlFMGBUoLgmjUqcNlYPBQx0nALhyTRS5cMnhU3I8DqZ6VbgRvXBDSnKKcCDByp0SIuY000dllmp1AG";

const createKlarna = async () => {
  try {
    const str = await loadStripe(STRIPE_PUBLIC_KEY);
    const stripe = Stripe(STRIPE_SECRET_KEY);

    // fetch cart details before sending to Klarna

    const intent = await str.createSource({
      type: "klarna",
      flow: "redirect",
      redirect: {
        return_url: "http://localhost:3000/success",
      },
      amount: 816,
      currency: "usd",
      klarna: { product: "payment", purchase_country: "US" },
      source_order: {
        items: [
          {
            type: "sku",
            description: "Grey cotton T-shirt",
            quantity: 2,
            currency: "usd",
            amount: 796,
          },
          {
            type: "tax",
            description: "Taxes",
            currency: "usd",
            amount: 20,
          },
          {
            type: "shipping",
            description: "Free Shipping",
            currency: "usd",
            amount: 0,
          },
        ],
      },
    });
    console.log(intent);

    // method 2
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["klarna"],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: {
    //           name: "T-shirt",
    //         },
    //         unit_amount: 2000,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   // line_items: [{ price: "price_1M3JwrL3jXIJJMcYEIwYK0qH", quantity: 2 }],
    //   mode: "payment",
    //   success_url: "https://example.com/success",
    //   cancel_url: "https://example.com/cancel",
    // });
    // console.log("session", session);
    // redirect: https://checkout.stripe.com/c/pay/cs_test_a1NQrzeFtpi3hj2BWm9LNMfqrN2uq4mUWryFIznuXbmU2SPlzygg9pNQTg#fidkdWxOYHwnPyd1blpxYHZxWjA0SDYxQTFJNm9dTE9PSGZcX01BVHQxTDFzS1QwNUJJb0JDZH11PFNiVGhJTn1nM25LZkFSVkFScVBrYkBBf3E3VTVBajVVZkFCVUZXNE5pUVxWV2BdXGBcNTVcVnxocn1UVScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl
  } catch (error) {
    console.log(error);
  }
};

const createCart = async () => {
  await swell.cart.setItems([]); //Used to reset the cart on init
  await swell.cart.addItem({
    product_id: "63fff1df95416c00134d3ad7",
  });
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

const createPayWithCard = async () => {
  try {
    const response = await swell.card.createToken({
      number: "4242 4242 4242 4242",
      exp_month: 1,
      exp_year: 2029,
      cvc: 321,
      // Note: some payment gateways may require a Swell `account_id` and `billing` for card verification (Braintree)
      account_id: "5c15505200c7d14d851e510f",
      billing: {
        address1: "1 Main Dr.",
        zip: 90210,
        // Other standard billing fields optional
      },
    });
    console.log("response", response);
  } catch (error) {
    console.log(error);
  }
};

function App(props) {
  console.log("props", props);
  useEffect(() => {
    createCart();
  }, []);

  const [isApplePaySuccess, setIsApplePaySuccess] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const data = await swell.cart.get("");
        console.log("cart data", data);

        const payments = await swell.settings.payments();
        console.log("Payments", payments);
      } catch (error) {
        console.log(error);
      }
    })();
  });
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
            setIsApplePaySuccess(String(error));
            setTimeout(() => {
              setIsApplePaySuccess("");
            }, 1000);
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
  const payWithKlarna = async () => {
    const form = document.getElementById("payment-form");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const resp = await swell.payment.tokenize({
        klarna: {
          onError: (err) => {
            // inform the customer there was an error
            console.log(err);
          },
        },
      });
      console.log("response", resp);
    });
  };

  useEffect(() => {
    const form = document.getElementById("payment-form");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const billing = {
        method: "klarna",
        klarna: {
          source: "",
          // address1: "1 Main Dr.",
          // zip: 90210,
          // country: "US",
          billing_details: {
            address1: "1 Main Dr.",
            zip: 90210,
            country: "US",
          },
        },
      };

      // Using Swell JS library
      await swell.cart.update({
        billing,
      });

      const resp = await swell.payment.tokenize({
        klarna: {
          onError: (err) => {
            // inform the customer there was an error
            console.log(err);
          },
        },
      });
      console.log("response", resp);
    });
  }, []);
  return (
    <>
      GPAY
      <div
        id="googlepay-button"
        style={{
          padding: 50,
        }}
      ></div>
      <div id="applepay-button">Rendered Here</div>
      <button id="googlepay-button" onClick={payNow}>
        Google
      </button>
      <button id="applepay-button" onClick={payNowApple}>
        Apple
      </button>
      {isApplePaySuccess ? isApplePaySuccess : ""}
      <button onClick={createCart}>Create Cart Apple</button>
      <button onClick={createPayWithCard}>Pay with card</button>
      <form id="payment-form" onSubmit={payWithKlarna}>
        <button type="submit">Klarna</button>
      </form>
      <button onClick={createKlarna}> Create Klarna</button>
    </>
  );
}

export default App;
