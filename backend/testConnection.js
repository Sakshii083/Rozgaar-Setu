const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
require("dotenv").config();

async function test() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected!");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();