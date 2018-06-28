# NoDIC

0-dependency Service Container for browser an node

## Install
 $ npm install nodic
 
## Reference

### Service

`service` is an object contains following properties:
 - name     - service name
 - classOf  - service class
 - factory  - service factory function
 - args     - array of service constructor or factory arguments
 - tags     - service tags (array of strings)
 - shared   - is the service shared or every time should be instantiated
 - instance - instance of service target

---
### DI

```
class DI {
    has(name)
    get(name, args)
    set(name, instance, options) {
    injectService(target, serviceName)
    register(name, options)
    find(callback)
    findFirst(callback)
    resolveService(service, args)
    resolveArg(arg)
    services
}
```

`createService(name, options)` - creates service from provided arguments
``` javascript
var service = DI.createService('myService', {classOf: Array, args: [[1,2,3,4,5]], tags: ['array']});
```
`injectService(target, serviceName)` - proxify `target` properties starts from `$` sign to service getter
```
var target = {$myService: null};
DI.injectService(target, 'myService');
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


## Example
``` javascript
import createService, { DI } from 'nodic';

const di = new DI();
const serviceDate = createService('date', { factory: () => new Date(), tags: ['date'] });
const serviceCurDate = createService('currentDate', { factory: () => new Date(), shared: false, tags: ['date'] });

di.register(serviceDate);
di.register(serviceCurDate);

console.log(di.get('date') === di.get('date')); // true
console.log(di.get('currentDate') === di.get('currentDate')); // false
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2015-present Ivan Zakharchenko