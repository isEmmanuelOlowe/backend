const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const SERVER_URL = process.env.BACKEND_HOST;


describe('Tests for Sub Collection', () => {

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
    

    it("Adding A New Sub Successful", async () => {

        const createSub = await request(SERVER_URL).post('/sub/create')
                            .send({title: "general", description: "general", owner: {username: "testuser", server: "b6"}})

        title = createSub.body.title
        expect(title).to.equal("Added");
    })

    it("Getting A Sub and verifying body properties", async () => {

        const response = await request(SERVER_URL).get('/sub?title=general')
        // seeing if our response has the following properties 
        expect(response.body).to.contain.property('_id');
        expect(response.body).to.contain.property('title');
        expect(response.body).to.contain.property('description');
        expect(response.body).to.contain.property('owner');
    })

})