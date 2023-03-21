import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51MmAJhCzt7ztq49kiuXMnYln8QVhFctSqS87iuIrdDJ6my89lUI3v2NpqxLUPc0o2sgGfkRtViQGl9X3JGbWLK4P00By4FgFUQ'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    //2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
