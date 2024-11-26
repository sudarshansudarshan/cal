/**
 * @fileoverview Common drawing routines for our demos.
 */

/**
 * Represents a normalized rectangle. Has an ID that should be consistent
 * across calls.
 */
export declare interface NormalizedRect {
  xCenter: number;
  yCenter: number;
  height: number;
  width: number;
  rotation: number;
}

/**
 * Represents a single normalized landmark.
 */
export declare interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Data that a user can use to specialize drawing options.
 */
export interface Data {
  index?: number;
  from?: NormalizedLandmark;
  to?: NormalizedLandmark;
}

/**
 * Represents pairs of (start,end) indexes so that we can connect landmarks
 * with lines to provide a skeleton when we draw the points. These are defined
 * within each specific solution, but a common definition is held here for
 * convenience.
 */
export type LandmarkConnectionArray = Array<[number, number]>;

/**
 * One list of landmarks.
 */
export type NormalizedLandmarkList = NormalizedLandmark[];

/**
 * Multiple lists of landmarks.
 */
export type NormalizedLandmarkListList = NormalizedLandmarkList[];

/**
 * Simple function template.
 */
export type Fn<I, O> = (input: I) => O;

/**
 * Options for customizing the drawing routines. Anything the user does not
 * fill out will be assigned a default value.
 */
export declare interface DrawingOptions {
  color?: string|CanvasGradient|CanvasPattern|
      Fn<Data, string|CanvasGradient|CanvasPattern>;
  fillColor?: string|CanvasGradient|CanvasPattern|
      Fn<Data, string|CanvasGradient|CanvasPattern>;
  lineWidth?: number|Fn<Data, number>;
  radius?: number|Fn<Data, number>;
  visibilityMin?: number;
}

/**
 * Restricts a number between two endpoints (order doesn't matter).
 */
export function clamp(x: number, x0: number, x1: number): number;

/**
 * Linearly interpolates a value between two points, clamping that value to the
 * endpoints.
 */
export function lerp(
    x: number, x0: number, x1: number, y0: number, y1: number): number;

/**
 * Draws circles onto the provided landmarks.
 */
export declare function drawLandmarks(
    ctx: CanvasRenderingContext2D, landmarks?: NormalizedLandmarkList,
    style?: DrawingOptions): void;

/**
 * Draws lines between landmarks (given a connection graph).
 */
export declare function drawConnectors(
    ctx: CanvasRenderingContext2D, landmarks?: NormalizedLandmarkList,
    connections?: LandmarkConnectionArray, style?: DrawingOptions): void;

/**
 * Draws a filled rectangle that can be rotated.
 */
export declare function drawRectangle(
    ctx: CanvasRenderingContext2D, rect: NormalizedRect,
    style?: DrawingOptions): void;
