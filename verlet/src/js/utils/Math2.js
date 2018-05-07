let Math2 = {};

Math2.map = function(val, inputMin, inputMax, outputMin, outputMax)
{
    return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
};

// line = [[x, y, z], [x2, y2, z2]]
// plane = [[x, y, z], [x2, y2, z2], [x3, y3, z3]]
Math2.intersectionLinePlane = function(line, plane)
{
    let pt1 = line[0];
    let pt2 = line[1];
    // plane equation
    let p1 = plane[0];
    let p2 = plane[1];
    let p3 = plane[2];

    let x0 = p1[0]
    let y0 = p1[1]
    let z0 = p1[2]

    /* find perpendicular vector */
    let v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
    let v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]]
    let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]
    let t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2]));

    // so when we replace the line above (1*))
    let newx = t * (pt2[0] - pt1[0]) + pt1[0];
    let newy = t * (pt2[1] - pt1[1]) + pt1[1];
    let newz = t * (pt2[2] - pt1[2]) + pt1[2];

    // this.sphereIntersection.position.set(newx, newy, newz);

    return { x: newx, y:newy, z:newz };
}

Math2.cross = function(v1, v2)
{
    return [v1[1] * v2[2] - v2[1] * v1[2], - (v1[0] * v2[2] - v1[2] * v2[0]), (v1[0] * v2[1] - v1[1] * v2[0]) ];
}

Math2.getCentroid = function(triangle)
{
    let x = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
    let y = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
    let z = (triangle[0].z + triangle[1].z + triangle[2].z) / 3;

    return { x, y, z }
}


// points is an array of four points (quadrilateral)
// /!\ points must be ORDERED before (because we divide the quadrilateral shape into four triangles)
Math2.findCentroid = function(points)
{
    // first diagonal
    let tri1 = [points[0], points[1], points[3]]
    let centroid1 = Math2.getCentroid(tri1);

    let tri2 = [points[0], points[2], points[3]];
    let centroid2 = Math2.getCentroid(tri2, true);

    // gives to triangles
    let tri3 = [points[1], points[0], points[2]]
    let centroid3 = Math2.getCentroid(tri3);

    let tri4 = [points[1], points[3], points[2]]
    let centroid4 = Math2.getCentroid(tri4);

    let c1c2 = { x: centroid2.x - centroid1.x, y: centroid2.y - centroid1.y, z: centroid2.z - centroid1.z };
    let c3c4 = { x: centroid4.x - centroid3.x, y: centroid4.y - centroid3.y, z: centroid4.z - centroid3.z };

    // intersection verifie:
    // TOP c1c2.x * k - c1.x = c3c4.x * k2 - c3.x
    // MID c1c2.y * k - c1.y = c3c4.y * k2 - c3.y
    // BOT c1c2.z * k - c1.z = c3c4.z * k2 - c3.z


    // (1) k = (c3c4.x * k2 - c3.x + c1.x) / c1c2.x
    // (2) k = (c3c4.y * k2 - c3.y + c1.y) / c1c2.y

    // (2) - (1) => (c3c4.x * k2 - c3.x + c1.x) / c1c2.x - (c3c4.y * k2 - c3.y + c1.y) / c1c2.y = 0
    // (2) - (1) => (c3c4.x * k2 / c1c2.x) - c3.x/c1c2.x + c1.x / c1c2.x - (c3c4.y * k2 / c1c2.y) + c3.y/c1c2.y - c1.y / c1c2.y = 0
    // (2) - (1) => (c3c4.x * k2 / c1c2.x)  - (c3c4.y * k2 / c1c2.y) = c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y
    // (2) - (1) => k2 * (c3c4.x / c1c2.x  - c3c4.y / c1c2.y) = c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y
    // (2) - (1) => k2 = (c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y) / (c3c4.x / c1c2.x  - c3c4.y / c1c2.y)
    let k2 = (centroid3.x/c1c2.x - centroid1.x / c1c2.x - centroid3.y/c1c2.y + centroid1.y / c1c2.y) / (c3c4.x / c1c2.x  - c3c4.y / c1c2.y)

    // putting it back in (2)
    // k = (c3c4.y * k2 - c3.y + c1.y) / c1c2.y
    let k = (c3c4.y * k2 - centroid3.y + centroid1.y) / c1c2.y;

    // so now we verify in BOTH if it intersects or not
    let l = (c1c2.z * k - centroid1.z) ;
    let r = (c3c4.z * k2 - centroid3.z) ;

    let centroid = {
        x: -(c1c2.x * k - centroid1.x),
        y: -(c1c2.y * k - centroid1.y),
        z: -(c1c2.z * k - centroid1.z),
    }


    return centroid;
}


Math2.isPointInTriangle = function(p, p0, p1, p2) {
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sign = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}


Math2.smallestAngle = function(angle, targetAngle)
{
    angle %= Math.PI * 2;
    if(angle < 0)angle += Math.PI * 2;
    var difference1 = targetAngle - angle;
    var difference2 = (targetAngle + (Math.PI * 2)) - angle;

    var difference3 = (targetAngle - (Math.PI * 2)) - angle;

    var absDifference1 = Math.abs(difference1);
    var absDifference2 = Math.abs(difference2);
    var absDifference3 = Math.abs(difference3);

    var difference = difference1;

    if (absDifference2 < absDifference1 && absDifference2 < absDifference3)
    {
        difference = difference2;
    }
    else if (absDifference3 < absDifference1 && absDifference3 < absDifference2)
    {
        difference = difference3;
    }

    return difference;
};

export default Math2;
