'use strict';
module.exports = function(app) {
  const postController = require('./controllers/postController');
  const getController = require('./controllers/getController'); 

  app.route('/login')
    .post(postController.login);

  app.route("/table/:name")
    .post(getController.getData);

  app.route("/add-ticket")
    .post(postController.addTicket);
  
  app.route("/delete-ticket")
    .post(postController.deleteTicket);

  app.route("/update-ticket")
    .post(postController.updateTicket);

  app.route("/add-customer")
    .post(postController.addCustomer);
  
  app.route("/add-flight")
    .post(postController.addFlight);

  app.route("/delete-flight")
    .post(postController.deleteFlight);

  app.route("/add-airport")
    .post(postController.addAirport);

  app.route("/update-airport")
    .post(postController.updateAirport);

  app.route("/delete-airport")
    .post(postController.deleteAirport);
  
  app.route("/add-plane")
    .post(postController.addPlane);

  app.route("/delete-plane")
    .post(postController.deletePlane);

  app.route("/update-plane")
    .post(postController.updatePlane);

  app.route("/add-employee")
    .post(postController.addEmployee);

  app.route("/update-employee")
    .post(postController.updateEmployee);

  app.route("/delete-employee")
    .post(postController.deleteEmployee);
};