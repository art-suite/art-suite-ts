const { abs } = Math;

const float64Precision = 4e-16;
const float32Precision = 4e-7;
const onePlusFloat64Precision = 1 + float64Precision;
const onePlusFloat32Precision = 1 + float32Precision;

export const float32Eq = (n1: number, n2: number): boolean => {
  // handle exact equality fast
  if (n1 === n2) return true;

  // if signs are different, they can't be equal (except for zero cases handled by abs diff)
  if ((n1 > 0) !== (n2 > 0)) return abs(n1 - n2) < float32Precision;

  // if absolute difference is small enough, consider equal
  if (abs(n1 - n2) < float32Precision) return true;

  // For larger numbers, use relative precision comparison
  const abs1 = abs(n1);
  const abs2 = abs(n2);
  return (abs1 * onePlusFloat32Precision > abs2) && (abs2 * onePlusFloat32Precision > abs1);
};

export const float64Eq = (n1: number, n2: number): boolean => {
  // handle exact equality fast
  if (n1 === n2) return true;

  // if signs are different, they can't be equal (except for zero cases handled by abs diff)
  if ((n1 > 0) !== (n2 > 0)) return abs(n1 - n2) < float64Precision;

  // if absolute difference is small enough, consider equal
  if (abs(n1 - n2) < float64Precision) return true;

  // For larger numbers, use relative precision comparison
  const abs1 = abs(n1);
  const abs2 = abs(n2);
  return (abs1 * onePlusFloat64Precision > abs2) && (abs2 * onePlusFloat64Precision > abs1);
};

export const float32Gte = (a: number, b: number): boolean =>
  a >= b || float32Eq(a, b);

export const float32Lte = (a: number, b: number): boolean =>
  a <= b || float32Eq(a, b);

export const float32Gt = (a: number, b: number): boolean =>
  a > b && !float32Eq(a, b);

export const float32Lt = (a: number, b: number): boolean =>
  a < b && !float32Eq(a, b);

export const float64Gte = (a: number, b: number): boolean =>
  a >= b || float64Eq(a, b);

export const float64Lte = (a: number, b: number): boolean =>
  a <= b || float64Eq(a, b);

export const float64Gt = (a: number, b: number): boolean =>
  a > b && !float64Eq(a, b);

export const float64Lt = (a: number, b: number): boolean =>
  a < b && !float64Eq(a, b);

export const floatEq0 = (n: number): boolean =>
  n === 0 || float64Precision > abs(n);

export const float32Eq0 = (n: number): boolean =>
  n === 0 || float32Precision > abs(n);

export const floatTrue0 = (n: number): number =>
  n === 0 || float64Precision > abs(n) ? 0 : n;

export const float32True0 = (n: number): number =>
  n === 0 || float32Precision > abs(n) ? 0 : n;
