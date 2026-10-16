export interface GenerationParams {
  lens: string;
  dof: string;
  bokeh: string;
  cameraAngle: string;
  shotSize: string;
  pose: string;
  colorStyle: string;
  contrast: string;
  saturation: string;
  background: string;
  keepOriginalBackground: boolean;
  aspectRatio: string;
  resolution: string;
  keepFaceDetail: boolean;
  characterLock: boolean;
  quantity: number;
  seed: number | null;
  userPrompt: string;
}

export interface EditParams {
  brushSize: number;
  feather: number;
  opacity: number;
  editPrompt: string;
  isEraser: boolean;
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  params: GenerationParams;
  angleLabel?: string;
  modelUsed?: string;
}

export interface GenerateRequest {
  referenceImage: string | null;
  lens: string;
  cameraAngle: string;
  shotSize: string;
  pose: string;
  colorStyle: string;
  background: string;
  keepOriginalBackground: boolean;
  aspectRatio: string;
  resolution: string;
  quantity: number;
  seed: number | null;
  characterLock: boolean;
  userPrompt: string;
  systemPrompt?: string;
}

export interface EditRequest {
  sourceImageId: string;
  mask: string;
  editPrompt: string;
  characterLock: boolean;
}

export interface GenerateResponse {
  images: Array<{
    id: string;
    url: string;
    meta?: any;
  }>;
  usedPrompt: string;
  seedUsed?: number;
}