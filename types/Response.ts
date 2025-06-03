import type { RawMovie } from 'Movie'
import type { RawSeries } from 'Series'

export interface Response {
  page: number
  total_pages: number
  total_results: number
}

export interface MovieResponse extends Response {
  results: RawMovie[]
}

export interface SeriesResponse extends Response {
  results: RawSeries[]
}