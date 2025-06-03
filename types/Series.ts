export interface Series {
  id: number
  title: string
  overview: string
  poster: string
  backdrop: string
  date: string
}

export interface RawSeries {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
}