'use strict';
module.exports = function(app) {
  const postController = require('./controllers/postController');
  const getController = require('./controllers/getController'); 

  app.route('/login')
    .post(postController.login);

  app.route("/table/:name")
    .post(getController.getData)

  app.route("/add-ticket")
    .post(postController.addTicket)
  
  app.route("/delete-ticket")
    .post(postController.deleteTicket);

  app.route("/update-ticket")
    .post(postController.updateTicket);
};