const fs = require("fs");
const path = require("path");

// 파일 경로 설정
const directoryPath = path.join(__dirname);

// 한글 이름과 영어 이름 매핑
const nameMap = {
  "찬란한 명예의 돌파석.png": "Radiant_Breakthrough_Stone_of_Honor.png",
  "카르마의 잔영.png": "Shadow_of_Karma.png",
  "클리어 메달.png": "Clear_Medal.png",
  "파괴강석.png": "Destruction_Stone.png",
  "파괴석 결정.png": "Destruction_Stone_Fragment.png",
  "혼돈의 돌.png": "Stone_of_Chaos.png",
};

// 파일 이름 변경
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory:", err);
  }

  files.forEach((file) => {
    if (nameMap[file]) {
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(directoryPath, nameMap[file]);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.log("Error renaming file:", err);
        } else {
          console.log(`Renamed: ${file} → ${nameMap[file]}`);
        }
      });
    }
  });
});
