const express = require("express");
const app = express();
const port = 3000;
//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const MyIceCreams = [
  { id: 78, name: "Vanilla", price: "40" },
  { id: 89, name: "chocolate", price: "200" },
];

app.get("/icecream/:id", (request, response) => {
  const id = request.params.id;

  const { price } = request.query;

  console.log({ price });

  const foundIceCream = MyIceCreams.find(function (icecream) {
    return icecream.id === +id ? icecream : null;
  });

  if (!foundIceCream) {
    response.json({ message: "Ice Cream not found" });
  }

  if (price) {
    const modifiedIceCream = {
      ...foundIceCream,
      price: `The price is really high ${price}`,
    };
    return response.json(modifiedIceCream);
  }

  response.json(foundIceCream);
});

app.get("/icecream", (request, response) => {
  response.json(MyIceCreams);
});

app.post("/icecream", (request, response) => {
  //recibe el body de la peticion
  const { id, name, price } = request.body;

  const newIceCream = { id: +id, name, price };

  //mandar la informcion al arreglo de objetos

  MyIceCreams.push(newIceCream);

  //responder que el helado se agrego
  response.json({ message: "Ice Cream added", newIceCream });
});

app.put("/icecream/:id", (request, response) => {
  // get info client

  const { id } = request.params;

  if (!id) {
    response.json({ message: "Id is required" });
  }

  const { name, price } = request.body;

  // cambiar la informacion actual por la del cliente

  MyIceCreams.forEach((icecream) => {
    if (icecream.id === +id) {
      icecream.name = name;
      icecream.price = price;
    }
    return icecream;
  });

  // responder con la actualizacion
  response.json({ message: "Ice Cream updated" });
});

app.delete("/icecream/:id", (request, response) => {
  const { id } = request.params;

  const foundIndexIceCream = MyIceCreams.indexOf(function (icecream) {
    return icecream.id === +id;
  });

  MyIceCreams.splice(foundIndexIceCream, 1);

  response.json({ message: "Ice Cream deleted" });
});

app.listen(port, () =>
  console.log(`MiHelado webapp listening on port ${port}!`)
);
