const COLOR_PRIMARY = "#4C3FAF"
// const COLOR_SECOND = "#4CAF50"
//button messages//
const PLAY_MSSG1 = "CUE 1"
const PLAY_MSSG2 = "CUE 2"
const PLAY_MSSG3 = "CUE 3"
const PLAY_MSSG4 = "CUE 4"
const PLAYING_MSSG = "PLAYING"
const PRESSED_MSSG = "STARTING"
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

//audio file names//
var allFileNames = [
  'BegottenMemoirCue1',
  'BegottenMemoirCue2',
  'BegottenMemoirCue3',
  'BegottenMemoirCue4'
]

var AllPizzSounds = []
var group = new Pizzicato.Group();

allFileNames.forEach(element => {
  console.log(element)
  // var i = new Audio('./audio/' + element + '.mp3');

  sound = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: './audio/' + element + '.mp3',
      loop: false,
      release: 3,
      volume: 0.2,
    }
  })
  group.addSound(sound)
  AllPizzSounds.push(sound)
});


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
  $scope.buttonMessage1 = ASK_MSSG
  $scope.playing = false

  group.addEffect(Del)
  group.addEffect(LPF)
  group.addEffect(Flanger)

  $scope.stopMusic = function() {
    console.log("stop music")
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
      Del.time = (scale(beta) * 0.05);
      Del.feedback = (scale(gamma) * 0.01)
	  LPF.frequency = (scale(alpha) * 8000) + 1000;
      console.log(Del.time);
	  console.log(Del.feedback);
	  console.log(LPF.frequency);
      $scope.alphaDisplay = (scale(alpha) * 100).toFixed(0);
      $scope.betaDisplay = (scale(beta) * 100).toFixed(0);
      $scope.gammaDisplay = (scale(gamma) * 100).toFixed(0);
    })
  }

  var isVeryFirstTime = true
  var isFirstTime = true
  $scope.onClickMe1 = function() {
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
      $scope.sound.stop();
      $scope.buttonMessage1 = PLAY_MSSG1
      $scope.playing = false;
      $scope.bgcolor = COLOR_PRIMARY;
    }
    isFirstTime = false
    $scope.buttonMessage1 = PRESSED_MSSG;
    myTimeoutKeeper = setTimeout(() => {
      $scope.buttonMessage1 = PLAYING_MSSG;
      $scope.$apply()
    }, 5000)

    //start audio//
    $scope.sound = AllPizzSounds[$scope.selected % allFileNames.length]
    $scope.sound.play()
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