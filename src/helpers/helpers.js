import { PointCirclePosition, PointLinePosition } from "../types/helpers.types.ts";
import { LineMotion } from "../types/helpers.types.ts";
export function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}
export function loop(value, min, max) {
    if (value > max) {
        return min;
    }
    if (value < min) {
        return max;
    }
    return value;
}
export function loopInclusive(value, min, max) {
    if (value >= max) {
        return min;
    }
    if (value <= min) {
        return max;
    }
    return value;
}
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function squaredDistance(x1, x2, y1, y2) {
    const dx = x1 - x2, dy = y1 - y2;
    return dx * dx + dy * dy;
}
export function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt(squaredDistance(x1, x2, y1, y2));
}
//don't use if object has dates or functions
//data will be cloned but functions will be discarded
export function deepClone(obj) {
    if ('structuredClone' in window) {
        return structuredClone(obj);
    }
    else {
        return JSON.parse(JSON.stringify(obj));
    }
}
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function getElementCentre(el) {
    const { top, left, width, height } = el.getBoundingClientRect();
    return {
        x: left + (width / 2),
        y: top + (height / 2)
    };
}
export function pointPositionOnCircle(centreX, centreY, pointX, pointY, radius, edgeWidth = 2, edgeModifier = 1) {
    const distance = pointDistance(centreX, centreY, pointX, pointY);
    const modifiedEdge = edgeWidth * edgeModifier;
    //check if point is within imaginary band on circles edge
    if (distance >= radius - modifiedEdge && distance <= radius + modifiedEdge) {
        const distanceInEdge = (distance - (radius - modifiedEdge)) / (modifiedEdge * 2);
        return {
            position: PointCirclePosition.ON_EDGE,
            distance: distanceInEdge
        };
    }
    if (distance > radius - modifiedEdge) {
        return {
            position: PointCirclePosition.OUTSIDE,
            distance: distance - radius
        };
    }
    if (distance < radius + modifiedEdge) {
        return {
            position: PointCirclePosition.INSIDE,
            distance: radius - distance
        };
    }
    return {
        position: PointCirclePosition.UNKNOWN,
        distance: -1
    };
}
function getLinePos(value, linePos, edgeWidth, reverse = false) {
    if (value <= linePos + edgeWidth && value >= linePos - edgeWidth) {
        const distanceInEdge = (value - (linePos - edgeWidth)) / (edgeWidth * 2);
        return { position: PointLinePosition.ON_EDGE, edgeDistance: distanceInEdge };
    }
    if (value > linePos + edgeWidth) {
        return reverse ?
            { position: PointLinePosition.BEFORE_EDGE } :
            { position: PointLinePosition.AFTER_EDGE };
    }
    if (value < linePos - edgeWidth) {
        return reverse ?
            { position: PointLinePosition.AFTER_EDGE } :
            { position: PointLinePosition.BEFORE_EDGE };
    }
    return { position: PointLinePosition.UNKNOWN };
}
export function pointPositionOnLine(linePosition, pointX, pointY, lineMotionDirection, edgeWidth = 1.4) {
    switch (lineMotionDirection) {
        case LineMotion.TOP_BOTTOM:
            return getLinePos(pointY, linePosition, edgeWidth);
        case LineMotion.BOTTOM_TOP:
            return getLinePos(pointY, linePosition, edgeWidth, true);
        case LineMotion.LEFT_RIGHT:
            return getLinePos(pointX, linePosition, edgeWidth);
        case LineMotion.RIGHT_LEFT:
            return getLinePos(pointX, linePosition, edgeWidth, true);
    }
}
export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
export function stepValueToValue(value, stepTo, step, taper = false) {
    if (value === stepTo) {
        return value;
    }
    let modStep = step;
    if (taper) {
        const diff = Math.abs(Math.abs(stepTo) - Math.abs(value));
        modStep = clamp(diff, step / 10, 9) * step;
    }
    return value > stepTo ?
        Math.max(value - modStep, stepTo) :
        Math.min(value + modStep, stepTo);
}
export function coord3DMultiply(coord, multiplier) {
    if (coord.x) {
        coord.x *= multiplier;
    }
    if (coord.y) {
        coord.y *= multiplier;
    }
    if (coord.z) {
        coord.z *= multiplier;
    }
    return coord;
}
export function coord3DAdd(coord, addition) {
    if (coord.x) {
        coord.x += addition;
    }
    if (coord.y) {
        coord.y += addition;
    }
    if (coord.z) {
        coord.z += addition;
    }
    return coord;
}
export function coord3DSubtract(coord, subtraction) {
    if (coord.x) {
        coord.x -= subtraction;
    }
    if (coord.y) {
        coord.y -= subtraction;
    }
    if (coord.z) {
        coord.z -= subtraction;
    }
    return coord;
}
export function coord3DDivide(coord, divider) {
    if (coord.x) {
        coord.x /= divider;
    }
    if (coord.y) {
        coord.y /= divider;
    }
    if (coord.z) {
        coord.z /= divider;
    }
    return coord;
}
export function stepCoord3DToValue(vec, { x: stepX, y: stepY, z: stepZ }, { x: valueX, y: valueY, z: valueZ }, { x: reverseX, y: reverseY, z: reverseZ } = { x: false, y: false, z: false }, taper = false) {
    if (stepX && valueX !== undefined && vec.x !== undefined) {
        vec.x = stepValueToValue(vec.x, reverseX ? -valueX : valueX, stepX, taper);
    }
    if (stepY && valueY !== undefined && vec.y !== undefined) {
        vec.y = stepValueToValue(vec.y, reverseY ? -valueY : valueY, stepY, taper);
    }
    if (stepZ && valueZ !== undefined && vec.z !== undefined) {
        vec.z = stepValueToValue(vec.z, reverseZ ? -valueZ : valueZ, stepZ, taper);
    }
}
export function isMouseEventWithinElement(event, element) {
    const rect = element.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    return (mouseX >= rect.left &&
        mouseX <= rect.left + rect.width &&
        mouseY >= rect.top &&
        mouseY <= rect.top + rect.height);
}
//assumes position is inside grid.
//grid must have square cells
export function scaleCoordToGrid(coordX, coordY, cellSize) {
    return {
        x: coordX / cellSize,
        y: coordY / cellSize
    };
}
export function colourAdd(color, addition) {
    color.r += addition.r;
    color.g += addition.g;
    color.b += addition.b;
}
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
export function hexToNormalisedRgb(hex) {
    const rgb = hexToRgb(hex);
    return {
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255
    };
}
export function numToHex(num) {
    const hex = num.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
//convert a rgb color to a hex string
export function rgbToHex(color) {
    const r = clamp(color.r, 0, 255);
    const g = clamp(color.g, 0, 255);
    const b = clamp(color.b, 0, 255);
    return "#" + numToHex(r) + numToHex(g) + numToHex(b);
}
export function linearInterpCellFromAngle(angleDeg, cellX, cellY, gridWidth, gridHeight) {
    const angleRad = angleDeg * (Math.PI / 180);
    const dx = (cellX / gridWidth) - 0.5;
    const dy = (cellY / gridHeight) - 0.5;
    const cellAngle = (90 * (Math.PI / 180)) - angleRad + Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    const final = (Math.cos(cellAngle) * length) + 0.5;
    return clamp(final, 0, 1);
    // const angleRad = (angleDeg * Math.PI) / 180
    // const sinAngle = Math.sin(angleRad)
    // const cosAngle = Math.cos(angleRad)
    // const distance = gridWidth * cosAngle + gridHeight * sinAngle
    // const s = cellX * cosAngle + cellY * sinAngle
}
export function createSteppedArray(startFrom, endAt, step) {
    const returnArr = [];
    let value = startFrom;
    while (value !== endAt) {
        returnArr.push(value);
        value = stepValueToValue(value, endAt, step);
    }
    returnArr.push(value);
    return returnArr;
}
//returns field of object based on string, allows nested access via syntax "fieldParent.fieldChild"
export function objectFieldByString(object, fieldString) {
    return fieldString.split('.').reduce((o, key) => o[key], object);
}
