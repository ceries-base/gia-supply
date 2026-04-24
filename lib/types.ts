export interface VariantDetail {
  color: string
  length: string | null
  qty: number
  price: number | null
}

export interface Product {
  company: string
  title: string
  style: string | null
  product_type: string | null
  hair_type: string | null
  image_url: string | null
  description: string | null
  colors: string[]
  color_swatches: { code: string; url: string }[]
  price: number | null
  comp_price: number | null
  total_qty: number
  in_shopify: boolean
  pallet_codes: number[]
  lengths: string[]
  variant_details: VariantDetail[]
}
