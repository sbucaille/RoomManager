const exec = require('child_process').exec;

hueSyncFunctions = {
    enableHueSync : function (){
        exec('scriptsAutoIt\\enableHueSync.au3', (e, stdout, stderr)=> {
            if (e instanceof Error) {
                console.error(e);
                throw e;
            }
        });
    },
    selectMusicMode : function (){
        exec('scriptsAutoIt\\selectMusicMode.au3', (e, stdout, stderr)=> {
            if (e instanceof Error) {
                console.error(e);
                throw e;
            }
        });
    },
    selectGameMode : function () {
        exec('scriptsAutoIt\\selectGameMode.au3', (e, stdout, stderr)=> {
            if (e instanceof Error) {
                console.error(e);
                throw e;
            }
        });
    },
    selectVideoMode : function () {
        exec('scriptsAutoIt\\selectVideoMode.au3', (e, stdout, stderr)=> {
            if (e instanceof Error) {
                console.error(e);
                throw e;
            }
        });
    }
}


module.exports = hueSyncFunctions;