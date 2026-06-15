const jwt = require('jsonwebtoken'); 
const token = jwt.sign({ id: 1 }, 'spicegarden_dev_secret_key'); 
fetch('http://localhost:3000/api/events', { 
  method: 'POST', 
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + token 
  }, 
  body: JSON.stringify({ 
    title: 'Test', 
    subtitle: 'test', 
    location: 'test', 
    date: '2026-06-16', 
    price: 100, 
    totalSeats: 50, 
    image: 'test.jpg' 
  }) 
}).then(res => res.text()).then(console.log).catch(console.error);
