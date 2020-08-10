const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
  if (val * 1> tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID  '
    });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad request'
    });
  }
    // console.log(`The name of the tour is ${req.body.name}, the price is ${req.body.price}$ `);
    next();
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    state: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
}

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    state: 'success',
    data: {
      tour
    }
  });
}

exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId}, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      state: 'success',
      data: {
        tour: newTour
      }
    });

  });
}

exports.updateTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour should be here>'
    }
  });
}

exports.deleteTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el =>  el.id === id);

  res.status(204).json({
    status: 'success',
    data: null
  });
}
