# runs

A simple run loop.

## install

```shell
npm install runs --save
```

## usage

```js
var r = require('runs')()

r.andThen(function () {
  console.log('first')
})
r.andThen(function () {
  r.wait()
  setTimeout(function () {
    console.log('second')
    r.resume()
  }, 500)
  r.andThen(function () {
    console.log('third')
  })
})
r.andThen(function () {
  console.log('fourth')
})

r.run()
```

## API

### `var createRuns = require('runs')`

#### `var runs = createRuns([customQueue])`

* `customQueue` {Function} File patterns to be matched

#### `runs.andThen(task)`

Schedule a synchronous task in the run loop.

#### `runs.wait()`

Schedule the run loop to wait for a subsequent `resume()` call.

#### `runs.resume()`

Tell the run loop to resume running tasks.

#### `runs.cancel()`

Tell the run loop to cancel the current run.

## License
Copyright (c) 2015 Kyle Robinson Young  
Licensed under the MIT license.
