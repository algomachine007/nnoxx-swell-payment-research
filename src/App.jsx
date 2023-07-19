import { useEffect, useState } from "react";
import "./App.css";

import { loadStripe } from "@stripe/stripe-js";
// import Stripe from "stripe";
import swell from "swell-js";

swell.init("nnoxx-staging", import.meta.env.VITE_SWELL_PUBLIC_KEY);

const STRIPE_PUBLIC_KEY =
  "pk_test_51M34D4L3jXIJJMcYZHDQq4I4vNQ50GLjGFaxp9VgQmLKxb6kNcDWSDWtUngEDzt2P0Do0PcDGPCR1KlTYSReXYeY00YSymwxQP";

// const STRIPE_SECRET_KEY =
//   "sk_test_51M34D4L3jXIJJMcYw0EZZlFMGBUoLgmjUqcNlYPBQx0nALhyTRS5cMnhU3I8DqZ6VbgRvXBDSnKKcCDByp0SIuY000dllmp1AG";

// console.log("SWELL", swell);
// const items = await swell.cart.get();
// console.log("items", items);

const mapCartToItems = (items) => {
  return (
    Array.isArray(items.items) &&
    items?.items?.map((item) => {
      return {
        type: item?.product.sku || "sku",
        description: item?.product.description || "",
        quantity: item?.quantity || "",
        amount: Number(items?.sub_total),
        currency: String(items?.currency).toLowerCase() || "usd",
      };
    })
  );
};
// console.log("Mapped Items", mapCartToItems(items));

const createKlarnaPaymentGateway = async () => {
  try {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    const items = await swell.cart.get();

    const intent = await stripe.createSource({
      type: "klarna",
      flow: "redirect",
      redirect: {
        return_url: "http://localhost:5173/success",
      },
      amount: items?.sub_total,
      currency: "usd",
      klarna: { product: "payment", purchase_country: "US" },
      source_order: {
        items: mapCartToItems(items),
      },
    });

    // or use router.push method
    setTimeout(() => {
      window.open(intent.source.redirect.url, "_self");
    }, 1000);

    const billing = {
      method: "klarna",
      klarna: {
        source: intent?.source.id,
      },
    };

    await swell.cart.update({ billing });
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
      <button onClick={createKlarnaPaymentGateway}> Pay with Klarna</button>
    </>
  );
}

export default App;
