var env = process.env.NODE_ENV || 'development'

if(env==='development'){
    var config= require('./config.json')
    var envConfig = config[env]
    var google= require('./config.json')
    
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key]
    })
    Object.keys(google).forEach((key)=>{
        process.env[key] = google[key]
    })
}

