/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, hours, watch, faceWidth, spacing;

  scene = new Snap();
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Display some hours
  watch = scene.text(0, 100, hours).attr({
    font: "300 30px Helvetica Neue",
    textAnchor: "middle"
  });
};