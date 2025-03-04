export interface GenerationParams {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_size: string;
  batch_size: number;
  seed: number;
  num_inference_steps: number;
  guidance_scale: number;
  image?: string;
}

export interface GenerationResult {
  created: number;
  data: Array<{
    url: string;
  }>;
}
