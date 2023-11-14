const COLOR_PRIMARY = "#4C3FAF"
const COLOR_DISABLED = "#808080"
//button messages//
const PLAY_MSSG1 = "CUE 1"
const PLAY_MSSG2 = "CUE 2"
const PLAY_MSSG3 = "CUE 3"
const PLAY_MSSG4 = "CUE 4"
const DONE_MSSG = "DONE"
const PRESSED_MSSG = "PLAYING"
const ASK_MSSG = "GET READY"
var myTimeoutKeeper;

//resizing orientation values from the device//
function scale(input) {
  if (input < 0) {
    input = -input
  }
  if (input > 180) {
    input = input - 180
  }
  if (input > 90) {
    input = 90 - (input - 90)
  }
  return input / 90
}

//all audio file names and buffers - BegottenMemoirCue#.mp3//

var Cue1 = new Pizzicato.Sound('./audio/BegottenMemoirCue1.mp3');
var Cue2 = new Pizzicato.Sound('./audio/BegottenMemoirCue2.mp3');
var Cue3 = new Pizzicato.Sound('./audio/BegottenMemoirCue2.mp3');
var Cue4 = new Pizzicato.Sound('./audio/BegottenMemoirCue2.mp3');
Cue1.volume = 0.7;
Cue2.volume = 0.7;
Cue3.volume = 0.7;
Cue4.volume = 0.7;
var group1 = new Pizzicato.Group([Cue1]);
var group2 = new Pizzicato.Group([Cue2]);
var group3 = new Pizzicato.Group([Cue3]);
var group4 = new Pizzicato.Group([Cue4]);


var app = angular.module('myApp', []);

//effects//
var Del = new Pizzicato.Effects.Delay({
	time: 2.0,
	feedback: 0.1,
	mix: 0.5
});
var LPF = new Pizzicato.Effects.LowPassFilter({
  peak: 1
});
var Flanger = new Pizzicato.Effects.Flanger({
	time: 0.45,
	speed: 0.2,
	depth: 0.1,
	feedback: 0.1,
	mix: 0.2
});


app.controller('myCtrl', function($scope) {
  $scope.selected = 0;
  $scope.alpha = 0;
  $scope.beta = 0;
  $scope.gamma = 0;
  $scope.alphaDisplay = 0;
  $scope.betaDisplay = 0;
  $scope.gammaDisplay = 0;
  $scope.bgcolor = COLOR_PRIMARY;
  $scope.buttonMessage1 = ASK_MSSG;
  $scope.buttonMessage2 = PLAY_MSSG2;
  $scope.buttonMessage3 = PLAY_MSSG3;
  $scope.buttonMessage4 = PLAY_MSSG4;
  $scope.playing = false

  group1.addEffect(Flanger)
  group1.addEffect(LPF)
  group2.addEffect(Del)
  group2.addEffect(LPF)


  $scope.stopMusic = function() {
    console.log("stop music");
    window.location.reload();
  }

//variables to change with orientation//
  $scope.updateXY = function(event) {
    console.log("update");
    console.log(event.alpha);
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;
    $scope.$apply(function() {
      $scope.alpha = scale(alpha).toFixed(2);
      $scope.beta = scale(beta).toFixed(2);
      $scope.gamma = scale(gamma).toFixed(2);
      Del.time = (scale(beta) * 10);
      Del.feedback = (scale(gamma) * 0.5);
	  Flanger.time = (scale(beta) * 10.0);
	  LPF.frequency = (scale(alpha) * -8000) + 10000;
      console.log(Flanger.time);
	  console.log(Del.time);
	  console.log(Del.feedback);
	  console.log(LPF.frequency);
      $scope.alphaDisplay = (scale(alpha) * 90).toFixed(0);
      $scope.betaDisplay = (scale(beta) * 90).toFixed(0);
      $scope.gammaDisplay = (scale(gamma) * 90).toFixed(0);
    })
  };

  var isVeryFirstTime = true
  var isFirstTime = true
  $scope.Button1 = function() {
    if (isVeryFirstTime) {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              // window.addEventListener('devicemotion', $scope.updateXY, true);
              window.addEventListener("deviceorientation", $scope.updateXY, true);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", $scope.updateXY, true);
      }
      isVeryFirstTime = false
      $scope.buttonMessage1 = PLAY_MSSG1
      return
    }
    clearTimeout(myTimeoutKeeper)

    if (!isFirstTime) {
      $scope.selected += 1
      $scope.group1.stop();
      $scope.buttonMessage1 = PLAY_MSSG1
      $scope.playing = false;
      $scope.bgcolor = COLOR_PRIMARY;
    }
    $scope.buttonMessage1 = PRESSED_MSSG;
	document.getElementById("CUE_1").style.backgroundColor = COLOR_DISABLED;
	document.getElementById("CUE_1").disabled = true;
    myTimeoutKeeper = setTimeout(() => {
      $scope.buttonMessage1 = DONE_MSSG;
      $scope.$apply()
    }, 5000)

    //start audio//
    $scope.group1.play()
    $scope.playing = true;
    $scope.bgcolor = COLOR_PRIMARY;
  }

  $scope.Button2 = function() {
    if (!isFirstTime) {
      $scope.selected += 1
      $scope.group2.stop();
      $scope.buttonMessage2 = PLAY_MSSG2
      $scope.playing = false;
      $scope.bgcolor = COLOR_PRIMARY;
    }
    $scope.buttonMessage2 = PRESSED_MSSG;
	document.getElementById("CUE_2").style.backgroundColor = COLOR_DISABLED;
	document.getElementById("CUE_2").disabled = true;
    myTimeoutKeeper = setTimeout(() => {
      $scope.buttonMessage2 = DONE_MSSG;
      $scope.$apply()
    }, 5000)

    //start audio//
    $scope.group2.play()
    $scope.playing = true;
    $scope.bgcolor = COLOR_PRIMARY;
  }
});

var isStarted = false


window.onclick = function() {
  if (isStarted) {
    return
  }
  let context = Pizzicato.context
  let source = context.createBufferSource()
  source.buffer = context.createBuffer(1, 1, 22050)
  source.connect(context.destination)
  source.start()
  isStarted = true
  var noSleep = new NoSleep();
  noSleep.enable()
}