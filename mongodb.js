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

    db.collection("tasks").deleteOne({
        description: "Check if it is done"
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });

});
