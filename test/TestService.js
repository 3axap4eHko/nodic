'use strict';

export default class TestArray extends Array {

    static Factory(...args) {
        return new TestArray(...args);
    }
}

TestArray.Array = new TestArray(1,2,3,4,5);