const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const SERVER_URL = process.env.BACKEND_HOST;


describe('Tests for Post Collection', () => {

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
    

    it("Adding A New Post Successful", async () => {

        const createSub = await request(SERVER_URL).post('/sub/create')
                            .send({title: "general", description: "general",  owner: {username: "testuser", server: "b6"}})
        const responseSub = await request(SERVER_URL).get("/sub?title=general")
        const subId = responseSub.body._id
        const token = jwt.sign({username: "testuser"}, process.env.TOKEN_SECRET);
        const createPost = await request(SERVER_URL).post('/posts/addPost')
                            .send({ sub: subId, title: "General Post", body: "Hello World !", username: "testuser", user: {username: "testuser", server: "B6"}})
                            .set('auth-token', token)
        
        message = createPost.body.message
        expect(message).to.equal("Post Added");
    })

    it("Adding A New Comment Successful", async () => {
        const allPosts = await request(SERVER_URL).get('/posts/allPosts')
        const postId = allPosts.body[0]._id;

        const createComment = await request(SERVER_URL).patch('/posts/addComment')
                        .send({ body: "This is Good", username: "hello2", postId: postId})
        message = createComment.body.message
        expect(message).to.equal("Comment Added");
    })

    it('My Posts Have Only My Username ', async () => {
        const response = await request(SERVER_URL).get('/posts/myposts/testuser');
        for (let i = 0; i < response.length; i++) {
            currentUsername = response.body[i].username;
            expect(currentUsername).to.equal("testuser");
        }
        
    })

    it('Deleting Post successful ', async () => {
        const response = await request(SERVER_URL).get('/posts/allPosts')
        const postDeleteId = response.body[0]._id
        const deleteResponse = await request(SERVER_URL).delete('/posts/' + postDeleteId)
        message = deleteResponse.body.message
        expect(message).to.equal('Post deleted using id');
    })



})