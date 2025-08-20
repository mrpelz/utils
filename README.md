# utils

A selection of TypeScript utils.

Monorepo publishing multiple NPM-packages:

* `@mrpelz/misc-utils`  
  miscellaneous TypeScript helpers
  * `data`  
    miscellaneous data conversion helpers
  * `number`  
    number (e.g. from/to binary) conversion helpers
  * `oop`  
    helper-utils for working in object-oriented code
  * `promise`  
    Promise helpers
  * `rolling-numb`er
    cosume and update a number in a given range (e.g. for request IDs)
  * `sleep`  
    Sleep async execution for a given time
  * `string`  
    string conversion helpers
* `@mrpelz/modifiable-date`
  * `epochs`  
    determine the lengths of time periods
  * `modifiable-date`  
    calculate, round with and forward/rewind in time units
* `@mrpelz/observable`
  * `observable`  
    publish and consume message streams or groups of message streams, convert messages in transit
  * `state`  
    handle message streams with certain constrains (e.g. booleans, enum-like) more comfortably
  * `timer`  
    handle deferred tasks
* `@mrpelz/struct`
  * `dynamic`  
    define and encode/decode variable-size C-style structs in TypeScript
  * `static`  
    define and encode/decode static/fixed-size C-style structs in TypeScript
