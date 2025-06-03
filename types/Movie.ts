export interface Movie {
  id: number
  title: string
  overview: string
  poster: string
  backdrop: string
  date: string
}

export interface RawMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
}