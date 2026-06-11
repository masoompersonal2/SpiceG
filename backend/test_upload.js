const fs = require('fs');
const path = require('path');

async function test() {
  try {
    // 1. Create a dummy file
    const testFilePath = path.join(__dirname, 'test_image.jpg');
    fs.writeFileSync(testFilePath, 'dummy image content');

    // 2. Upload the file
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(testFilePath)], { type: 'image/jpeg' });
    formData.append('file', fileBlob, 'test_image.jpg');

    console.log("Uploading file...");
    const uploadRes = await fetch("http://localhost:3000/api/content/upload", {
      method: "POST",
      body: formData
    });

    if (!uploadRes.ok) {
      console.error("Upload failed", uploadRes.status, await uploadRes.text());
      return;
    }

    const uploadData = await uploadRes.json();
    console.log("Upload response:", uploadData);

    const fileUrl = uploadData.url; // e.g. /uploads/file-xxx.jpg
    const fullUrl = `http://localhost:3000${fileUrl}`;

    console.log("Fetching from:", fullUrl);
    const getRes = await fetch(fullUrl);
    console.log("GET response status:", getRes.status);
    if (getRes.ok) {
      console.log("GET successful! Content length:", (await getRes.text()).length);
    } else {
      console.error("GET failed with status", getRes.status, await getRes.text());
    }

  } catch (err) {
    console.error("Error during test:", err);
  }
}

test();
