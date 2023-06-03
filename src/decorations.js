module.exports = function(config) {
    if(config.backend) {
      function getDecorations(location) {
        const wall = {
          "active": {
            "foregroundColor": "#CFAD01",
            "foregroundAlpha": 0.15,
            "foregroundBrightness": 1.0,
            "backgroundColor": "#AB8812",
            "backgroundBrightness": 0.3,
            "strokeColor": "#A38A23",
            "strokeBrightness": 0.5,
            "strokeLighting": 0.1,
            "strokeWidth": 10,
            "world": true,
            "room": location.room
          },
          "decoration": {
            "graphics": [],
            "type": "wallLandscape",
            "name": "Seasonal wall",
            "foregroundUrl": `${config.assetsUrl}wall.png`
          }
        };
        const floor = {
          "active": {
            "floorBackgroundColor": "#CDA418",
            "floorBackgroundBrightness": 0.7,
            "floorForegroundColor": "#F3C300",
            "floorForegroundAlpha": 0.1,
            "floorForegroundBrightness": 1.0,
            "swampColor": "#4A8200",
            "swampStrokeColor": "#513F02",
            "swampStrokeWidth": 30,
            "roadsColor": "#C2B271",
            "roadsBrightness": 0.8,
            "world": true,
            "room": location.room
          },
          "decoration": {
            "graphics": [],
            "type": "floorLandscape",
            "name": "Seasonal floor",
            "floorForegroundUrl": `${config.assetsUrl}floor.png`,
            "tileScale": 2
          }
        };
        if(location.shard) {
          wall.active.shard = location.shard;
          floor.active.shard = location.shard;
        }
  
        return [floor, wall];
      };
  
      config.backend.on('expressPostConfig', function(app) {
        config.backend.router.get('/game/room-decorations', (request, response) => {
          const decorations = getDecorations(request.query);
          console.log(`Decorations get`);
          response.json({ ok: 1, decorations });
        });
      });
    }
  }
  