import { factory, merge } from 'yyf-core/reflection';
import DI from '../src';
import TestService from './TestService';

describe('DI test suite:', function () {
  const di = new DI();
  it('DI Manager should be instanced', function () {
    (di instanceof DI).should.be.true();
  });
  describe('Manual service creation:', function () {

    it('Service should have a not empty string name', function () {
      (() => DI.createService('test')).should.not.throw();
      (() => DI.createService()).should.throw();
      (() => DI.createService(1234)).should.throw();
      (() => DI.createService('')).should.throw();
    });

    it('Service should have a default values', function () {
      const service = DI.createService('test');
      service.should.have.property('classOf', null);
      service.should.have.property('factory', null);
      service.should.have.property('instance', null);
      service.should.have.property('shared', true);
      service.args.should.deepEqual([]);
      service.tags.should.deepEqual([]);
    });

    it('Service should have a factory or constructor or shared instance for resolving', function () {

      (() => DI.createService('test').resolve(di))
        .should.throw();

      const args = [1, 2, 3, 4, 5];

      (() => {
        const service = DI.createService('test_class', { classOf: Array, args });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();

      (() => {
        const service = DI.createService('test_factory', { factory: factory(Array.prototype.constructor), args });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();

      (() => {
        const service = DI.createService('test_instance', { instance: args });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();
    });

    it('Service should have a factory or constructor or shared instance as module name for resolving', function () {
      const args = [1, 2, 3, 4, 5];
      (() => {
        const service = DI.createService('test_class', { classOf: TestService, args: args });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();

      (() => {
        const service = DI.createService('test_factory', { factory: TestService.Factory, args: args });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();

      (() => {
        const service = DI.createService('test_instance', { instance: TestService.Array });
        di.resolveService(service).join().should.equal(args.join());
      }).should.not.throw();
    });
  });

  describe('DI Manager should register services:', function () {
    const baseOptions = {
      classOf: Array.prototype.constructor,
      factory: factory(Array.prototype.constructor),
      tags: ['array']
    };
    it('Register empty array factory', function () {
      const options = merge({}, baseOptions),
        service = di.register('empty_array', baseOptions);

      service.should.have.property('factory', options.factory);
      service.args.should.not.be.undefined();
      service.should.have.property('instance', null);
    });
    it('Register empty array 10 length factory', function () {
      const options = merge({ args: [10] }, baseOptions),
        service = di.register('empty_array_10', options);

      service.should.have.property('factory', options.factory);
      service.args[0].should.equal(10);
      service.should.have.property('instance', null);
    });
    it('Register filled array 10 length factory', function () {
      const options = merge({ args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] }, baseOptions),
        service = di.register('filled_array_10', options);

      service.should.have.property('factory', options.factory);
      Object.keys(service.args).length.should.equal(10);
      service.should.have.property('instance', null);
    });
    it('Register array of other services factory', function () {
      const options = merge({ args: ['$empty_array', '$empty_array_10', '$filled_array_10'] }, baseOptions),
        service = di.register('filled_array_service', options);

      service.should.have.property('factory', options.factory);
      service.args[0].should.equal('$empty_array');
      service.args[1].should.equal('$empty_array_10');
      service.args[2].should.equal('$filled_array_10');
      service.should.have.property('instance', null);
    });
    it('Register array services factory as factory', function () {
      const options = merge({
          args: ['$empty_array', '$empty_array_10', '$filled_array_10'],
          shared: false
        }, baseOptions),
        service = di.register('factory_array_service', options);

      service.should.have.property('factory', options.factory);
      service.args[0].should.equal('$empty_array');
      service.args[1].should.equal('$empty_array_10');
      service.args[2].should.equal('$filled_array_10');

      service.should.have.property('instance', null);
      service.shared.should.be.false();
    });
  });

  describe('DI Manager should return services:', function () {
    it('Get array service of other array services', function () {
      const instance = di.get('filled_array_service');
      instance[0].length.should.equal(0);
      instance[1].length.should.equal(10);
      instance[2].length.should.equal(10);
      instance.length.should.equal(3);
    });
    it('Same not factory services should be equals', function () {
      di.$filled_array_service.should.equal(di.$filled_array_service);
    });
    it('Same factory services should not be same', function () {
      di.$factory_array_service.should.not.equal(di.$factory_array_service);
    });
  });

});