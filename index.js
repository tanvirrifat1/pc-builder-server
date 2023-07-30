require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afkplob.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("pc-builder");
    const productCollection = db.collection("allPc");
    const userCollection = db.collection("user");

    app.get("/allPc", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });

      res.send(result);
    });

    app.get("/allPc/:category", async (req, res) => {
      const category = req.params.category;
      const result = await productCollection.find({ category }).toArray();
      res.send({ status: true, data: result });
    });

    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        console.log(result);
        res
          .status(201)
          .json({ message: "User created successfully", user: result.ops[0] });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while creating the user" });
      }
    });

    app.get("/user", async (req, res) => {
      try {
        const cursor = await userCollection.find({});
        const product = await cursor.toArray();
        console.log(cursor);
        res.send({ status: true, data: product });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching users" });
      }
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
