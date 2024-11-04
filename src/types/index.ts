export interface PhotoSize {
  name: string
  width: number
  height: number
}

export interface PhotoModule extends PhotoSize {
  id: string
  x: number
  y: number
  rotation: number
} 