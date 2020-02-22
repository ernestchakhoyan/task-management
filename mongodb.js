//Crud create read update delete
const mongodb = require("mongodb");
const { MongoClient, ObjectId } = mongodb;

const connectionUrl = "mongodb://127.0.0.1:27017";
const dataBaseName = "task-manager";

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to DataBase");
    }

    const db = client.db(dataBaseName);

   db.collection("tasks").findOne({ _id: new ObjectId("5e504dbf2092884853f41563") }, (error, user) => {
        if (error) {
            return console.log("Unable to find document in tasks");
        }

        console.log(user);
    });

    db.collection("tasks").find({ completed: false }).toArray((error, tasks) => {
        if (error) {
            return console.log("Unable to find document in tasks");
        }

        console.log(tasks);
    });
});
