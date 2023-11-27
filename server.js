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
      collection.createIndex({cart: 1})
      try {
        const pipelines = [
          { $match: { cart, } },
          { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
        ];

        const result = await collection.aggregate(pipelines).toArray();
        const total = result.length > 0 ? result[0].total : 0;
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
