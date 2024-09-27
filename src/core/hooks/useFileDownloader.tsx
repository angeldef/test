import { apiService } from '../services';

const signatures: Record<string, string> = {
  JVBERi0: 'application/pdf',
  '/9j/': 'image/jpg',
};

export const useFileDownloader = () => {
  const downloadFileGlobal = async (url?: string) => {
    if (!url) return;

    const { data: resp } = await apiService.getFile(url);

    if (resp) {
      const { file, fileName } = resp.data;
      base64ToPDF(file, fileName);
    }
  };

  function base64ToPDF(base64String: string, fileName: string) {
    // Decode Base64 string to binary data
    const binaryData = atob(base64String);

    // Create Uint8Array from binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create Blob object
    const blob = new Blob([uint8Array], { type: detectMimeType(base64String) });

    // Create URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click event on the link to initiate the download
    link.click();

    // Clean up: remove the link and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function detectMimeType(b64: string) {
    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
  }

  return { downloadFileGlobal };
};
