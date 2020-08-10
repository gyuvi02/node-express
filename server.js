const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('DB connection successful'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: true
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  // rating: 4.6,
  price: 412
});

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR:', err);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}`)
});
