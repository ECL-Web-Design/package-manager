export declare enum LineMotion {
    TOP_BOTTOM = 0,
    BOTTOM_TOP = 1,
    LEFT_RIGHT = 2,
    RIGHT_LEFT = 3
}
export declare enum PointCirclePosition {
    INSIDE = 0,
    ON_EDGE = 1,
    OUTSIDE = 2,
    UNKNOWN = 3
}
export declare enum PointLinePosition {
    BEFORE_EDGE = 0,
    ON_EDGE = 1,
    AFTER_EDGE = 2,
    UNKNOWN = 3
}
export interface Coord3D {
    x?: number;
    y?: number;
    z?: number;
}
export interface ColorRGB {
    r: number;
    g: number;
    b: number;
}
