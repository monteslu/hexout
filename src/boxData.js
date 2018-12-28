const wallRestitution = 1;

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
      "wall": true,
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
      "wall": true,
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
      "wall": true,
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
      "wall": true,
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
      "wall": true,
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
      "wall": true,
    },
  ],
  "joints": [
  ],
  "canvas": {
    "height": 600,
    "width": 800
  },
  "backImg": null
};