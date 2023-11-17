const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017/";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("skillshop");
    const collection = database.collection("carts");

    const max = 10000;

    async function insertDocument() {
      for (let count = 0; count < max; count++) {
        const doc = {
          cart: parseInt(Math.random() * 100),
          quantity: parseInt(Math.random() * 10) + 1,
          price: Math.random() * 1000,
        };

        const result = await collection.insertOne(doc);
      }
    }

    await insertDocument();
    console.log("10000 Documents inserted");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
