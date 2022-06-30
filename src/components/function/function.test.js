import {testfunction, testfunction2} from "./function";

jest.mock('./function')

it('testfunction should be mocked', function () {
    testfunction()
    testfunction2()
});