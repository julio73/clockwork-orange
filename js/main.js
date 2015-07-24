/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, padding, canvas, hours, hoursNums, hoursX, hoursY, hourTSpans,
    faceH, faceW, midX, spacing, markings, markingsPath, gaps, hand, handX,
    newHandX, watchFace, time;

  hoursNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceW = 720; // 6! (factorial)
  faceH = faceW / 6;
  padding = 20;
  scene = new Snap(faceW + padding * 4, faceH + padding * 2).attr({id: "scn"});
  canvas = scene
    .rect(padding, padding, faceW + 2 * padding, faceH)
    .attr({fill: '#FFF'});
  hoursY = faceH - padding * 2;
  hoursX = padding * 2;
  midX = hoursX + faceW / 2;
  spacing = faceW / 12;
  markingsPath = "M" + [hoursX, hoursY + 30, hoursX, hoursY] + "m-5,0,10,0";
  gaps = {
    0: 0,
    1: spacing / 6,
    2: spacing * 2 / 6,
    3: spacing * 3 / 6,
    4: spacing * 4 / 6,
    5: spacing * 5 / 6
  };

  // Display some hours
  hours = scene.text(hoursX, hoursY, hoursNums).attr({
    fontFamily: "Courier New",
    fontSize: "20px",
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
  markings = scene.path(markingsPath).attr({stroke: "#000"});

  // Then the watch hand
  hand = scene
    .line(midX, padding, midX, faceH + padding)
    .attr({
      fill: "none",
      stroke: "#f40",
      strokeWidth: 1
    });

  // And group them under the watch face
  watchFace = scene.group(canvas, hours, markings, hand);

  // Then add a clipping mask
  watchFace.attr({
    clip: scene
      .rect(padding * 1.5, padding * 1.5, faceW + padding, faceH - padding * 1.5)
  });

  // Update newHandX every 1s
  window.setInterval(function () {
    var d = new Date(),
      t = [d.getHours(), d.getMinutes(), d.getSeconds()],
      t_posx = null,
      t_display = d.toLocaleTimeString(),
      t_anchor = (t[0] % 12 <= 6) ? "left" : "right";
    newHandX = hoursX + spacing
      * ((t[0] % 12) + (t[1] / 60) + ((Math.floor(t[2] / 60) * 60) / 3600));
    t_posx = newHandX + (t_anchor === "left" ? 10 : -100); // temp fix
    if (time === null) {
      time = scene
        .text(t_posx, padding * 2.5, t_display)
        .attr({
          fontFamily: "Courier New",
          fontSize: "15px",
          textAnchor: t_anchor,
          stroke: "#f40",
          fill: "#f40"
        });
    } else {
      time.node.innerHTML = t_display;
      time.attr({
        x: t_posx,
        textAnchor: t_anchor
      });
    }
  }, 1000);

  // Update hand location in animation frame
  function updateHandX() {
    if (handX !== newHandX) {
      handX = newHandX;
      hand.attr({'x1': handX, 'x2': handX});
    }
    window.requestAnimationFrame(updateHandX);
  }

  // Initialize updater after 0.5s
  window.setTimeout(function () {
    time = null;
    updateHandX();
  }, 500);

};