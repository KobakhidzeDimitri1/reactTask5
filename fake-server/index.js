require("dotenv").config();
const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const verifyToken = require("./middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const { type } = require("os");
const app = express();
const router = jsonServer.router('db/contacts.json');
const middlewares = jsonServer.defaults();

app.use(bodyParser.json());
app.use(middlewares);

app.delete("/contacts/:id", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);

  const contacts = router.db.get("contacts").value()
  const userContacts = contacts.filter(contact => contact.user_id === user_id);

  const isUserContact = userContacts.find(contact => contact.id === id);

  if (!isUserContact) {
    return res.status(403).send({ msg: 'You are not allowed to delete this contact' });
  }

  const updatedContacts = contacts.filter(contact => contact.id !== id)

  console.log(updatedContacts)

  router.db.set('contacts', updatedContacts).write();

  res.status(201).json(updatedContacts.filter(contact => contact.user_id === user_id));
  
});

app.patch("/contacts/:id", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);
  const updatedObject = req.body


  const contacts = router.db.get("contacts").value()
  const userContacts = contacts.filter(contact => contact.user_id === user_id);

  const isUserContact = userContacts.find(contact => contact.id === id);

  if (!isUserContact) {
    return res.status(403).send({ msg: 'You are not allowed to edit this contact' });
  }

  const updatedContacts = contacts.map(contact => {
    if (contact.id !== id) return contact;

    return updatedObject;
  })


  router.db.set('contacts', updatedContacts).write();

  res.status(201).json(updatedContacts.filter(contact => contact.user_id === user_id));
  
});



app.post("/contacts", verifyToken);



app.get("/contacts", verifyToken, (req, res, next) => {
  const user_id = req.user.id;

  const { contacts } = require('./db/contacts.json');
  
  const userContacts = contacts.filter(contact => contact.user_id === user_id);

  if (req.method === 'GET') {
    return res.send(userContacts);
  }
  
});

app.put("/contacts", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const newContact = req.body;

  const contacts = router.db.get("contacts").value()
  contacts.push(newContact)

  router.db.set('contacts', contacts).write();

  res.status(201).json(contacts.filter(item => item.user_id === user_id));
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "root" && password === "Default-123") {
    const token = jwt.sign({ id: 1, nickName: "root", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  if (login === "user" && password === "Password-123") {
    const token = jwt.sign({ id: 2, nickName: "usr1", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  return res.status(401).send({ msg: "Unathorized" });

});

app.get("/me", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  return res.send({ id, nickName });
});

app.use(router);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
