const _ = require('lodash');

module.exports = function(config) {
    if(config.common) {
        config.common.constants.RESOURCE_THORIUM = 'T';
        config.common.constants.RESOURCES_ALL.push(config.common.constants.RESOURCE_THORIUM);
    }

    if(config.engine) {
        config.engine.on('processRoom', function(roomId, roomInfo, roomObjects, roomTerrain, gameTime, bulk, bulkUsers, eventLog) {
            const thoriumByPosition = {};

            const objectsWithThorium = _.filter(roomObjects, o => !!o.store && !!o.store.T);
            for(const object of objectsWithThorium) {
                const key = 50*object.x+object.y;
                thoriumByPosition[key] = thoriumByPosition[key] || 0;
                thoriumByPosition[key] += object.store['T'];
            }

            for(const position in thoriumByPosition) {
                const ttlPenalty = Math.log10(thoriumByPosition[position])|0;

                const [x,y] = [(position/50)|0, position % 50];
                const objectsInTile = _.filter(roomObjects, {x, y});

                for(const o of objectsInTile) {
                    if(!o._id) {
                        continue;
                    }
                    if(o.ageTime) {
                        bulk.inc(o._id, 'ageTime', -ttlPenalty);
                        continue;
                    }
                    if(o.decayTime) {
                        bulk.inc(o._id, 'decayTime', -ttlPenalty);
                    }
                    if(o.nextDecayTime) {
                        bulk.inc(o._id, 'nextDecayTime', -ttlPenalty);
                    }
                }
            }
        });
    }
}