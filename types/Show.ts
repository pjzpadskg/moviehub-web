export interface RawShow {
  id: number
  title?: string
  name?: string
  media_type: 'movie' | 'tv'
  backdrop_path?: string
  poster_path?: string
  release_date?: string
  first_air_date?: string
}

export interface Show {
  id: number
  title: string
  type: 'movie' | 'tv'
  backdrop?: string
  poster?: string
  date: string
}
