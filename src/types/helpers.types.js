export var LineMotion;
(function (LineMotion) {
    LineMotion[LineMotion["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
    LineMotion[LineMotion["BOTTOM_TOP"] = 1] = "BOTTOM_TOP";
    LineMotion[LineMotion["LEFT_RIGHT"] = 2] = "LEFT_RIGHT";
    LineMotion[LineMotion["RIGHT_LEFT"] = 3] = "RIGHT_LEFT";
})(LineMotion || (LineMotion = {}));
export var PointCirclePosition;
(function (PointCirclePosition) {
    PointCirclePosition[PointCirclePosition["INSIDE"] = 0] = "INSIDE";
    PointCirclePosition[PointCirclePosition["ON_EDGE"] = 1] = "ON_EDGE";
    PointCirclePosition[PointCirclePosition["OUTSIDE"] = 2] = "OUTSIDE";
    PointCirclePosition[PointCirclePosition["UNKNOWN"] = 3] = "UNKNOWN";
})(PointCirclePosition || (PointCirclePosition = {}));
export var PointLinePosition;
(function (PointLinePosition) {
    PointLinePosition[PointLinePosition["BEFORE_EDGE"] = 0] = "BEFORE_EDGE";
    PointLinePosition[PointLinePosition["ON_EDGE"] = 1] = "ON_EDGE";
    PointLinePosition[PointLinePosition["AFTER_EDGE"] = 2] = "AFTER_EDGE";
    PointLinePosition[PointLinePosition["UNKNOWN"] = 3] = "UNKNOWN";
})(PointLinePosition || (PointLinePosition = {}));
