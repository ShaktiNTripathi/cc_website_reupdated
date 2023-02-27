const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

exports.createOrder = function(req, res) {
  const options = {
    amount: req.body.amount,
    currency: 'INR',
    receipt: 'receipt_order_12345',
    payment_capture: '1'
  };

  razorpay.orders.create(options, function(err, order) {
    if(err) {
      console.log(err);
      return res.status(500).json({ message: 'Error creating order' });
    }
    res.json(order);
  });
};

exports.verifyPayment = function(req, res) {
  const body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
  const expectedSignature = Buffer.from(body).toString('base64');
  const actualSignature = req.body.razorpay_signature;

  if(expectedSignature === actualSignature) {
    res.json({ message: 'Payment successful' });
  } else {
    res.json({ message: 'Payment verification failed' });
  }
};
