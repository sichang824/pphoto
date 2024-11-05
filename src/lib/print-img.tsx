import html2canvas from 'html2canvas';

// Define the configuration type for the print element
interface PrintElementConfig {
  element: HTMLElement | null;
  title?: string;
}

// Define the configuration type for the canvas
interface CanvasConfig {
  backgroundColor?: string;
  scale?: number;
  useCORS?: boolean;
  logging?: boolean;
  windowWidth?: number;
  windowHeight?: number;
  onclone?: (clonedDoc: Document) => void;
}

// Set default values for the print element configuration
export const defaultPrintConfig: Required<PrintElementConfig> = {
  element: null,
  title: 'default-title',
};

// Set default values for the canvas configuration
export const defaultCanvasConfig: Required<CanvasConfig> = {
  backgroundColor: 'rgba(0,0,0,0)',
  scale: 2,
  useCORS: true,
  logging: false,
  windowWidth: 1080,
  windowHeight: 1440,
  onclone: clonedDoc => {
    const clonedCard = clonedDoc.querySelector('.card') as HTMLElement;
    if (clonedCard) {
      clonedCard.style.width = '1080px';
      clonedCard.style.height = '1440px';
      clonedCard.style.overflow = 'hidden';
    }
  },
};

export const generateCanvas = (element: HTMLElement, canvasConfig: CanvasConfig): Promise<HTMLCanvasElement> => {
  const config = { ...defaultCanvasConfig, ...canvasConfig };
  console.log(config);
  return new Promise((resolve, reject) => {
    requestAnimationFrame(() => {
      html2canvas(element, config)
        .then(resolve)
        .catch(reject);
    });
  });
};

const downloadImage = (canvas: HTMLCanvasElement, title: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
        
        setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve();
        }, 100);
      } else {
        reject(new Error('无法创建 Blob'));
      }
    }, 'image/png');
  });
};

export const printElement = (config: PrintElementConfig, canvasConfig: CanvasConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!config.element) {
      console.warn('没有提供有效的元素来打印');
      reject(new Error('无效的打印元素'));
      return;
    }

    const startTime = performance.now();

    generateCanvas(config.element, canvasConfig)
      .then((canvas) => {
        const canvasEndTime = performance.now();
        console.log(`生成 canvas 耗时: ${canvasEndTime - startTime} ms`);

        return downloadImage(canvas, config.title || defaultPrintConfig.title);
      })
      .then(() => {
        const endTime = performance.now();
        console.log(`下载图片耗时: ${endTime - startTime} ms`);
        console.log(`打印完成，总耗时: ${endTime - startTime} ms`);
        resolve();
      })
      .catch((error) => {
        console.error('打印过程中发生错误:', error);
        reject(error);
      });
  });
};
