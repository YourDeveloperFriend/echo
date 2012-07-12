
var BaseController = require('./BaseController').BaseController;
var app_controller = {

};
BaseController.duplicate(app_controller);

app_controller.addUses(["Application"]);

app_controller.actions.get.viewAll = function(req, res) {
    var application = app_controller.get_model('Application');
    application.findAll(function(err, results) {
        if(err) throw new Error(err);
        else {
            res.finish({applications: results});
        }
    });
};

app_controller.actions.require_app_id.get.view = function(req, res) {
    console.log(req.params);
    res.finish({application: req.params.application});
};

app_controller.actions.post.register = function(req, res) {
     app_controller.checkInput({
         name: ["exists"],
         package_name: ["exists"],
         google_authorization_token: [],
         apple_authorization_token: []
     }, req, res, function(req, res) {
         var application = app_controller.get_model('Application');
         application.generateAppId(function(err, app_id) {
             if(err) throw new Error(err);
             else {
                 req.body.application_id = app_id;
                 application.insert(req.body, function(err, results) {
                     if(err) throw new Error(err);
                     else {
                         res.finish({
                             application_id: app_id,
                             success: true
                         });

                     }
                 });
             }
         });
     });
};

app_controller.actions.require_app_id.put.update = function(req, res) {
    app_controller.checkInput({
        package_name: [],
        google_authorization_token: [],
        apple_authorization_token: []
    }, req, res, function(req, res) {
        var appModel = app_controller.get_model('Application');
        appModel.update({_id:req.params.application._id}, {'$set': req.body}, function(error, numberUpdated) {
            if(error) throw Error(error);
            res.finish({
                success: true
            });
        });
    });
};

app_controller.actions.require_app_id.delete.remove = function(req, res) {
    app_controller.checkInput({
    }, req, res, function(req, res) {
        var appModel = app_controller.get_model('Application');
        appModel.remove({_id:req.params.application._id}, function(error, results) {
            if(error) throw new Error(error);
            console.log(results);
            res.finish({
                success: true
            });
        });
    });
};

exports.app_controller = app_controller;