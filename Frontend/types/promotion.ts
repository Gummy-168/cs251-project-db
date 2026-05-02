export interface PromotionRecord {
  PromotionID: number;
  PromotionName: string;
  DiscountType: "Percentage" | "Fixed Amount";
  DiscountValue: number | string;
  StartDate: string;
  EndDate: string;
  AID: number;
}

export interface PromotionCreatePayload {
  PromotionName: string;
  DiscountType: "Percentage" | "Fixed Amount";
  DiscountValue: number;
  StartDate: string;
  EndDate: string;
  AID: number;
}

export interface PromotionUpdatePayload {
  PromotionName?: string;
  DiscountType?: "Percentage" | "Fixed Amount";
  DiscountValue?: number;
  StartDate?: string;
  EndDate?: string;
}

export interface PromotionValidatePayload {
  PromoCode: string;
  TotalPrice: number;
}

export interface PromotionValidateResult {
  IsValid: boolean;
  PromotionID?: number | null;
  PromotionName?: string | null;
  DiscountType?: "Percentage" | "Fixed Amount" | null;
  DiscountValue: number | string;
  DiscountAmount: number | string;
  FinalPrice: number | string;
  Message: string;
}
