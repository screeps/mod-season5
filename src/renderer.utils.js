module.exports.flickering = (alpha1, alpha2, alpha3, alpha4) => ({
    action: 'Spawn',
    params: [[
        {
            action: 'Repeat',
            params: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'ScaleTo',
                        params: [
                            { $rel: 'scale.x', koef: 1.2 },
                            { $rel: 'scale.y', koef: 1.2 },
                            1,
                        ],
                    },
                    {
                        action: 'ScaleTo',
                        params: [
                            { $rel: 'scale.x' },
                            { $rel: 'scale.y' },
                            1,
                        ],
                    },
                ]],
            }],
        },
        {
            action: 'Repeat',
            params: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'AlphaTo',
                        params: [alpha1, 0.1],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha2, 0.2],
                    },
                    {
                        action: 'DelayTime',
                        params: [{ $random: 2 }],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha3, 0.2],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha4, 2.8],
                    },
                ]],
            }],
        },
    ]],
});

module.exports.fg = () => {
    const colors = { L: 0x89F4A5, U: 0x88D6F7, K: 0x9370FF, Z: 0xF2D28B, X: 0xFF7A7A, O: 0xCCCCCC, H: 0xCCCCCC, T: 0xBCFF50 };
    let calc = 0xFFFFFF;
    for(const symbol in colors) {
        calc = { $if: {$eq: [{$state: 'mineralType'}, symbol]}, then: colors[symbol], else: calc };
    }

    return calc;
}

module.exports.bg = () => {
    const colors = { L: 0x3F6147, U: 0x1B617F, K: 0x331A80, Z: 0x594D33, X: 0x4F2626, O: 0x4D4D4D, H: 0x4D4D4D, T: 0x67A700 };
    let calc = 0x000000;
    for(const symbol in colors) {
        calc = { $if: {$eq: [{$state: 'mineralType'}, symbol]}, then: colors[symbol], else: calc };
    }

    return calc;
}

