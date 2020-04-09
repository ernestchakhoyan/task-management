const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { defaultUserId, defaultUser, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("should Sign up new user", async () => {
    const response = await request(app).post("/users")
        .send({
            name: "Ernest",
            email: "ernest@example.com",
            password: "Ernest777!"
        })
        .expect(201);

    // Check if user is created in DB
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Compare response and request data
    expect(response.body).toMatchObject({
        user: {
            name: "Ernest",
            email: "ernest@example.com"
        },
        token: user.tokens[ 0 ].token
    });

    // Password should not be  plain text
    expect(response.body.user.password).not.toBe("Ernest777!");

});

test("Should login existing user", async () => {
    const response = await request(app).post("/users/login")
        .send({
            name: defaultUser.name,
            email: defaultUser.email,
            password: defaultUser.password,
        })
        .expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[ 1 ].token);
});

test("Should NOT login non-existing user", async () => {
    await request(app).post("/users/login")
        .send({
            name: "NonExisting",
            email: "non@existing.com",
            password: "helloWorld1!"
        })
        .expect(401);
});

test("Should get user profile", async () => {
    await request(app).get("/users/me")
        .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
        .send()
        .expect(200);
});

test("Should NOT get user profile", async () => {
    await request(app).get("/users/me")
        .send()
        .expect(401);
});

test("Should delete user account", async () => {
    const response = await request(app).delete("/users/me")
        .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
        .send()
        .expect(200);

    const user = await User.findById(defaultUserId);
    expect(user).toBeNull();
});

test("Should NOT delete user account", async () => {
    await request(app).delete("/users/me")
        .send()
        .expect(401);
});

test("Should upload avatar picture", async () => {
    await request(app).post("/users/me/avatar")
        .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
        .attach("avatar", "tests/fixtures/iron-man.jpg")
        .expect(200);

    const user = await User.findById(defaultUserId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update user",  async () => {
   await request(app).patch("/users/me")
       .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
       .send({
           name: "Gotham"
       })
       .expect(200)

    const user = await User.findById(defaultUserId);
    expect(user.name).toBe("Gotham");
});

test("Should NOT update user when fields are wrong",  async () => {
   await request(app).patch("/users/me")
       .set("Authorization", `Bearer ${defaultUser.tokens[ 0 ].token}`)
       .send({
           hello: "Gotham"
       })
       .expect(400)
});
