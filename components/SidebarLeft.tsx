import React, { useRef } from 'react';
import { Upload, X, RotateCcw, Sparkles, Layers, Sliders, ShieldCheck } from 'lucide-react';
import { GenerationParams } from '../types';
import { LENS_OPTIONS, ANGLE_OPTIONS, COLOR_STYLES, BACKGROUNDS, ASPECT_RATIOS, RESOLUTIONS, SAMPLE_PRESETS, SamplePreset } from '../constants';

interface SidebarLeftProps {
  params: GenerationParams;
  setParams: React.Dispatch<React.SetStateAction<GenerationParams>>;
  onUpload: (file: File) => void;
  onClearImage: () => void;
  inputImage: string | null;
  inputImageName: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
  onSelectSamplePreset: (preset: SamplePreset) => void;
  onGenerateTurnaround?: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 mt-4 border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
    {icon}
    <span>{children}</span>
  </h3>
);

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  params,
  setParams,
  onUpload,
  onClearImage,
  inputImage,
  inputImageName,
  onGenerate,
  isGenerating,
  onReset,
  onSelectSamplePreset,
  onGenerateTurnaround
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof GenerationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  // Common quick angle shortcuts
  const popularAngles = [
    { value: 'front', label: 'Chính diện' },
    { value: 'left_34', label: '3/4 Trái' },
    { value: 'right_34', label: '3/4 Phải' },
    { value: 'left_profile', label: 'Nghiêng 90°' },
    { value: 'low_angle', label: 'Góc thấp' },
    { value: 'turnaround', label: '5 Góc (Turnaround)' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0e131d] text-gray-300 border-r border-gray-800 overflow-hidden select-none">
      
      {/* Header */}
      <div className="p-3.5 border-b border-gray-800 flex justify-between items-center bg-[#090d14] shrink-0">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-amber-400" />
          <h2 className="font-bold text-sm tracking-wide text-white uppercase">Cấu Hình Góc Máy</h2>
        </div>
        <button 
          onClick={onReset}
          className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
          title="Đặt lại các thông số mặc định"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Form Controls */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        
        {/* 1. Reference Image */}
        <div className="space-y-2">
          <SectionTitle>1. Ảnh Nhân Vật Mẫu (Input)</SectionTitle>
          
          {!inputImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 hover:border-amber-500/80 rounded-xl cursor-pointer bg-[#131b2a]/50 hover:bg-[#131b2a] transition-all group"
            >
              <Upload className="w-6 h-6 mb-1.5 text-gray-400 group-hover:text-amber-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-gray-300 group-hover:text-amber-300">Bấm để tải ảnh chân dung</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Hỗ trợ PNG, JPG, WEBP (Rõ mặt)</p>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileChange} 
              />
            </div>
          ) : (
            <div className="relative group rounded-xl overflow-hidden border border-gray-700 bg-black">
              <img src={inputImage} alt="Input" className="w-full h-36 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
                <span className="text-[11px] font-medium text-white truncate max-w-[70%] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {inputImageName || 'Ảnh nhân vật mẫu'}
                </span>
                <button 
                  onClick={onClearImage} 
                  className="bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-md text-xs flex items-center shadow transition-all"
                  title="Xóa và chọn ảnh khác"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Quick Preset Selector */}
          <div className="pt-1">
            <div className="text-[11px] font-medium text-gray-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-300">
                <Sparkles size={12} className="text-amber-400" /> Chọn nhanh mẫu có sẵn:
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectSamplePreset(preset)}
                  className="group relative rounded-md overflow-hidden border border-gray-700 hover:border-amber-400 transition-all focus:outline-none"
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-11 object-cover group-hover:scale-110 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Camera Angle */}
        <div>
          <div className="flex items-center justify-between">
            <SectionTitle>2. Góc Máy (Camera Angle)</SectionTitle>
            {onGenerateTurnaround && (
              <button
                onClick={onGenerateTurnaround}
                disabled={!inputImage || isGenerating}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded hover:bg-amber-500/20 disabled:opacity-40"
              >
                <Layers size={11} /> Tạo 5 góc cùng lúc
              </button>
            )}
          </div>

          {/* Quick Angle Chips */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {popularAngles.map(ang => (
              <button
                key={ang.value}
                onClick={() => handleChange('cameraAngle', ang.value)}
                className={`py-1.5 px-2 text-[11px] rounded font-medium border text-center transition-all truncate ${
                  params.cameraAngle === ang.value
                    ? 'bg-amber-500 text-black border-amber-500 font-bold shadow'
                    : 'bg-[#151c2a] border-gray-700/80 hover:border-gray-500 text-gray-300'
                }`}
              >
                {ang.label}
              </button>
            ))}
          </div>

          <select 
            className="w-full bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none text-white"
            value={params.cameraAngle}
            onChange={(e) => handleChange('cameraAngle', e.target.value)}
          >
            {ANGLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Cỡ khung hình (Shot)</label>
              <select 
                className="w-full bg-[#151c2a] border border-gray-700 rounded-md p-1.5 text-xs focus:border-amber-400 focus:outline-none text-gray-200"
                value={params.shotSize}
                onChange={(e) => handleChange('shotSize', e.target.value)}
              >
                <option value="close_up">Cận mặt (Close-up)</option>
                <option value="medium_shot">Nửa người (Medium Shot)</option>
                <option value="cowboy_shot">Từ hông lên (Cowboy Shot)</option>
                <option value="full_body">Toàn thân (Full Body)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Tư thế (Pose)</label>
              <input 
                type="text" 
                placeholder="Tự nhiên, nhìn thẳng, quay đầu..." 
                className="w-full bg-[#151c2a] border border-gray-700 rounded-md p-1.5 text-xs focus:border-amber-400 focus:outline-none text-gray-200 placeholder-gray-500"
                value={params.pose}
                onChange={(e) => handleChange('pose', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. Lens & DOF */}
        <div>
          <SectionTitle>3. Tiêu Cự & Độ Sâu (Lens / DOF)</SectionTitle>
          <select 
            className="w-full bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none text-white"
            value={params.lens}
            onChange={(e) => handleChange('lens', e.target.value)}
          >
            {LENS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Độ sâu trường ảnh</label>
              <select 
                className="w-full bg-[#151c2a] border border-gray-700 rounded-md p-1.5 text-xs focus:border-amber-400 focus:outline-none text-gray-200"
                value={params.dof}
                onChange={(e) => handleChange('dof', e.target.value)}
              >
                <option value="shallow">DOF Nông (Xóa phông mờ)</option>
                <option value="medium">DOF Vừa (Chuẩn chân dung)</option>
                <option value="deep">DOF Sâu (Rõ nét toàn cảnh)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Hiệu ứng Bokeh</label>
              <select 
                className="w-full bg-[#151c2a] border border-gray-700 rounded-md p-1.5 text-xs focus:border-amber-400 focus:outline-none text-gray-200"
                value={params.bokeh}
                onChange={(e) => handleChange('bokeh', e.target.value)}
              >
                <option value="off">Tắt Bokeh</option>
                <option value="soft">Bokeh Tròn mịn (Soft)</option>
                <option value="strong">Bokeh Ánh sáng mạnh (Cinematic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Color & Lighting */}
        <div>
          <SectionTitle>4. Phong Cách Màu & Ánh Sáng</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_STYLES.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleChange('colorStyle', opt.value)}
                className={`px-2 py-1 text-[11px] rounded-md border transition-all ${
                  params.colorStyle === opt.value 
                  ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                  : 'bg-[#151c2a] border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Background */}
        <div>
          <SectionTitle>5. Phông Nền (Background)</SectionTitle>
          <select 
            className="w-full bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none text-white"
            value={params.background}
            onChange={(e) => handleChange('background', e.target.value)}
          >
            {BACKGROUNDS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer text-gray-300 hover:text-white">
            <input 
              type="checkbox" 
              checked={params.keepOriginalBackground}
              onChange={(e) => handleChange('keepOriginalBackground', e.target.checked)}
              className="rounded accent-amber-500 h-4 w-4"
            />
            <span>Đồng bộ bối cảnh ánh sáng với ảnh gốc</span>
          </label>
        </div>

        {/* 6 & 7. Ratio & Resolution */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <SectionTitle>6. Tỷ Lệ</SectionTitle>
            <select 
              className="w-full bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none text-white"
              value={params.aspectRatio}
              onChange={(e) => handleChange('aspectRatio', e.target.value)}
            >
              {ASPECT_RATIOS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <SectionTitle>7. Chất Lượng</SectionTitle>
            <select 
              className="w-full bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none text-white"
              value={params.resolution}
              onChange={(e) => handleChange('resolution', e.target.value)}
            >
              {RESOLUTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        
        {/* Character Lock & Face Preservation */}
        <div className="space-y-2 pt-1 bg-[#131b2a]/60 p-3 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="text-amber-400" size={16} />
              <span className="text-xs font-bold text-white">Character Lock (Khóa danh tính)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={params.characterLock} 
                onChange={(e) => handleChange('characterLock', e.target.checked)} 
              />
              <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          <p className="text-[10px] text-gray-400">
            Bảo đảm các đặc điểm nhận diện: đường nét khuôn mặt, ánh mắt, tóc, và trang phục chuẩn khớp tuyệt đối với người mẫu gốc.
          </p>

          <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer text-gray-300">
            <input 
              type="checkbox" 
              checked={params.keepFaceDetail}
              onChange={(e) => handleChange('keepFaceDetail', e.target.checked)}
              className="rounded accent-amber-500 h-3.5 w-3.5"
            />
            <span>Tối ưu độ sắc nét cấu trúc vi mô khuôn mặt</span>
          </label>
        </div>

        {/* 8. Extra Prompt */}
        <div>
          <SectionTitle>8. Prompt Bổ Sung (Tùy chọn)</SectionTitle>
          <textarea 
            className="w-full h-18 bg-[#151c2a] border border-gray-700 rounded-lg p-2 text-xs focus:border-amber-400 focus:outline-none resize-none text-white placeholder-gray-500"
            placeholder="Ví dụ: Giữ biểu cảm mỉm cười nhẹ, bổ sung ánh sáng ven tóc rim-light..."
            value={params.userPrompt}
            onChange={(e) => handleChange('userPrompt', e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-semibold text-gray-300">Số lượng ảnh tạo:</span>
          <div className="flex gap-1.5">
            {[1, 2, 4].map(num => (
              <button 
                key={num}
                onClick={() => handleChange('quantity', num)}
                className={`w-7 h-7 rounded text-xs font-bold border transition-all ${
                  params.quantity === num 
                    ? 'bg-amber-500 text-black border-amber-500 shadow' 
                    : 'bg-[#151c2a] text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Generate Button Footer */}
      <div className="p-3.5 bg-[#090d14] border-t border-gray-800 shrink-0">
        <button 
          onClick={onGenerate}
          disabled={isGenerating || !inputImage}
          className={`w-full py-3 rounded-xl font-bold text-black uppercase tracking-wider text-xs shadow-lg transition-all flex items-center justify-center gap-2
            ${isGenerating || !inputImage 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
              : 'bg-amber-500 hover:bg-amber-400 active:scale-98 shadow-amber-500/20'}
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Đang tính toán góc máy...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>TẠO ẢNH GÓC MÁY MỚI</span>
            </>
          )}
        </button>
        {!inputImage && (
          <p className="text-center text-amber-500/80 text-[11px] mt-1.5 font-medium">
            * Hãy chọn hoặc tải ảnh mẫu ở mục 1 để bắt đầu
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;