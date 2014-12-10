var df = require('dateformat')
  , autonomy = require('../')
  , mission  = autonomy.createMission()
  , arDrone = require('ar-drone')
  , arDroneConstants = require('ar-drone/lib/constants')
  ;

function navdata_option_mask(c) {
  return 1 << c;
}
drone = require("./lib/server");
var http = require("http");


var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});




var exiting = false;
process.on('SIGINT', function() {
    if (exiting) {
       // mission.client.enableEmergency();
        process.exit(0);
    } else {
        console.log('Got SIGINT. Landing, press Control-C again to force exit.');
        exiting = true;
        mission.control().disable();
        mission.client().land(function() {
            process.exit(0);
        });
    }
});

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Run this to save a h264 video file, with the PaVE frame filtered out.
// You can then use this file as a ffmpeg source for additional processing
// or streaming to a ffserver

// var PaVEParser = require('./lib/PaVEParser');
// var ts = "";//new Date.getTime();
// var output = require('fs').createWriteStream('./vid-' + df(new Date(), "yyyy-mm-dd_hh-MM-ss"));

// var video = arDrone.createClient().getVideoStream();
// var parser = new PaVEParser();

// parser
//   .on('data', function(data) {
//     output.write(data.payload);
//   })
//   .on('end', function() {
//     output.end();
//   });

// video.pipe(parser);


mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', navdata_options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

mission.log("mission-" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");
var m = 0.3

mission//.takeoff()
        .zero()
        .wait(500)
        .go({x:0, y:0})

        //.go({x: 0, y: 0, z: 1, yaw: -127})
        .wait(500)
        .forward(2*m)
        //.left(0.2)
        .cw(45)
        .forward(1.5*m)
        //.left(0.2)
        .cw(-45)
        .altitude(2)
        .go({x: 2, y:1, z: 2})
        .wait(1000)
        .forward(2*m)
        //.left(0.2)
        .cw(-90)
        .forward(2*m)
        //.left(0.2)
        .cw(-110)
        .altitude(1)
        .forward(2*m)
        //.left(0.2)
        .wait(1000)
        .cw(-180)
        .cw(-170)
        .forward(3*m)
        .go({x:0, y:0})
        .wait(500)
        .cw(180)
        .go({x:0, y:0})
        .wait(1000)
        .land();

mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
                process.exit(0);


    } else {
        console.log("We are done!");
        process.exit(0);
    }
});

var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});
drone.listen(server);
server.listen(5555);


