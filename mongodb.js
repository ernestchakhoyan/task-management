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

    db.collection("tasks").insertMany([
            {
                description: "Create a task",
                completed: false
            },
            {
                description: "Complete a task",
                completed: false
            },
            {
                description: "Check if it is done",
                completed: true
            }
        ],
        (error, result) => {
            if (error) {
                return console.log("Unable to insert documents in Tasks Collection");
            }

            console.log(result.ops);
        }
    );

    db.collection("users").insertOne({
        name: "Jenny",
        age: 21
    }, (error, result) => {
        if(error){
            return console.log("Unable to insert document in users")
        }

        console.log(result);
    });

    db.collection("users").findOne({ _id: new ObjectId("5e510e9e53ce044a18dd7db6") }, (error, result) => {
        if (error) {
            return console.log("Unable to find document in users");
        }

        console.log(result);
    });
});
