/** WebGL2 type declarations for internal use. */

export interface WebGLProgramUniform {
  name: string;
  location: WebGLUniformLocation | null;
  size: number;
  type: number;
}

/** Minimal WebGL2RenderingContext extensions for our usage. */
export interface GLContext extends WebGL2RenderingContext {
  // Extended with our custom methods if needed
}

/** Uniform value types for type-safe uniform setting. */
export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | Float32Array
  | WebGLTexture
  | WebGLBuffer
  | WebGLProgram;