import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

type QRScannerProps = {
  onScanSuccess: (decodedText: string) => void;
};

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [lastScan, setLastScan] = useState("");

  const scannerId = "apna-gyanshala-qr-reader";

  const startScanner = async () => {
    if (isScanning || isStarting) return;

    setIsStarting(true);

    try {
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 260,
            height: 260,
          },
        },
        (decodedText) => {
          if (decodedText === lastScan) return;

          setLastScan(decodedText);
          toast.success("QR Scanned ✅");
          onScanSuccess(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (error) {
      console.error("QR Scanner Error:", error);
      toast.error("Camera start nahi ho paya. Permission allow karo.");
    } finally {
      setIsStarting(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }

      setIsScanning(false);
      toast.success("Scanner stopped");
    } catch (error) {
      console.error("Stop Scanner Error:", error);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black uppercase text-indigo-900">
            Live QR Camera Scanner
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-500">
            Student / Teacher QR ko camera ke samne rakhein.
          </p>
        </div>

        <div className="flex gap-3">
          {!isScanning ? (
            <button
              type="button"
              onClick={startScanner}
              disabled={isStarting}
              className="flex items-center gap-2 bg-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {isStarting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Camera size={16} />
              )}
              Start
            </button>
          ) : (
            <button
              type="button"
              onClick={stopScanner}
              className="flex items-center gap-2 bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700"
            >
              <XCircle size={16} />
              Stop
            </button>
          )}
        </div>
      </div>

      <div
        id={scannerId}
        className="mx-auto min-h-[280px] max-w-sm overflow-hidden rounded-xl border bg-white"
      />

      {lastScan && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <p className="text-xs font-black uppercase tracking-widest">
              Last Scanned
            </p>
          </div>

          <p className="mt-2 break-all text-xs font-bold text-indigo-900">
            {lastScan}
          </p>
        </div>
      )}
    </div>
  );
}