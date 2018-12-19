const wallRestitution = 2.5;

module.exports = {
  "entities": [
    {
      "points": [
        {
          "x": -100,
          "y": -100
        },
        {
          "x": 568.10113,
          "y": -100
        },
        {
          "x": 568.10113,
          "y": 0
        },
        {
          "x": 0,
          "y": 540
        },
        {
          "x": -100,
          "y": 540
        },
      ],
      "x": 0,
      "y": 0,
      "staticBody": true,
      "zone": false,
      "type": "Polygon",
      "id": "uleftw",
      "hidden": true,
      "restitution": wallRestitution
    },
    {
      "points": [
        {
          "x": -100,
          "y": 540
        },
        {
          "x": 0,
          "y": 540
        },
        {
          "x": 568.10113,
          "y": 1080
        },
        {
          "x": 568.10113,
          "y": 1180
        },
        {
          "x": -100,
          "y": 1180
        },
      ],
      "x": 0,
      "y": 0,
      "staticBody": true,
      "zone": false,
      "type": "Polygon",
      "restitution": wallRestitution,
      "hidden": true,
      "id": "lleftw"
    },
    {
      "points": [
        {
          "x": 1351.89887,
          "y": -100
        },
        {
          "x": 2020,
          "y": -100
        },
        {
          "x": 2020,
          "y": 540
        },
        {
          "x": 1920,
          "y": 540
        },
        {
          "x": 1351.89887,
          "y": 0
        },
      ],
      "x": 0,
      "y": 0,
      "staticBody": true,
      "zone": false,
      "type": "Polygon",
      "restitution": wallRestitution,
      "id": "urighttw",
      "hidden": true,
    },
    {
      "points": [
        {
          "x": 1351.89887,
          "y": 1080
        },
        {
          "x": 1920,
          "y": 540
        },
        {
          "x": 2020,
          "y": 540
        },
        {
          "x": 2020,
          "y": 1180
        },
        {
          "x": 1351.89887,
          "y": 1180
        },
      ],
      "x": 0,
      "y": 0,
      "staticBody": true,
      "zone": false,
      "type": "Polygon",
      "restitution": wallRestitution,
      "id": "lrighttw",
      "hidden": true,
    },
    {
      "x": 960,
      "y": 1180,
      "halfWidth": 1000,
      "halfHeight": 100,
      "staticBody": true,
      "zone": false,
      "type": "Rectangle",
      "id": "bottomw",
      "restitution": wallRestitution,
      "hidden": true,
    },
    {
      "x": 960,
      "y": -100,
      "halfWidth": 1000,
      "halfHeight": 100,
      "staticBody": true,
      "zone": false,
      "type": "Rectangle",
      "id": "topw",
      "restitution": wallRestitution,
      "hidden": true,
    },
    {
      "x": 960,
      "y": 540,
      "halfWidth": 9,
      "halfHeight": 20,
      "staticBody": false,
      "zone": false,
      "type": "Rectangle",
      "fillStyle": "#EECEB3",
      "strokeStyle": "red",
      "lineWidth" : 5,
      "id": "neck"
    },
    {
      "x": 960,
      "y": 527,
      "radius": 24,
      "staticBody": false,
      "zone": false,
      "type": "Circle",
      "fillStyle": "rgba(239,208,207,0.2)",
      "id": "ball"
    },
  ],
  "joints": [
    {
      "bodyId1": "ball",
      "bodyId2": "neck",
      "type": "Revolute",
      "id": "balljoint",
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -0.5,
        "upperAngle": 0.5
      }
    },
    {
      "bodyId1": "ruleg",
      "bodyId2": "torso",
      "type": "Revolute",
      "id": "rhip",
      "bodyPoint1": {
        "x": 210,
        "y": 273
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -0.785385,
        "upperAngle": 1.570796
      }
    },
    {
      "bodyId1": "llleg",
      "bodyId2": "luleg",
      "type": "Revolute",
      "id": "lknee",
      "bodyPoint1": {
        "x": 157,
        "y": 364
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -0.185385,
        "upperAngle": 1.570796
      }
    },
    {
      "bodyId1": "rlleg",
      "bodyId2": "ruleg",
      "type": "Revolute",
      "id": "rknee",
      "bodyPoint1": {
        "x": 231,
        "y": 364
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -1.570796,
        "upperAngle": 0.185385
      }
    },
    {
      "bodyId1": "lhand",
      "bodyId2": "llarm",
      "type": "Revolute",
      "id": "lhand",
      "bodyPoint1": {
        "x": 125,
        "y": 302
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -1.6,
        "upperAngle": 1.6
      }
    },
    {
      "bodyId1": "rhand",
      "bodyId2": "rlarm",
      "type": "Revolute",
      "id": "rhand",
      "bodyPoint1": {
        "x": 268,
        "y": 290
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -1.6,
        "upperAngle": 1.6
      }
    },
    {
      "bodyId1": "lfoot",
      "bodyId2": "llleg",
      "type": "Revolute",
      "id": "lfoot",
      "bodyPoint1": {
        "x": 147,
        "y": 426
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -1.070796,
        "upperAngle": 0.785385
      }
    },
    {
      "bodyId1": "rfoot",
      "bodyId2": "rlleg",
      "type": "Revolute",
      "id": "rfoot",
      "bodyPoint1": {
        "x": 238,
        "y": 427
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": -0.785385,
        "upperAngle": 1.070796
      }
    },
    {
      "bodyId1": "thumb",
      "bodyId2": "lhand",
      "type": "Revolute",
      "id": "thumb",
      "bodyPoint1": {
        "x": 127,
        "y": 315
      },
      "jointAttributes": {
        "enableLimit": true,
        "lowerAngle": 0.1,
        "upperAngle": -0.1
      }
    }
  ],
  "canvas": {
    "height": 600,
    "width": 800
  },
  "backImg": null
};