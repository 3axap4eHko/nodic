function keys(data) {
  return Object.keys(data);
}

function values(data) {
  return keys(data).map(key => data[key]);
}

function pairs(data) {
  return keys(data).map(key => ({ key, value: data[key] }));
}


function create(Constructor, args) {
  Constructor = Function.prototype.bind.apply(Constructor, [null, ...args]);
  return new Constructor();
}

function defineGetter(object, property, getter) {
  return Object.defineProperty(object, property, {
    enumerable: false,
    configurable: false,
    get: getter
  });
}

function isFunction(value) {
  return typeof value === 'function';
}

function isNotEmptyString(value) {
  return typeof value === 'string' && value.length !== 0;
}

function isStructure(value) {
  return typeof value === 'object' && value != null;
}

function getInstance(service, args) {
  if (isFunction(service.factory)) {
    return service.factory(...args);
  }
  if (isFunction(service.classOf)) {
    return create(service.classOf, args);
  }
  throw new Error(`Cannot create instance for '${service.name}'`);
}

const _Services = Symbol('services');

export function createService(name, { classOf = null, factory = null, shared = true, instance = null, args = [], tags = [] } = {}) {
  if (!isNotEmptyString(name)) {
    throw new Error(`Service name should be a not empty string but '${name}' given`);
  }
  const properties = {
    name,
    classOf,
    factory,
    shared,
    instance
  };
  if (!isStructure(args)) {
    properties.args = [args];
  } else {
    properties.args = Array.from(args || []);
  }
  properties.tags = Array.from(tags || []);
  return {
    get name() {
      return properties.name;
    },
    get classOf() {
      return properties.classOf;
    },
    get factory() {
      return properties.factory;
    },
    get args() {
      return properties.args;
    },
    get tags() {
      return properties.tags;
    },
    get shared() {
      return properties.shared;
    },
    set shared(value) {
      properties.shared = value;
    },
    get instance() {
      return properties.instance;
    },
    set instance(value) {
      properties.instance = value;
    }
  };
}

export class DI {
  constructor() {
    this[_Services] = {};
  }

  proxifyService(target, serviceName) {
    const serviceKey = `$${serviceName}`;
    if (!(serviceKey in target)) {
      defineGetter(target, serviceKey, () => this.get(serviceName));
    }
    return this;
  }

  has(name) {
    return name in this[_Services];
  }

  register(name, options) {
    if (typeof name === 'object') {
      options = name;
      name = options.name;
    }
    this.proxifyService(this, name);
    this[_Services][name] = createService(name, options);

    return this[_Services][name];
  }

  set(name, instance, options) {
    const service = createService(name, options);
    service.instance = instance;
    service.shared = true;
    this[_Services][name] = service;
    this.proxifyService(this, name);

    return instance;
  }

  get(name, args) {
    if (!this.has(name)) {
      throw new Error(`Service '${name}' not defined`);
    }
    return this.resolveService(this[_Services][name], args);
  }

  find(callback) {
    return pairs(this[_Services]).filter(({ key, value }) => callback(value, key));
  }

  findFirst(callback) {
    return pairs(this[_Services]).find(({ key, value }) => callback(value, key));
  }

  resolveService(service, args) {
    if (service.shared && service.instance) {
      return service.instance;
    }
    const resolvedArgs = values(args || service.args || []).map(this.resolveArg, this);
    const instance = getInstance(service, resolvedArgs);
    if (service.shared) {
      service.instance = instance;
    }
    return instance;
  }

  resolveArg(arg) {
    const serviceArg = (arg || '').toString();
    return !serviceArg.indexOf('$') ? this.get(serviceArg.substr(1)) : arg;
  }

  get services() {
    return keys(this[_Services]);
  }
}
