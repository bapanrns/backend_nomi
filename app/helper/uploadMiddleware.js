

function decodeBase64Image(base64String) {
  const matches = base64String.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    // throw new Error('Invalid base64 image format');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64');

  const imageType = matches[1];
  // Extract the image name from the base64 string (example assumes PNG format)
  const imageName = `${generateUniqueFileName()}.${imageType}`;

  return {
    name: imageName,
    type: imageType,
    data: imageBuffer,
  };
}

function generateUniqueFileName() {
  // Implement your own logic to generate a unique name for the image file
  // For example, you can use a combination of a timestamp and a random string
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 8);
  return timestamp + '_' + randomString;
}


module.exports = {
  decodeBase64Image
}