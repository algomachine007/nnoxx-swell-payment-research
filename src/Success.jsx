import { useEffect } from "react";
import swell from "swell-js";

swell.init("nnoxx-staging", import.meta.env.VITE_SWELL_PUBLIC_KEY);
const Success = () => {
  useEffect(() => {
    swell.payment.handleRedirect({
      klarna: {
        onError: (err) => {
          // inform the customer there was an error
          console.log(err);
        },
        onSuccess: () => {
          console.log("Success");
          swell.cart.submitOrder();
        },
      },
    });
  }, []);
  return <div>Success Page</div>;
};

export default Success;
