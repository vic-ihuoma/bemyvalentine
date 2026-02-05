import { VALENTINE_PASSWORD } from "./config";

export function validatePassword(input: string): boolean {
  return input.trim().toLowerCase() === VALENTINE_PASSWORD;
}

export function shouldShowError(input: string): boolean {
  return (
    input.trim().length >= VALENTINE_PASSWORD.length && !validatePassword(input)
  );
}
