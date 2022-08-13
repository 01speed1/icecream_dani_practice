const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
//var mysql = require("mysql");
const knex = require("knex");

const app = express();
const port = 3000;

const db = knex({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "miheladodb",
  },
});

/* var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "miheladodb",
}); */

/* connection.connect(function (error) {
  if (error) {
    console.log("Hey DB disconnected");
  }

  console.log("The DB is connected");
});
 */
/* const queryString = `CREATE TABLE IF NOT EXISTS icecream (
    id int not null auto_increment,
    name varchar(255) not null,
    price int not null,
    primary key ( id )
)`; */

/* connection.query(queryString, function (error, results, fields) {
  if (error) throw error;
  console.log("table icecream created or is ok");
}); */

//connection.end();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Se indica el directorio donde se almacenarán las plantillas
app.set("views", __dirname + "/views");

// Se indica el motor del plantillas a utilizar
app.set("view engine", "pug");

let countVisits = 0;

app.get("/icecream/new", (request, response) => {
  response.render("icecream/new", { actionUrl: "/icecream" });
});

app.get("/icecream/:id", (request, response) => {
  const id = request.params.id;

  const { price } = request.query;

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

app.get("/icecream", async (request, response) => {
  try {
    const results = await db("icecream").select("id", "name", "price");

    return response.render("icecream/index", { MyIceCreams: results });
  } catch (error) {
    return response.render("icecream/index", {
      error: "Error al consultar helados",
      MyIceCreams: [],
    });
  }
});

app.get("/icecream/edit/:id", async (request, response) => {
  const { id } = request.params;

  let queryResponse = await db.select().from("icecream").where("id", "=", id);
  console.log(queryResponse);
  let iceCream = queryResponse[0];
  return response.render("icecream/new", {
    ...iceCream,
    actionUrl: `/icecream/${iceCream.id}?_method=PUT`,
  });
  /////////////////////////////////////////
  /* let queryString = `select * from icecream where id = ${id}`;

  connection.query(queryString, function (error, results, fields) {
    if (error || results.length === 0) {
      console.log(error);

      queryString = "select * from icecream";

      return connection.query(queryString, function (error, results, fields) {
        return response.render("icecream/index", {
          message: "ese helado no existe, intenta otro",
          MyIceCreams: results,
        });
      });
    }

    const foundIceCream = results[0];

    return response.render("icecream/new", {
      ...foundIceCream,
      actionUrl: `/icecream/${foundIceCream.id}?_method=PUT`,
    });
  }); */
});

// este crea un helado nuevo
app.post("/icecream", async(request, response) => {
  //recibe el body de la peticion
  const { name, price } = request.body;

  await db("icecream").insert({
    name:name,
    price:price
  })
  return response.redirect("/icecream")
 /*  const queryString = `
    insert into icecream (name, price) values ("${name}", "${price}");
  `;

  connection.query(queryString, function (error, results, fields) {
    if (error) {
      console.log(error);

      return response.render("icecream/new", {
        error: "fallo agregar el helado",
      });
    }

    return response.redirect("/icecream");
  }); */
});

app.put("/icecream/:id", async (request, response) => {
  const { id } = request.params;

  const { name, price } = request.body;

  await db("icecream")
    .update({ name: name, price: price })
    .where("id", "=", id);

  response.redirect("/icecream");

});

app.delete("/icecream/:id", async(request, response) => {
  const { id } = request.params;

  await db("icecream").del().where('id','=',id)
  response.redirect("/icecream");

  /* const queryString = `DELETE FROM icecream WHERE id="${id}"`;
  connection.query(queryString, function (error, results) {
    if (error) {
      console.log(error);
    }
    response.redirect("/icecream");
  }); */
});

app.listen(port, () =>
  console.log(`MiHelado webapp listening on port ${port}!`)
);
