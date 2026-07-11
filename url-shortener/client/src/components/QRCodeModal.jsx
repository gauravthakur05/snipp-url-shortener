import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FiX, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const QRCodeModal = ({ open, onClose, url }) => {
  const wrapperRef = useRef(null);

  const handleDownload = () => {
    const svg = wrapperRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 16, 16, size - 32, size - 32);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        toast.success('QR code downloaded');
      }, 'image/png');
    };
    img.src = svgUrl;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-brand-surface p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Scan your QR code</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <FiX />
              </button>
            </div>

            <div ref={wrapperRef} className="flex justify-center rounded-xl bg-white p-6">
              <QRCode value={url} size={200} fgColor="#0B0B14" bgColor="#ffffff" />
            </div>

            <p className="mt-4 truncate text-center text-sm text-slate-500 dark:text-slate-400">{url}</p>

            <button onClick={handleDownload} className="btn-primary mt-5 w-full">
              <FiDownload /> Download PNG
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;
