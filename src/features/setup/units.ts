/** Canonical units are always metric in storage and calculations. */

export type UnitSystem = 'metric' | 'imperial';

const LB_PER_KG = 2.2046226218;
const IN_PER_CM = 0.3937007874;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function cmToIn(cm: number): number {
  return cm * IN_PER_CM;
}

export function inToCm(inches: number): number {
  return inches / IN_PER_CM;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cmToIn(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round((totalInches - feet * 12) * 10) / 10;
  return { feet, inches };
}

export function ftInToCm(feet: number, inches: number): number {
  return inToCm(feet * 12 + inches);
}

/** Display weight in the user's preferred system from canonical kg. */
export function formatWeight(kg: number, units: UnitSystem, digits = 1): string {
  if (units === 'imperial') {
    return `${kgToLb(kg).toFixed(digits)} lb`;
  }
  return `${kg.toFixed(digits)} kg`;
}

export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const { feet, inches } = cmToFtIn(cm);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function ageFromBirthDate(birthDate: string, today = new Date()): number {
  const born = new Date(`${birthDate}T00:00:00`);
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age -= 1;
  }
  return age;
}

/** Approximate birth date from integer age (used when the UI collects age, not DOB). */
export function birthDateFromAge(age: number, today = new Date()): string {
  const year = today.getFullYear() - Math.floor(age);
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
