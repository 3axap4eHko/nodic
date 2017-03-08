# NoDIC
Service Container for browser an node

## Install
 $ npm install nodic
 
## Reference

`service` is object contains following properties:
 - name     - service name
 - classOf  - service class object
 - factory  - service factory function
 - args     - array of service constructor or factory arguments
 - tags     - service tags
 - shared   - is service shared or every time should be instantiated
 - instance - instance of service target

`createService(name, options)` - creates service from provided arguments
``` javascript
var service = DI.createService('myService', {classOf: Array, args: [[1,2,3,4,5]], tags: ['array']});
```
`proxifyService(target, serviceName)` - proxify `target` properties starts from `$` sign to service getter
```
var target = {$myService: null};
DI.proxifyService(target, 'myService');
console.log(target.$myService); // [1,2,3,4,5]
```
`has (name)` - returns true if service exists
`register (name, options)` - register new service with `name` and `options`
`set (name, instance, options)` - set service with name `name` provided `instance` and `options`
`get (name, args)` - returns service instance by `name` if service does not exists create with arguments `args`
`find(callback)` - returns all services where `callback` returns true
`findFirst (callback)` - return first service on `callback` returns true
`resolveService(service, args)` - resolves service `service` with arguments `args` and returns `instance`
`resolveArg (arg)` - returns service instance with name `arg` or `arg`
`services` - list of services names

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2015-present Ivan Zakharchenko