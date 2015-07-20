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

  // Evenly space out the hours
  faceWidth = 800;
  spacing = Math.round(faceWidth / hours.length);
  hours.forEach(function (hour, index) {
    watch.select("tspan:nth-child(" + (index + 1) + ")")
      .attr({
        x: spacing * hour
      });
  });
};