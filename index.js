module.exports = Runs

function Runs (queue) {
  if (!(this instanceof Runs)) return new Runs(queue)
  this.manager = {
    index: 0,
    taskIndex: 0,
    tasks: []
  }
  this.manager.queue = queue ? queue.bind(this.manager) : function (task) {
    this.tasks.splice(this.index + this.taskIndex, 0, task)
    this.taskIndex += 1
  }.bind(this.manager)
  this.waiting = -1
}

Runs.prototype.andThen = function (fn) {
  this.manager.queue(fn)
  return this
}

Runs.prototype.wait = function () {
  this.manager.queue({wait:true})
  this.waiting += 1
  return this
}

Runs.prototype.resume = function () {
  var self = this
  this.waiting -= 1
  if (this.waiting < 1) {
    setImmediate(function () {
      self.run()
    })
  }
  return this
}

Runs.prototype.cancel = function () {
  this.manager.queue({cancel:true})
  return this
}

Runs.prototype.run = function (done) {
  var self = this
  if (!done) done = this._lastDone
  this._lastDone = done

  var task = this.manager.tasks[this.manager.index]
  this.manager.index += 1
  this.manager.taskIndex = 0

  // If no tasks left or cancelled, reset the state
  if (!task || task.cancel) {
    this.manager.index = 0
    if (typeof done === 'function') done()
    return this
  }

  // If we need to wait
  if (task.wait) return this

  // Run the task
  task()

  // Schedule the next to run
  setImmediate(function () {
    self.run(done)
  })

  return this
}
