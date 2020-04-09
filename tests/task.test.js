const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");

const {
    taskOne,
    taskTwo,
    taskThree,
    defaultUserId,
    userTwo,
    defaultUser,
    setupDatabase
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
        .send({
            description: "Task in test"
        })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
})

test("Should get user's tasks", async () => {
    const response = await request(app)
        .get(`/tasks`)
        .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(3)
})

test("Should not be able to delete others tasks", async () => {
    const response = await request(app)
        .get(`/tasks:${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[ 0 ].token}`)
        .send({
            description: "Task in test"
        })
        .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})