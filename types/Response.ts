import type { RawMovie } from 'Movie'
import type { RawSeries } from 'Series'
import type { RawShow } from 'Show'

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

export interface ShowResponse extends Response {
  results: RawShow[]
}

