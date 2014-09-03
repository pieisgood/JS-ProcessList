JS-ProcessList
==============

A small process pattern


ProcessList is meant to be used within a larger framework that sends the updated milliseconds between frames of a videogame

How to:

Create a ProcessList :
```javascript
var ExampleList = new ProcessList();
```

Create a Process :
```javascript
var ExampleProcess = new Process();
```

OverRide Process functions :
```javascript
ExampleProcess.OnUpdate = function ( msDelta ) {
  //some functional code here
  };
```

Run your processes :
```javascript
ExampleList.UpdateProcesses( some_delta );
```
