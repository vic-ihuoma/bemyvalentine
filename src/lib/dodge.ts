import { DODGE_PROXIMITY_THRESHOLD } from "./config";

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export function getDistance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function shouldDodge(cursor: Point, buttonCenter: Point): boolean {
  return getDistance(cursor, buttonCenter) < DODGE_PROXIMITY_THRESHOLD;
}

export function calculateDodgePosition(
  cursor: Point,
  buttonCenter: Point,
  buttonSize: { width: number; height: number },
  viewport: Bounds,
): Point {
  const dx = buttonCenter.x - cursor.x;
  const dy = buttonCenter.y - cursor.y;
  const baseAngle = Math.atan2(dy, dx);

  // Add random spread: pick a random angle within +-90 degrees of the away direction
  // This ensures it always moves away from cursor but in varied directions
  const randomSpread = (Math.random() - 0.5) * Math.PI;
  const angle = baseAngle + randomSpread;

  const dodgeDistance = DODGE_PROXIMITY_THRESHOLD + 150 + Math.random() * 150;
  let newX = buttonCenter.x + Math.cos(angle) * dodgeDistance;
  let newY = buttonCenter.y + Math.sin(angle) * dodgeDistance;

  const margin = 20;
  const halfW = buttonSize.width / 2;
  const halfH = buttonSize.height / 2;

  const minX = margin + halfW;
  const maxX = viewport.width - margin - halfW;
  const minY = margin + halfH;
  const maxY = viewport.height - margin - halfH;

  // Wrap to opposite side if out of bounds
  if (newX < minX) newX = maxX;
  else if (newX > maxX) newX = minX;

  if (newY < minY) newY = maxY;
  else if (newY > maxY) newY = minY;

  return { x: newX, y: newY };
}
