import { describe, expect, it } from 'vitest';
import {
  float32Eq,
  float32Eq0,
  float32Gt,
  float32Gte,
  float32Lt,
  float32Lte,
  float32True0,
  float64Eq,
  float64Gt,
  float64Gte,
  float64Lt,
  float64Lte,
  floatEq0,
  floatTrue0,
} from '../Equality';

describe('Equality', () => {
  describe('float32Eq', () => {
    it('should return true for identical numbers', () => {
      expect(float32Eq(1.0, 1.0)).toBe(true);
      expect(float32Eq(0.0, 0.0)).toBe(true);
      expect(float32Eq(-1.0, -1.0)).toBe(true);
    });

    it('should return true for numbers within float32 precision', () => {
      expect(float32Eq(1.0, 1.0 + 1e-8)).toBe(true);
      expect(float32Eq(100.0, 100.0 + 1e-5)).toBe(true);
      expect(float32Eq(-50.0, -50.0 - 1e-6)).toBe(true);
    });

    it('should return false for numbers outside float32 precision', () => {
      expect(float32Eq(1.0, 1.1)).toBe(false);
      expect(float32Eq(0.0, 0.1)).toBe(false);
      expect(float32Eq(-1.0, 1.0)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(float32Eq(Infinity, Infinity)).toBe(true);
      expect(float32Eq(-Infinity, -Infinity)).toBe(true);
      expect(float32Eq(Infinity, -Infinity)).toBe(false);
      expect(float32Eq(NaN, NaN)).toBe(false); // NaN !== NaN
    });
  });

  describe('float64Eq', () => {
    it('should return true for identical numbers', () => {
      expect(float64Eq(1.0, 1.0)).toBe(true);
      expect(float64Eq(0.0, 0.0)).toBe(true);
      expect(float64Eq(-1.0, -1.0)).toBe(true);
    });

    it('should return true for numbers within float64 precision', () => {
      expect(float64Eq(1.0, 1.0 + 1e-17)).toBe(true);
      expect(float64Eq(100.0, 100.0 + 1e-14)).toBe(true);
      expect(float64Eq(-50.0, -50.0 - 1e-15)).toBe(true);
    });

    it('should return false for numbers outside float64 precision', () => {
      expect(float64Eq(1.0, 1.0001)).toBe(false);
      expect(float64Eq(0.0, 0.001)).toBe(false);
      expect(float64Eq(-1.0, 1.0)).toBe(false);
    });

    it('should be more precise than float32Eq', () => {
      const diff = 1e-10;
      expect(float32Eq(1.0, 1.0 + diff)).toBe(true);
      expect(float64Eq(1.0, 1.0 + diff)).toBe(false);
    });
  });

  describe('float32 comparison functions', () => {
    describe('float32Gte', () => {
      it('should return true when a > b', () => {
        expect(float32Gte(2.0, 1.0)).toBe(true);
      });

      it('should return true when a equals b within precision', () => {
        expect(float32Gte(1.0, 1.0 + 1e-8)).toBe(true);
      });

      it('should return false when a < b', () => {
        expect(float32Gte(1.0, 2.0)).toBe(false);
      });
    });

    describe('float32Lte', () => {
      it('should return true when a < b', () => {
        expect(float32Lte(1.0, 2.0)).toBe(true);
      });

      it('should return true when a equals b within precision', () => {
        expect(float32Lte(1.0 + 1e-8, 1.0)).toBe(true);
      });

      it('should return false when a > b', () => {
        expect(float32Lte(2.0, 1.0)).toBe(false);
      });
    });

    describe('float32Gt', () => {
      it('should return true when a > b and not equal', () => {
        expect(float32Gt(2.0, 1.0)).toBe(true);
      });

      it('should return false when a equals b within precision', () => {
        expect(float32Gt(1.0, 1.0 + 1e-8)).toBe(false);
      });

      it('should return false when a < b', () => {
        expect(float32Gt(1.0, 2.0)).toBe(false);
      });
    });

    describe('float32Lt', () => {
      it('should return true when a < b and not equal', () => {
        expect(float32Lt(1.0, 2.0)).toBe(true);
      });

      it('should return false when a equals b within precision', () => {
        expect(float32Lt(1.0 + 1e-8, 1.0)).toBe(false);
      });

      it('should return false when a > b', () => {
        expect(float32Lt(2.0, 1.0)).toBe(false);
      });
    });
  });

  describe('float64 comparison functions', () => {
    describe('float64Gte', () => {
      it('should return true when a > b', () => {
        expect(float64Gte(2.0, 1.0)).toBe(true);
      });

      it('should return true when a equals b within precision', () => {
        expect(float64Gte(1.0, 1.0 + 1e-17)).toBe(true);
      });

      it('should return false when a < b', () => {
        expect(float64Gte(1.0, 2.0)).toBe(false);
      });
    });

    describe('float64Lte', () => {
      it('should return true when a < b', () => {
        expect(float64Lte(1.0, 2.0)).toBe(true);
      });

      it('should return true when a equals b within precision', () => {
        expect(float64Lte(1.0 + 1e-17, 1.0)).toBe(true);
      });

      it('should return false when a > b', () => {
        expect(float64Lte(2.0, 1.0)).toBe(false);
      });
    });

    describe('float64Gt', () => {
      it('should return true when a > b and not equal', () => {
        expect(float64Gt(2.0, 1.0)).toBe(true);
      });

      it('should return false when a equals b within precision', () => {
        expect(float64Gt(1.0, 1.0 + 1e-17)).toBe(false);
      });

      it('should return false when a < b', () => {
        expect(float64Gt(1.0, 2.0)).toBe(false);
      });
    });

    describe('float64Lt', () => {
      it('should return true when a < b and not equal', () => {
        expect(float64Lt(1.0, 2.0)).toBe(true);
      });

      it('should return false when a equals b within precision', () => {
        expect(float64Lt(1.0 + 1e-17, 1.0)).toBe(false);
      });

      it('should return false when a > b', () => {
        expect(float64Lt(2.0, 1.0)).toBe(false);
      });
    });
  });

  describe('zero equality functions', () => {
    describe('floatEq0', () => {
      it('should return true for exact zero', () => {
        expect(floatEq0(0.0)).toBe(true);
      });

      it('should return true for numbers within float64 precision of zero', () => {
        expect(floatEq0(1e-17)).toBe(true);
        expect(floatEq0(-1e-17)).toBe(true);
      });

      it('should return false for numbers outside precision', () => {
        expect(floatEq0(0.001)).toBe(false);
        expect(floatEq0(-0.001)).toBe(false);
      });
    });

    describe('float32Eq0', () => {
      it('should return true for exact zero', () => {
        expect(float32Eq0(0.0)).toBe(true);
      });

      it('should return true for numbers within float32 precision of zero', () => {
        expect(float32Eq0(1e-8)).toBe(true);
        expect(float32Eq0(-1e-8)).toBe(true);
      });

      it('should return false for numbers outside precision', () => {
        expect(float32Eq0(0.001)).toBe(false);
        expect(float32Eq0(-0.001)).toBe(false);
      });

      it('should be less precise than floatEq0', () => {
        const smallValue = 1e-10;
        expect(float32Eq0(smallValue)).toBe(true);
        expect(floatEq0(smallValue)).toBe(false);
      });
    });
  });

  describe('true zero functions', () => {
    describe('floatTrue0', () => {
      it('should return 0 for exact zero', () => {
        expect(floatTrue0(0.0)).toBe(0);
      });

      it('should return 0 for numbers within float64 precision of zero', () => {
        expect(floatTrue0(1e-17)).toBe(0);
        expect(floatTrue0(-1e-17)).toBe(0);
      });

      it('should return the original number for values outside precision', () => {
        expect(floatTrue0(0.001)).toBe(0.001);
        expect(floatTrue0(-0.001)).toBe(-0.001);
        expect(floatTrue0(1.5)).toBe(1.5);
      });
    });

    describe('float32True0', () => {
      it('should return 0 for exact zero', () => {
        expect(float32True0(0.0)).toBe(0);
      });

      it('should return 0 for numbers within float32 precision of zero', () => {
        expect(float32True0(1e-8)).toBe(0);
        expect(float32True0(-1e-8)).toBe(0);
      });

      it('should return the original number for values outside precision', () => {
        expect(float32True0(0.001)).toBe(0.001);
        expect(float32True0(-0.001)).toBe(-0.001);
        expect(float32True0(1.5)).toBe(1.5);
      });

      it('should be less precise than floatTrue0', () => {
        const smallValue = 1e-10;
        expect(float32True0(smallValue)).toBe(0);
        expect(floatTrue0(smallValue)).toBe(smallValue);
      });
    });
  });

  describe('precision edge cases', () => {
    it('should handle very large numbers correctly', () => {
      const large = 1e20;
      expect(float32Eq(large, large + 1e12)).toBe(true);
      expect(float64Eq(large, large + 1e4)).toBe(true);
    });

    it('should handle very small numbers correctly', () => {
      const small = 1e-20;
      expect(float64Eq(small, small + 1e-36)).toBe(true);
      expect(float32Eq(small, small)).toBe(true);
    });

    it('should handle negative numbers correctly', () => {
      expect(float32Eq(-1.0, -1.0 - 1e-8)).toBe(true);
      expect(float64Eq(-100.0, -100.0 - 1e-15)).toBe(true);
    });
  });
});
