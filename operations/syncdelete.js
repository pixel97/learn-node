const fs = require("fs");
fs.readFile("./operations/data.txt", (err, data) => {
  if (err) console.log(err.message);
  else {
    console.log(data);
    fs.unlink("./operations/data.txt", (unlinkErr) => {
      if (unlinkErr) {
        console.log(unlinkErr.message);
      } else {
        console.log('File deleted successfully');
      }
  });
}
});
//fs.unlinkSync("./operations/data.txt");		// delete the file

