const simples = require("simples");
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 8080;
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function connectClient() {
  try {
    // await client.connect();
    const db = client.db("skillshop");
    const collection = db.collection("carts");
    const server = simples(port);

    console.log("Server started and connected to MongoDB");
    server.get("/carts/:id", async function get(conn) {
      const cart = parseInt(conn.params.id);

      try {
        const data = await collection.find({ cart }).toArray();
        const total = data.reduce((a, e) => (a += e.price * e.quantity), 0);
        conn.send({ total });
      } catch (err) {
        console.error(err);
        conn
          .status(500)
          .send({ error: "An error occurred while fetching data" });
      }
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectClient();
