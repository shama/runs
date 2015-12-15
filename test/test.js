const Runs = require('../index.js')
const test = require('tape')

test('runs in sequence', function (t) {
  t.plan(5)
  var r = new Runs()
  var count = 0
  function countEquals (n) {
    t.equal(count, n, 'count equals ' + n)
    count++
  }
  r.andThen(function () {
    countEquals(0)
    r.andThen(function () {
      countEquals(1)
    })
    r.andThen(function () {
      countEquals(2)
    })
  })
  r.andThen(function () {
    countEquals(3)
  })
  r.run(function () {
    countEquals(4)
    t.end()
  })
})

test('runs with wait/resume', function (t) {
  t.plan(6)
  var r = new Runs()
  var count = 0
  function countEquals (n) {
    t.equal(count, n, 'count equals ' + n)
    count++
  }
  r.andThen(function () {
    r.wait()
    setTimeout(function () {
      countEquals(0)
      r.resume()
    }, 100)
    r.andThen(function () {
      countEquals(1)
    })
  })
  r.andThen(function () {
    r.wait()
    setTimeout(function () {
      countEquals(2)
      r.resume()
    }, 100)
    r.wait()
    setTimeout(function () {
      countEquals(3)
      r.resume()
    }, 100)
  })
  r.andThen(function () {
    countEquals(4)
  })
  r.run(function () {
    countEquals(5)
    t.end()
  })
})

test('runs and then cancels', function (t) {
  t.plan(1)
  var r = new Runs()
  var count = 0
  r.andThen(function () {
    count++
    r.wait()
    setTimeout(function () {
      count++
      r.resume()
    }, 100)
    r.cancel()
  })
  r.andThen(function () {
    t.fail('it should have canceled before getting here')
  })
  r.run(function () {
    t.equals(count, 2)
    t.end()
  })
})

test('runs with custom queue manager', function (t) {
  t.plan(1)
  var r = new Runs(function (task) {
    // Schedule every task twice
    this.tasks.splice(this.index + this.taskIndex, 0, task)
    this.taskIndex += 1
    this.tasks.splice(this.index + this.taskIndex, 0, task)
    this.taskIndex += 1
  })
  var count = 0
  r.andThen(function () {
    count++
  })
  r.andThen(function () {
    count++
  })
  r.andThen(function () {
    count++
  })
  r.run(function () {
    t.equal(count, 6, 'equals 6 after running each twice')
    t.end()
  })
})
