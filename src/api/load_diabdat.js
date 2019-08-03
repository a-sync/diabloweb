import axios from 'axios';

const DiabdatSize = 517501282;

export { DiabdatSize };

export default async function load_diabdat(api, fs) {
  let file = fs.files.get('diabdat.mpq');
  if (file && file.byteLength !== DiabdatSize) {
    fs.files.delete('diabdat.mpq');
    await fs.delete('diabdat.mpq');
    file = null;
  }
  if (!file) {
    const diabdat = await axios.request({
      url: process.env.PUBLIC_URL + '/diabdat.mpq',
      responseType: 'arraybuffer',
      onDownloadProgress: e => {
        if (api.onProgress) {
          api.onProgress({text: 'Downloading...', loaded: e.loaded, total: e.total || DiabdatSize});
        }
      },
      headers: {
        'Cache-Control': 'max-age=31536000'
      }
    });
    if (diabdat.data.byteLength !== DiabdatSize) {
      throw Error("Invalid diabdat.mpq size. Try clearing cache and refreshing the page.");
    }
    const data = new Uint8Array(diabdat.data);
    fs.files.set('diabdat.mpq', data);
    fs.update('diabdat.mpq', data.slice());
  }
  return fs;
}
