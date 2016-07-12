function WorkerQ(activeJobsLimit) {
  if (activeJobsLimit === undefined) {
    console.log("defaulted to activeJobsLimit to 3");
    activeJobsLimit = 3;
  } else {
    //check activeJobsLimit > 0; throw exception otherwise?
  }

  var currentJobs = 0;
  var running = false;
  var jobs = [];
  var jobSuccessCb;
  var jobFailureCb;

  var successCb = function() {
    currentJobs--;
    if (shouldStartAnotherJob()) {
      startAnotherJob();
    }

    jobSuccessCb.apply(null, arguments);
  };
  var failCb = function() {
    currentJobs--;
    if (shouldStartAnotherJob()) {
      startAnotherJob();
    }

    jobFailureCb.apply(null, arguments);
  };
  var shouldStartAnotherJob = function() {
    return running && currentJobs < activeJobsLimit && jobs.length > 0;
  };
  var startAnotherJob = function() {
    var job = jobs.shift();
    //should we do a try catch here to report what would otherwise be silent
    // errors?
    setTimeout(job, 0, successCb, failCb);
    currentJobs++;
  };

  this.add = function(callback) {
    jobs.push(callback);
    if (shouldStartAnotherJob()) {
      startAnotherJob();
    }
  };
  this.start = function() {
    running = true;

    while (shouldStartAnotherJob()) {
      startAnotherJob();
    }
  };
  this.stop = function() {
    running = false;
  };
  this.jobSucceeds = function(cb) {
    jobSuccessCb = cb;
  };
  this.jobFails = function(cb) {
    jobFailureCb = cb;
  };
}

module.exports = WorkerQ;
