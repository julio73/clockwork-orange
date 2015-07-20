/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, hours, hourText, hourPosX, faceWidth, spacing, markingsPath, watchFace;

  scene = new Snap().attr({id: "#scene"});
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceWidth = 800;
  spacing = Math.round(faceWidth / hours.length);

  // Display some hours
  hourPosX = 100;
  hourText = scene.text(0, hourPosX, hours).attr({
    font: "300 30px Courier New",
    textAnchor: "middle"
  });

  // Evenly space out the hours and build marking path
  markingsPath = "";
  hours.forEach(function (hour, index) {
    var posx = spacing * hour;
    // Select hour and move it
    hourText.select("tspan:nth-child(" + (index + 1) + ")")
      .attr({x: posx});
    // Build marking path
    markingsPath += "M" + [posx, 0, posx, 20]
      + "M" + [posx + spacing * 0.333, 10, posx + spacing * 0.333, 20]
      + "M" + [posx + spacing * 0.666, 10, posx + spacing * 0.666, 20];
  });

  // Add the markings and group them with hours under the watch face
  watchFace = scene.group(
    hourText,
    scene.path(markingsPath)
      .attr({
        fill: "none",
        stroke: "#000",
        strokeWidth: 1
      })
      .attr({
        transform: "t" + [0, hourPosX + 10]
      })
  );
};