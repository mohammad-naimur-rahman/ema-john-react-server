const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.avi8n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const products = client.db("emaJohnStore").collection("emaJohnStoreCollection");
    const productOrders = client.db("emaJohnStore").collection("emaJohnStoreOrders");
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        products.insertOne(product)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount);
            })
    })

    app.get('/products', (req, res) => {
        products.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        products.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/productByKeys', (req, res) => {
        const pdKeys = req.body;
        products.find({ key: { $in: pdKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        productOrders.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello duniya');
})

app.listen(process.env.PORT || port);