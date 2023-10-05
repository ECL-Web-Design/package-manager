import { ColorRGB, Coord3D, PointCirclePosition, PointLinePosition } from "../types/helpers.types.ts";
import { LineMotion } from "../types/helpers.types.ts";
export declare function clamp(val: number, min: number, max: number): number;
export declare function loop(value: number, min: number, max: number): number;
export declare function loopInclusive(value: number, min: number, max: number): number;
export declare function getRandomInt(min: number, max: number): number;
export declare function squaredDistance(x1: number, x2: number, y1: number, y2: number): number;
export declare function pointDistance(x1: number, y1: number, x2: number, y2: number): number;
export declare function deepClone(obj: object): any;
export declare function randomRange(min: number, max: number): number;
export declare function randomInt(min: number, max: number): number;
export declare function getElementCentre(el: HTMLElement): {
    x: number;
    y: number;
};
export declare function pointPositionOnCircle(centreX: number, centreY: number, pointX: number, pointY: number, radius: number, edgeWidth?: number, edgeModifier?: number): {
    position: PointCirclePosition;
    distance: number;
};
export declare function pointPositionOnLine(linePosition: number, pointX: number, pointY: number, lineMotionDirection: LineMotion, edgeWidth?: number): {
    position: PointLinePosition;
    edgeDistance: number;
} | {
    position: PointLinePosition;
    edgeDistance?: undefined;
};
export declare function sleep(ms: number): Promise<void>;
export declare function stepValueToValue(value: number, stepTo: number, step: number, taper?: boolean): number;
export declare function coord3DMultiply(coord: Coord3D, multiplier: number): Coord3D;
export declare function coord3DAdd(coord: Coord3D, addition: number): Coord3D;
export declare function coord3DSubtract(coord: Coord3D, subtraction: number): Coord3D;
export declare function coord3DDivide(coord: Coord3D, divider: number): Coord3D;
export declare function stepCoord3DToValue(vec: Coord3D, { x: stepX, y: stepY, z: stepZ }: Coord3D, { x: valueX, y: valueY, z: valueZ }: Coord3D, { x: reverseX, y: reverseY, z: reverseZ }?: {
    x: boolean;
    y: boolean;
    z: boolean;
}, taper?: boolean): void;
export declare function isMouseEventWithinElement(event: MouseEvent, element: HTMLElement): boolean;
export declare function scaleCoordToGrid(coordX: number, coordY: number, cellSize: number): {
    x: number;
    y: number;
};
export declare function colourAdd(color: ColorRGB, addition: ColorRGB): void;
export declare function hexToRgb(hex: string): ColorRGB;
export declare function hexToNormalisedRgb(hex: string): ColorRGB;
export declare function numToHex(num: number): string;
export declare function rgbToHex(color: ColorRGB): string;
export declare function linearInterpCellFromAngle(angleDeg: number, cellX: number, cellY: number, gridWidth: number, gridHeight: number): number;
export declare function createSteppedArray(startFrom: number, endAt: number, step: number): number[];
export declare function objectFieldByString(object: any, fieldString: string): any;
