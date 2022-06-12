const Profile3 = require('./Profile3');
const Profile4 = require('./Profile4');

const switchProfile = (appId, accessToken) => {
    if (appId === 'vy03') return new Profile3(accessToken);
    else if (appId === 'vy04') return new Profile4(accessToken);

};

module.exports = switchProfile;