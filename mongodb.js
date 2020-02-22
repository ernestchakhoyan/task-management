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

    const promiseToUpdate = db.collection("users").updateOne(
        { _id: new ObjectId("5e504b07ec21b2482ed8f090") },
        {
            $set: {
                name: "Joker"
            },
            $rename: {
                ages: "age"
            }
        });

    promiseToUpdate
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })


    const promiseToUpdateMany = db.collection("tasks").updateMany(
        {completed: false},
        {
            $set: {
                completed: true
            }
        });

    promiseToUpdateMany
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
});
