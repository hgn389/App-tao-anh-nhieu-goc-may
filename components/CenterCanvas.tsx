import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { GeneratedImage, EditParams } from '../types';
import { ZoomIn, ZoomOut, Maximize, SplitSquareVertical, Eye, Download, Trash2, Camera, Sparkles } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../constants';

export interface CenterCanvasHandle {
  clearMask: () => void;
  invertMask: () => void;
  getMaskDataUrl: () => string | null;
}

interface CenterCanvasProps {
  viewMode: 'input' | 'output' | 'compare';
  setViewMode: (mode: 'input' | 'output' | 'compare') => void;
  inputImage: string | null;
  displayImage: string | null;
  history: GeneratedImage[];
  selectedHistoryId: string | null;
  onSelectHistory: (image: GeneratedImage) => void;
  onDeleteHistory?: (id: string) => void;
  editParams: EditParams;
  onSelectSamplePreset: (preset: SamplePreset) => void;
  onUploadClick: () => void;
  isGenerating?: boolean;
}

const CenterCanvas = forwardRef<CenterCanvasHandle, CenterCanvasProps>(({
  viewMode,
  setViewMode,
  inputImage,
  displayImage,
  history,
  selectedHistoryId,
  onSelectHistory,
  onDeleteHistory,
  editParams,
  onSelectSamplePreset,
  onUploadClick,
  isGenerating = false,
}, ref) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [compareSplit, setCompareSplit] = useState(50); // percentage 0-100
  const isComparing = viewMode === 'compare' && !!inputImage && !!displayImage;

  // Masking Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Expose imperative methods to parent (clear, invert, get mask)
  useImperativeHandle(ref, () => ({
    clearMask: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    invertMask: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Invert alpha: if drawn (alpha > 0), set to 0; else set red mask
        if (data[i + 3] > 0) {
          data[i + 3] = 0;
        } else {
          data[i] = 239;     // red
          data[i + 1] = 68;
          data[i + 2] = 68;
          data[i + 3] = 160;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    },
    getMaskDataUrl: () => {
      return canvasRef.current?.toDataURL('image/png') || null;
    }
  }));

  // Reset zoom/pan when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [displayImage, viewMode]);

  // Handle Canvas Drawing
  const getMousePos = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (e.button !== 0 || !displayImage || isComparing) return;
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = editParams.isEraser ? 'rgba(0,0,0,1)' : 'rgba(239, 68, 68, 0.75)';
      ctx.globalCompositeOperation = editParams.isEraser ? 'destination-out' : 'source-over';
      ctx.lineWidth = editParams.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const { x, y } = getMousePos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Sync canvas size to image natural size
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (canvasRef.current) {
      canvasRef.current.width = e.currentTarget.naturalWidth || 800;
      canvasRef.current.height = e.currentTarget.naturalHeight || 800;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.shiftKey || e.altKey) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else {
      startDrawing(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else {
      draw(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    stopDrawing();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(s => Math.min(Math.max(0.2, Number((s * delta).toFixed(2))), 4));
    }
  };

  const currentActiveImage = displayImage;

  return (
    <div className="h-full flex flex-col bg-[#0b0f17] text-gray-200 overflow-hidden relative select-none">
      
      {/* Top Bar: Tabs & View Controls */}
      <div className="h-12 bg-[#101623] border-b border-gray-800 flex items-center justify-between px-3 md:px-5 z-10 shrink-0">
        <div className="flex bg-[#1a2333] p-1 rounded-lg border border-gray-700/60">
          <button 
            onClick={() => setViewMode('input')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'input' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            ẢNH MẪU (GỐC)
          </button>
          <button 
            onClick={() => setViewMode('output')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'output' ? 'bg-amber-500 text-black shadow-sm font-bold' : 'text-gray-400 hover:text-gray-200'}`}
          >
            ẢNH KẾT QUẢ
          </button>
          {inputImage && history.length > 0 && (
            <button 
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${viewMode === 'compare' ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <SplitSquareVertical size={13} />
              SO SÁNH
            </button>
          )}
        </div>
        
        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="hidden xl:inline text-[11px] text-gray-400 font-mono">
            {isComparing ? 'Kéo thanh trượt để so sánh' : 'Shift + Drag để di chuyển • Vẽ để tạo Mask'}
          </span>
          <div className="flex items-center bg-[#1a2333] border border-gray-700/60 rounded-md px-1 py-0.5 text-xs text-gray-300">
            <button 
              onClick={() => setScale(s => Math.max(0.2, Number((s - 0.15).toFixed(2))))} 
              className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
              title="Thu nhỏ"
            >
              <ZoomOut size={15}/>
            </button>
            <span className="w-12 text-center font-mono font-medium text-[11px] text-amber-400">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(s => Math.min(4, Number((s + 0.15).toFixed(2))))} 
              className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
              title="Phóng to"
            >
              <ZoomIn size={15}/>
            </button>
            <button 
              onClick={() => { setScale(1); setPosition({x:0,y:0}); }} 
              className="p-1 ml-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white border-l border-gray-700"
              title="Đặt lại khung nhìn (100%)"
            >
              <Maximize size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative flex items-center justify-center bg-canvas-pattern cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {isGenerating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <Camera className="w-7 h-7 text-amber-400 absolute inset-0 m-auto" />
            </div>
            <p className="text-white font-medium text-sm animate-pulse">Đang định vị góc máy & tạo chi tiết nhân vật...</p>
            <span className="text-xs text-gray-400 font-mono">Gemini AI Image Engine</span>
          </div>
        )}

        {isComparing ? (
          /* Side-by-side or Split Comparison View */
          <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.08s ease-out',
            }}
            className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-700 max-h-[82vh] max-w-[85vw]"
          >
            <div className="relative select-none">
              {/* Output Image (Underneath) */}
              <img 
                src={displayImage || ''} 
                alt="Kết quả" 
                className="max-h-[75vh] w-auto object-contain block pointer-events-none" 
              />
              {/* Reference Image (Clipped on top) */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${compareSplit}%`, borderRight: '2px solid #F59E0B' }}
              >
                <img 
                  src={inputImage || ''} 
                  alt="Ảnh gốc" 
                  className="max-h-[75vh] w-auto object-contain block max-w-none pointer-events-none" 
                />
              </div>

              {/* Split Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
                style={{ left: `${compareSplit}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startSplit = compareSplit;
                  const onMove = (moveEvt: MouseEvent) => {
                    const diff = moveEvt.clientX - startX;
                    const newSplit = Math.max(5, Math.min(95, startSplit + (diff / 4)));
                    setCompareSplit(newSplit);
                  };
                  const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                  };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 shadow-lg border-2 border-white flex items-center justify-center text-black font-bold text-[10px]">
                  ↔
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-white border border-white/20">
                Ảnh gốc mẫu
              </div>
              <div className="absolute top-3 right-3 bg-amber-500/90 text-black backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold shadow-md">
                Góc máy mới
              </div>
            </div>
          </div>
        ) : currentActiveImage ? (
          <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.08s ease-out'
            }}
            className="relative shadow-2xl rounded-md overflow-hidden border border-gray-800"
          >
            <img 
              src={currentActiveImage} 
              alt="Main View" 
              className="max-h-[75vh] max-w-[85vw] object-contain block pointer-events-none select-none"
              onLoad={onImageLoad}
            />
            {/* Mask Canvas Overlay */}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: editParams.opacity }}
            />
          </div>
        ) : (
          /* Empty State: Intuitive Welcome Studio */
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-inner">
              <Camera size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Studio Chụp Ảnh Đa Góc Máy</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md">
              Tải lên ảnh chân dung nhân vật của bạn, hệ thống AI sẽ tự động phân tích và tái tạo góc máy mới (Front, 3/4, Nghiêng 90°, Worm-eye, Turnaround...) với nhận diện khuôn mặt đồng nhất.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button 
                onClick={onUploadClick}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2"
              >
                <Camera size={16} />
                Tải ảnh chân dung của bạn
              </button>
            </div>

            {/* Presets Selection */}
            <div className="w-full bg-[#131b2b]/80 border border-gray-800 rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Hoặc chọn nhanh 1 nhân vật mẫu:
                </span>
                <span className="text-[11px] text-gray-500">Bấm để dùng ngay</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectSamplePreset(preset)}
                    className="group relative rounded-lg overflow-hidden border border-gray-700 hover:border-amber-400 transition-all text-left bg-gray-900 focus:outline-none"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src={preset.url} 
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-1.5 bg-gray-950/90 border-t border-gray-800">
                      <p className="text-[11px] font-semibold text-white truncate">{preset.name}</p>
                      <span className="text-[10px] text-amber-400/90 font-medium">{preset.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom History Grid */}
      <div className="h-32 bg-[#101623] border-t border-gray-800 flex flex-col z-10 shrink-0">
        <div className="px-4 py-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-gray-800/60 bg-[#0d121c]">
          <span className="flex items-center gap-1.5 text-gray-300">
            <span>Lịch sử góc máy đã tạo</span>
            {history.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">
                {history.length}
              </span>
            )}
          </span>
          <span className="text-[10px] text-gray-500">
            {history.length > 0 ? 'Nhấp vào ảnh để xem toàn màn hình' : 'Chưa có ảnh góc máy nào'}
          </span>
        </div>

        <div className="flex-1 overflow-x-auto flex items-center gap-2.5 px-3 py-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex items-center text-xs text-gray-500 pl-2 gap-2">
              <Camera size={16} className="opacity-40" />
              <span>Chưa có ảnh nào được tạo. Chọn cấu hình bên trái và nhấn <b className="text-amber-400">TẠO</b> để bắt đầu.</span>
            </div>
          ) : (
            history.map((img) => (
              <div 
                key={img.id}
                onClick={() => onSelectHistory(img)}
                className={`relative min-w-[84px] h-[84px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all group shrink-0 ${
                  selectedHistoryId === img.id ? 'border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]' : 'border-gray-700 hover:border-gray-400'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="History Item" />
                
                {/* Angle Tag Badge */}
                <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-amber-400 border border-amber-500/30">
                  {img.angleLabel || img.params.cameraAngle || 'Angle'}
                </div>

                {/* Hover overlay with Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                  <div className="flex items-center justify-between text-white text-[10px]">
                    <span className="truncate max-w-[45px] text-[9px] text-gray-300">
                      {new Date(img.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {onDeleteHistory && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(img.id);
                        }}
                        className="p-1 hover:bg-red-600/80 rounded text-gray-300 hover:text-white transition-colors"
                        title="Xóa ảnh này"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default CenterCanvas;