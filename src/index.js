const express = require("express");
const mongodb = require("mongodb");

async function startMicroservice(dbhost, dbname, port) {
  const client = await mongodb.MongoClient.connect(dbhost);
  const db = client.db(dbname);
  const videosCollection = db.collection("videos");

  const app = express();

  app.get("/videos", async (req, res) => {
    const videos = await videosCollection.find().toArray();
    res.json({
      videos: videos,
    });
  });

  const server = app.listen(port, () => {
    console.log("Microservice online.");
  });

  return {
    close: () => {
      server.close();
      client.close();
    },
    db: db,
  };
}

async function main() {
  if (!process.env.PORT) {
    throw new Error(
      "Please specify the port number for the HTTP server with the environment variable PORT."
    );
  }

  if (!process.env.DBHOST) {
    throw new Error(
      "Please specify the databse host using environment variable DBHOST."
    );
  }

  if (!process.env.DBNAME) {
    throw new Error(
      "Please specify the databse name using environment variable DBNAME."
    );
  }

  const PORT = process.env.PORT;
  const DBHOST = process.env.DBHOST;
  const DBNAME = process.env.DBNAME;

  await startMicroservice(DBHOST, DBNAME, PORT);
}

if (require.main === module) {
  // Only start the microservice normally if this script is the "main" module.
  main()
    .then(() => console.log("Microservice online."))
    .catch((err) => {
      console.error("Microservice failed to start.");
      console.error((err && err.stack) || err);
    });
} else {
  // Otherwise we are running under test

  module.exports = {
    startMicroservice,
  };
}
