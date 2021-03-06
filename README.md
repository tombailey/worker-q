# worker q

## Introduction

This is a Node.js based module for queuing asynchronous work.


Disclaimer: Please don't share WorkerQ objects across threads; actions are not
designed to be thread safe!

## Dependencies

None (it uses setTimeout() for async)

## Examples

Do an npm install worker-q.

```javascript
var WorkerQ = require("worker-q");

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
```

## License

Apache 2
