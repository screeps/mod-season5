const _ = require('lodash');

const densityProbability = {
    1: 0.1,
    2: 0.5,
    3: 0.9,
    4: 1.0
};
const mineralDensity = {
    1: 10000,
    2: 22000,
    3: 45000,
    4: 67000
};

module.exports = function(config) {
    if(config.engine) {
        config.engine.on('postProcessObject', function (object, roomObjects, roomTerrain, gameTime, roomInfo, bulk, bulkUsers, eventLog, mapView) {
            if (object.type == 'mineral' && object.mineralType == 'T' && !object.mineralAmount) {
                console.log(`${roomInfo._id}: Thorium depleted`);
                bulk.remove(object._id);
                delete roomObjects[object._id];
                roomInfo.active = true;
            }
        });
    }

    if(config.cronjobs) {
        config.cronjobs.genThorium = [60, async ({utils}) => {
            const C = config.common.constants;
            const {db, env} = config.common.storage;

            // run once
            if(await env.get('thoriumGenerated')) {
                return;
            }
            console.log(`Generating thorium...`);

            const common = require('@screeps/common');

            const roomObjects = await db['rooms.objects'].find({});
            const controllers = _.filter(roomObjects, {type: 'controller'});
            console.log(`${controllers.length} controllers`);

            for(const controller of controllers) {
                const thorium = _.find(roomObjects, {room: controller.room, type: 'mineral', mineralType: 'T'});
                if(thorium) {
                    continue;
                }
                console.log(`No thorium in room ${controller.room}`);
    
                const wallObjects = _.filter(roomObjects,
                    o => o.room == controller.room &&
                        _.includes(['source', 'mineral', 'controller'], o.type));

                const roomTerrain = await db['rooms.terrain'].findOne({room: controller.room});
                const terrain = roomTerrain.terrain;

                let mx,my,isWall,hasSpot,hasObjects;
                do {
                    mx = 2 + Math.floor(Math.random()*46);
                    my = 2 + Math.floor(Math.random()*46);
                    isWall = common.checkTerrain(terrain, mx, my, C.TERRAIN_MASK_WALL);
                    hasSpot = false;
                    for(let dx=-1;dx<=1;dx++) {
                        for(let dy=-1;dy<=1;dy++) {
                            if(!common.checkTerrain(terrain,mx+dx,my+dy, C.TERRAIN_MASK_WALL)) {
                                hasSpot = true;
                            }
                        }
                    }
                    hasObjects = _.any(wallObjects, i => Math.abs(i.x - mx) < 5 && Math.abs(i.y - my) < 5);
                }
                while(!isWall || !hasSpot || hasObjects);

                let density;
                const random = Math.random();
                for(const _density in densityProbability) {
                    if (random <= densityProbability[_density]) {
                        density = +_density;
                        break;
                    }
                }
                const mineralAmount = mineralDensity[density];

                await db['rooms.objects'].insert({
                    room: controller.room,
                    x: mx,
                    y: my,
                    type: 'mineral',
                    mineralType: 'T',
                    density,
                    mineralAmount
                });
                console.log(`${controller.room}: ${mx},${my} (${density}: ${mineralAmount})`);
            }

            await env.set('thoriumGenerated', 1);
        }];
    }
}