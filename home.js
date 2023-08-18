const COLOR_PRIMARY = "#4C3FAF"
// const COLOR_SECOND = "#4CAF50"
//button messages//
const PLAY_MSSG = "START"
const AGAIN_MSSG = "GOING"
const PRESSED_MSSG = "START"
const ASK_MSSG = "ASK (press again)"
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
  'kitchen',
  'drones',
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
var myFlange = new Pizzicato.Effects.Flanger({
	time: 0.45,
	feedback: 0.1,
	mix: 0.5
});
var myLPF = new Pizzicato.Effects.LowPassFilter({
  peak: 1
});

app.controller('myCtrl', function($scope) {
  $scope.selected = 0
  $scope.alpha = 0;
  $scope.beta = 0;
  $scope.gamma = 0;
  $scope.alphaDisplay = 0;
  $scope.betaDisplay = 0;
  $scope.gammaDisplay = 0;
  $scope.bgcolor = COLOR_PRIMARY;
  $scope.buttonMessage = ASK_MSSG
  $scope.playing = false

  group.addEffect(myFlange)
  group.addEffect(myLPF)

  $scope.stopMusic = function() {
    console.log("yeee?")
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
      myFlange.speed = (scale(alpha) * 1.0);
      myFlange.depth = (scale(beta) * 1.0);
      console.log(myFlange.speed);
	  console.log(myFlange.depth);
	  console.log(myLPF.frequency);
      $scope.alphaDisplay = (scale(alpha) * 100).toFixed(0);
      $scope.betaDisplay = (scale(beta) * 100).toFixed(0);
      $scope.gammaDisplay = (scale(gamma) * 100).toFixed(0);
    })
  }

  var isVeryFirstTime = true
  var isFirstTime = true
  $scope.onClickMe = function() {
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
      $scope.buttonMessage = PLAY_MSSG
      return
    }
    clearTimeout(myTimeoutKeeper)

    if (!isFirstTime) {
      $scope.selected += 1
      $scope.sound.stop();
      $scope.buttonMessage = PLAY_MSSG
      $scope.playing = false;
      $scope.bgcolor = COLOR_PRIMARY;
    }
    isFirstTime = false
    $scope.buttonMessage = PRESSED_MSSG;
    myTimeoutKeeper = setTimeout(() => {
      $scope.buttonMessage = PLAY_MSSG;
      $scope.$apply()
    }, 5000)

    // $scope.myFlange.mix = 0
    // now do the audio bit
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