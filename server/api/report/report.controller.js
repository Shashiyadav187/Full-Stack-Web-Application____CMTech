'use strict';

// var _ = require('lodash');
var Report = require('./report.model');
var uploadcare = require('uploadcare')('83f63cc660fb816745c1', '929f67d263933ef93470');
// var moment = require('moment');
var Project = require('.。/project.model');
// Get list of reports
exports.index = function(req, res) {
  Report.find(function (err, reports) {
    if(err) { return handleError(res, err); }
    return res.json(200, reports);
  });
};

// Get a single report
exports.show = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    return res.json(report);
  });
};

// exports.showByProject = function(req,res){
//   Report.find({link_project : req.params.id}, function(err, reports){
//     if(err) { return handleError(res, err); }
//     if(!reports) { return res.send(404); }

//     _.groupBy(reports,function(n) {
//       n.day = moment(n.report_create_date).format('dddd');
//       n.date = moment(n.report_create_date).format('MMMM d, YYYY');
//       return moment(n.report_create_date).format('MMMM YYYY');
//     });
//     return res.json(reports);
//   });
// };

// Creates a new report in the DB.
exports.create = function(req, res) {
  // console.log(req.body.id)
  uploadcare.files.store(req.body.id, function(err,res){
    console.log(err,res);
  });
  Report.create(req.body, function(err, report) {
    if(err) { return handleError(res, err); }
    Project.findById(req.params.projectID, function(err, project){
      if(err) { return handleError(res, err); }
      project.link_daily_report.push(report._id);
      project.save(function(err){
        if(err) { return handleError(res, err); }
        return res.json(201, report);
      });
    })
  });
};

// Updates an existing report in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Report.findById(req.params.id, function (err, report) {
    if (err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    var updated = _.merge(report, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, report);
    });
  });
};

// Deletes a report from the DB.
exports.destroy = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    report.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}