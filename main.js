var minutes = 60 * 12,
  fullHourMark = 60,      // 3 dashes
  halfHourMark = 30,      // 2
  quarterHourMark = 15;   // 1

// Generator
for (minutes; minutes >= 0; minutes -= 1) {
  // Print hour mark
  if (minutes % fullHourMark === 0) { // 
    console.log("---", (minutes / fullHourMark).toString());
  } else if (minutes % halfHourMark === 0) {
    console.log("--");
  } else if (minutes % quarterHourMark === 0) {
    console.log("-");
  }
}
