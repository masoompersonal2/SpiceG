const Razorpay = require('razorpay');

try {
  const instance = new Razorpay({
    key_id: process.env.RZP_KEY || '',
    key_secret: process.env.RZP_SEC || '',
  });
  console.log("Instantiated successfully with empty keys.");
} catch (e) {
  console.error("Failed to instantiate with empty keys:", e.message);
}

try {
  const instance2 = new Razorpay({
    key_id: 'dummy',
    key_secret: 'dummy',
  });
  console.log("Instantiated successfully with dummy keys.");
  instance2.orders.create({ amount: 100, currency: 'INR', receipt: 'test' })
    .then(console.log)
    .catch(e => console.error("Create order rejected with:", e));
} catch (e) {
  console.error("Failed to instantiate with dummy keys:", e.message);
}
