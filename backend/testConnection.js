require("dotenv").config();
const { MongoClient } = require("mongodb");

async function test() {
  const uri = (process.env.MONGO_URI || "").replace(/["';]+$/, "").trim();
  console.log("Testing connection with URI starting with:", uri.substring(0, 30));
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected!");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful!");
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

test();
