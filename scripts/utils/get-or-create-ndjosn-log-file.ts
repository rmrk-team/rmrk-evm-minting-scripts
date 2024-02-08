import fs from 'fs';

const fsPromises = fs.promises;

export const getOrCreateNdjosnLogFile = async <T>(path: string) => {
  let response: T[] = [];
  if (fs.existsSync(path)) {
    const rawResponse = fs.readFileSync(path, 'utf-8');
    if (rawResponse.length !== 0) {
      response = rawResponse
        .toString()
        .trim()
        .split('\n')
        .map((s) => JSON.parse(s));
    }
  } else {
    // Init empty log
    await fsPromises.writeFile(path, '');
  }

  return response;
};
