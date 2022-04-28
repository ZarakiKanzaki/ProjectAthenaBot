import { isNullOrEmpty, isNullOrUndefined } from "../src/common/Utility";

describe('is null or undefined function', () => {

    it('passing a undefined element will return true', () => {
        let element;
        expect(isNullOrUndefined(element)).toBe(true);
    });

    it('passing a null element will return true', () => {
        let element = null;
        expect(isNullOrUndefined(element)).toBe(true);
    });

    it('passing a non-null element will return true', () => {
        let element = '';
        expect(isNullOrUndefined(element)).toBe(true);
    });

    it('passing an empty string will return true', () => {
        let element = '';
        expect(isNullOrEmpty(element)).toBe(true);
    });

    it('passing an undefined string will return true', () => {
        let element;
        expect(isNullOrEmpty(element)).toBe(true);
    });

});