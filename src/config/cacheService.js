const cache = require('node-cache');
const logger = require('../loggers/logger');


const myCache = new cache({ stdTTL: 900});

let user_session = "userSession";
const setSession = (data) => {
   myCache.set(user_session,JSON.stringify(data));
}


const getSession = () => {

    const session_data = myCache.get(user_session);
    return session_data;
}

const clearSession = () => {
    myCache.del(user_session);
}


module.exports = { setSession,getSession,clearSession};