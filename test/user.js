const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const SERVER_URL = process.env.BACKEND_HOST;


const testUserName = "testUser"
describe('Tests for User Collection', () => {

    // this will be executed before running all the tests 
    before(function(done) {
        mockgoose.prepareStorage().then(function() {

            // in case connection already exists, need to setup new mock connection
            mongoose.connection.close()
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useFindAndModify', false);
            mongoose.set('useCreateIndex', true);
            mongoose.set('useUnifiedTopology', true);

            mongoose.connect(process.env.DATABASE_URI, function(err) {
                done(err);
            });
        });
    });
    

    it("Sign up a new user Correct Password", async () => {
        const response = await request(SERVER_URL).post('/users/signUp')
                        .send({ username: testUserName, email: "abc@gmail.com", password: process.env.TEST_PASSWORD})
        message = response.body.message
        expect(message).to.equal("New User Added and Signed In");
    })
    

    it("Sign In User Correct Password", async () => {
        const response = await request(SERVER_URL).post('/users/sign-in')
                        .send({ username: testUserName, password: process.env.TEST_PASSWORD})
        message = response.body.message
        expect(message).to.equal("User Signed In");
    })

    it("Sign In User Incorrect Password", async () => {
        const response = await request(SERVER_URL).post('/users/sign-in')
                        .send({ username: testUserName, password: process.env.TEST_PASSWORD + "A"})
        message = response.body.message
        expect(message).to.equal("Incorrect Password");
    })

    it("Sign In User That Does Not Exists", async () => {
        const response = await request(SERVER_URL).post('/users/sign-in')
                        .send({ username: testUserName + "A", password: process.env.TEST_PASSWORD})
        message = response.body.message
        expect(message).to.equal("User Does Not Exist");
    })

    it('Getting all Users and verifying response body properties', async () => {
        const response = await request(SERVER_URL).get('/users/allUsers')
        // seeing if our response has the following properties 
        if (response.body.length > 0) {
            singleUser = response.body[0];
            expect(singleUser).to.contain.property('_id');
            expect(singleUser).to.contain.property('username');
            expect(singleUser).to.contain.property('password');
        }
    })

    it('Deleting user successful ', async () => {
        const response = await request(SERVER_URL).get('/users/allUsers')
        const userDeleteId = response.body[0]._id
        const deleteResponse = await request(SERVER_URL).delete('/users/' + userDeleteId)
        message = deleteResponse.body.message
        expect(message).to.equal('User Deleted Using Id');
    })
})