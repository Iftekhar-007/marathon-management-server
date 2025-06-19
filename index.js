const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@iftekharbases.ulu3uwc.mongodb.net/?retryWrites=true&w=majority&appName=IftekharBases`;

// const uri =
//   "mongodb+srv://<db_username>:<db_password>@iftekharbases.ulu3uwc.mongodb.net/?retryWrites=true&w=majority&appName=IftekharBases";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("marathonHUb");
    const usersCollection = database.collection("users");
    const marathonsCollection = database.collection("marathons");
    const applicationsCollection = database.collection("applications");

    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.send(result);
    });

    app.post("/applications", async (req, res) => {
      const registration = req.body;
      try {
        const result = await applicationsCollection.insertOne(registration);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to register", details: err });
      }
    });

    app.get("/applications", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await applicationsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/marathons", async (req, res) => {
      const marathon = req.body;

      const result = await marathonsCollection.insertOne(marathon);
      res.send(result);
    });

    // PUT
    app.put("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await applicationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    // DELETE
    app.delete("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const result = await applicationsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/marathons", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit);
        const query = {}; // Add filters if needed

        const cursor = marathonsCollection.find(query);
        const result = limit
          ? await cursor.limit(limit).toArray()
          : await cursor.toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch marathons" });
      }
    });

    app.get("/mymarathons", async (req, res) => {
      const email = req.query.email;
      const query = { creatorEmail: email };
      const result = await marathonsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsCollection.findOne(query);
      res.send(result);
    });

    app.put("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await marathonsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    app.delete("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const result = await marathonsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Marathon Hub Is Cooking By Me");
});

app.listen(port, () => {
  console.log(`running on ${port}`);
});
