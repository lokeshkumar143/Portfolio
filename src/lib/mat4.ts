/**
 * Minimal column-major 4x4 matrix math — just what the universe scene needs.
 * Using a real projection matrix means the GPU does perspective-correct
 * interpolation, so tilted cards have correctly foreshortened artwork.
 */

export type Mat4 = Float32Array<any>;
export type Vec3 = [number, number, number];
export type Vec2 = [number, number];

/** Create identity matrix. */
export function identity(o: any = new Float32Array(16)): any {
  o.fill(0);
  o[0] = o[5] = o[10] = o[15] = 1;
  return o;
}

/** Create perspective projection matrix. */
export function perspective(
  fovY: number,
  aspect: number,
  near: number,
  far: number,
  o: any = new Float32Array(16)
): any {
  const f = 1 / Math.tan(fovY / 2);
  o.fill(0);
  o[0] = f / aspect;
  o[5] = f;
  o[10] = (far + near) / (near - far);
  o[11] = -1;
  o[14] = (2 * far * near) / (near - far);
  return o;
}

/** Multiply two 4x4 matrices (column-major). */
export function multiply(a: any, b: any, o: any = new Float32Array(16)): any {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4];
    const b1 = b[c * 4 + 1];
    const b2 = b[c * 4 + 2];
    const b3 = b[c * 4 + 3];
    o[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    o[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    o[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    o[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
  return o;
}

/**
 * Model matrix for a card: translate * rotate * scale.
 * Rotation order: Ry * Rx * Rz (yaw, pitch, roll)
 */
export function compose(
  pos: Vec3 | any,
  rot: Vec3 | any,
  scale: Vec2 | any,
  o: any = new Float32Array(16)
): any {
  const [rx, ry, rz] = rot;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);

  // R = Ry * Rx * Rz
  const m00 = cy * cz + sy * sx * sz;
  const m01 = -cy * sz + sy * sx * cz;
  const m02 = sy * cx;
  const m10 = cx * sz;
  const m11 = cx * cz;
  const m12 = -sx;
  const m20 = -sy * cz + cy * sx * sz;
  const m21 = sy * sz + cy * sx * cz;
  const m22 = cy * cx;

  const [sxs, sys] = scale;
  o[0] = m00 * sxs;
  o[1] = m10 * sxs;
  o[2] = m20 * sxs;
  o[3] = 0;
  o[4] = m01 * sys;
  o[5] = m11 * sys;
  o[6] = m21 * sys;
  o[7] = 0;
  o[8] = m02;
  o[9] = m12;
  o[10] = m22;
  o[11] = 0;
  o[12] = pos[0];
  o[13] = pos[1];
  o[14] = pos[2];
  o[15] = 1;
  return o;
}

/**
 * Project a world point to normalised device coords.
 * Returns [x, y, w] where x,y are in NDC (-1..1) and w is clip-space W.
 */
export function projectPoint(mvp: Mat4, x: number, y: number, z: number): [number, number, number] {
  const cx = mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12];
  const cy = mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13];
  const cw = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
  return [cx / cw, cy / cw, cw];
}