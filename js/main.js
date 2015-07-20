window.onload = function () {
  var scene = new Snap();
  var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
  // Display some hours
  var watch = scene.text(300, 60, hours).attr({
    font: "300 40px Helvetica Neue",
    textAnchor: "middle"
  });
};