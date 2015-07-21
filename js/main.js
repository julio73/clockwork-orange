/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, canvas, hours, hoursNums, hoursX, hoursY, hourTSpans, faceWidth,
    midX, spacing, markings, markingsPath, gaps, hand, movable, watchFace;

  scene = new Snap().attr({id: "#scene"});
  canvas = scene.rect(20, 20, 780, 180).attr({fill: '#FFF'});
  hoursNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceWidth = 720;
  hoursY = 100;
  hoursX = 50;
  midX = faceWidth / 2 + hoursX;
  spacing = faceWidth / 12;
  markingsPath = "";
  gaps = {
    0: 0,
    1: spacing / 6,
    2: spacing * 2 / 6,
    3: spacing * 3 / 6,
    4: spacing * 4 / 6,
    5: spacing * 5 / 6
  };

  // Display some hours
  hours = scene.text(0, hoursY, hoursNums).attr({
    font: "300 24px Courier New",
    textAnchor: "middle"
  });

  // Evenly space out the hours and build marking path
  hourTSpans = hours.selectAll("tspan");
  hoursNums.forEach(function (hour, index) {
    var posx = hoursX + spacing * hour;
    // Select hour and move it
    hourTSpans[index].attr({x: posx});
    // Build marking path
    markingsPath
      += "M" + [posx - gaps[0], hoursY + 15, posx - gaps[0], hoursY + 30]
      + "M" + [posx - gaps[1], hoursY + 27, posx - gaps[1], hoursY + 30]
      + "M" + [posx - gaps[2], hoursY + 27, posx - gaps[2], hoursY + 30]
      + "M" + [posx - gaps[3], hoursY + 21, posx - gaps[3], hoursY + 30]
      + "M" + [posx - gaps[4], hoursY + 27, posx - gaps[4], hoursY + 30]
      + "M" + [posx - gaps[5], hoursY + 27, posx - gaps[5], hoursY + 30];
  });

  // Add the markings 
  markings = scene.path(markingsPath)
    .attr({
      fill: "none",
      stroke: "#000",
      strokeWidth: 1
    });

  // Then the watch hand
  hand = scene
    .line(midX, hoursY / 2, midX, hoursY * 1.5)
    .attr({
      fill: "none",
      stroke: "red",
      strokeWidth: 1
    });

  // And group them under the watch face
  movable = scene.group(hours, markings);
  watchFace = scene.group(canvas, movable, hand);

  // Then add a clipping mask
  watchFace.attr({
    clip: scene
      .rect(hoursX + spacing, hoursY / 2, faceWidth - 2 * spacing, hoursY)
  });

};
