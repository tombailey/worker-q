var WorkerQ = require("./lib.js");

var waitThenCallback = function(wait, callback) {
  setTimeout(callback, wait, wait);
};

//1 is serial execution. 2+ is parallel. Experiment with different numbers
var activeJobsLimit = 2;
var myAwesomeQueue = new WorkerQ(activeJobsLimit);

var myAwesomeWork = [
  function(success, failure) {
    waitThenCallback(3000, success);
  }, function(success, failure) {
    waitThenCallback(2000, success);
  }, function(success, failure) {
    waitThenCallback(1000, success);
  }, function(success, failure) {
    failure("we wanted it to");
  }
];

myAwesomeQueue.jobSucceeds(function(wait) {
  console.log("waited " + wait + " ms");
  if (myAwesomeWork.length > 0) {
    myAwesomeQueue.add(myAwesomeWork.shift());
  }
});
myAwesomeQueue.jobFails(function(reason) {
  console.log("a job failed because " + reason);
});

//note that only 2 jobs are queued initially. If you increase the
// activeJobsLimit from 2, then add more jobs to the queue from the start
myAwesomeQueue.add(myAwesomeWork.shift());
myAwesomeQueue.add(myAwesomeWork.shift());
myAwesomeQueue.start();
