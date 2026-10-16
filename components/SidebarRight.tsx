import React from 'react';
import { EditParams } from '../types';
import { Brush, Eraser, Download, Wand2, Sparkles, Layers, Sliders, RefreshCw, Palette } from 'lucide-react';

interface SidebarRightProps {
  editParams: EditParams;
  setEditParams: React.Dispatch<React.SetStateAction<EditParams>>;
  onEdit: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  hasSelectedImage: boolean;
  onClearMask: () => void;
  onInvertMask: () => void;
}

const QUICK_EDITS = [
  'Đổi màu trang phục sang màu đen sang trọng',
  'Tăng độ sắc nét ánh mắt và chi tiết khuôn mặt',
  'Thay đổi ánh sáng ven tóc phong cách studio',
  'Làm mịn và gọn kiểu tóc tự nhiên',
];

const SidebarRight: React.FC<SidebarRightProps> = ({
  editParams,
  setEditParams,
  onEdit,
  onDownload,
  isProcessing,
  hasSelectedImage,
  onClearMask,
  onInvertMask
}) => {
  const handleChange = (key: keyof EditParams, value: any) => {
    setEditParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full flex flex-col bg-[#0e131d] text-gray-300 border-l border-gray-800 select-none">
      
      {/* Title */}
      <div className="p-3.5 border-b border-gray-800 bg-[#090d14] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-amber-400" />
          <h2 className="font-bold text-sm tracking-wide text-white uppercase">Chỉnh Sửa & Mask</h2>
        </div>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
          Inpainting
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 custom-scrollbar">
        
        {/* Mask Painting Tools */}
        <div className="space-y-3">
          <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
            <Brush size={14} />
            <span>Công Cụ Mask (Vùng chọn)</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleChange('isEraser', false)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                !editParams.isEraser 
                  ? 'bg-amber-500 text-black border-amber-500 shadow' 
                  : 'bg-[#151c2a] border-gray-700 hover:border-gray-500 text-gray-300'
              }`}
            >
              <Brush size={16} />
              <span>Vẽ Vùng Cần Đổi</span>
            </button>
            <button 
              onClick={() => handleChange('isEraser', true)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                editParams.isEraser 
                  ? 'bg-amber-500 text-black border-amber-500 shadow' 
                  : 'bg-[#151c2a] border-gray-700 hover:border-gray-500 text-gray-300'
              }`}
            >
              <Eraser size={16} />
              <span>Tẩy / Xóa Cọ</span>
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-3 bg-[#131b2a]/60 p-3 rounded-xl border border-gray-800">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Kích thước cọ (Brush size)</span>
                <span className="font-mono text-amber-400">{editParams.brushSize}px</span>
              </div>
              <input 
                type="range" min="4" max="120" 
                value={editParams.brushSize}
                onChange={(e) => handleChange('brushSize', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Độ mờ hiển thị Mask</span>
                <span className="font-mono text-amber-400">{Math.round(editParams.opacity * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="1" step="0.05"
                value={editParams.opacity}
                onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={onClearMask} 
                className="py-1.5 px-2 bg-[#1b2333] border border-gray-700 hover:border-gray-500 rounded-md text-[11px] font-medium text-gray-300 hover:text-white transition-all text-center"
              >
                Xóa sạch Mask
              </button>
              <button 
                onClick={onInvertMask} 
                className="py-1.5 px-2 bg-[#1b2333] border border-gray-700 hover:border-gray-500 rounded-md text-[11px] font-medium text-gray-300 hover:text-white transition-all text-center"
              >
                Đảo ngược Mask
              </button>
            </div>
          </div>
        </div>

        {/* Edit Prompt Instruction */}
        <div className="space-y-2">
          <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Yêu Cầu Chỉnh Sửa (Prompt)</span>
          </h3>
          
          <textarea 
            className="w-full h-24 bg-[#151c2a] border border-gray-700 rounded-xl p-2.5 text-xs focus:border-amber-400 focus:outline-none resize-none text-white placeholder-gray-500 leading-relaxed"
            placeholder="Mô tả chi tiết phần bạn muốn đổi (ví dụ: làm tóc xoăn nhẹ hơn, thêm áo khoác da màu nâu, chỉnh ánh sáng vàng ấm...)"
            value={editParams.editPrompt}
            onChange={(e) => handleChange('editPrompt', e.target.value)}
          />

          {/* Quick Edit Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-gray-400 font-medium">Gợi ý chỉnh sửa nhanh:</span>
            <div className="flex flex-col gap-1">
              {QUICK_EDITS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChange('editPrompt', item)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-[#131b2a] border border-gray-800 hover:border-amber-500/50 text-gray-300 hover:text-amber-300 transition-all truncate"
                >
                  • {item}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-3.5 bg-[#090d14] border-t border-gray-800 space-y-2 shrink-0">
        <button 
          onClick={onEdit}
          disabled={!hasSelectedImage || isProcessing}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md
            ${!hasSelectedImage || isProcessing
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-98 shadow-blue-600/20'}
          `}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý Inpainting...</span>
            </>
          ) : (
            <>
              <Wand2 size={16} />
              <span>ÁP DỤNG CHỈNH SỬA</span>
            </>
          )}
        </button>
        
        <button 
          onClick={onDownload}
          disabled={!hasSelectedImage}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border
            ${!hasSelectedImage
              ? 'bg-gray-800 text-gray-500 border-gray-800 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-black border-white active:scale-98 shadow'}
          `}
        >
          <Download size={15}/>
          <span>TẢI ẢNH ĐANG XEM</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarRight;