const Razorpay = require('razorpay');

async function test() {
  try {
    const instance = new Razorpay({
      key_id: 'dummy_key\r',
      key_secret: 'dummy_secret\r',
    });
    console.log("Instantiated");
    await instance.orders.create({ amount: 100, currency: 'INR', receipt: 'test' });
    console.log("Order created");
  } catch (e) {
    console.error("Caught error:", typeof e, e);
  }
}

test();
