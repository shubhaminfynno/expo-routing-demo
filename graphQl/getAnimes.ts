import { gql } from "graphql-request";

export const GET_ANIMES = gql`
  query GetAnimes($perPage: Int = 100) {
    Page(perPage: $perPage) {
      media(type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          medium
          large
        }
        description
        format
        episodes
        status
        startDate {
          year
          month
          day
        }
        averageScore
      }
    }
  }
`;

export const GET_ANIME_BY_ID = gql`
  query GetAnimeById($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        medium
        large
      }
      description
      format
      episodes
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      genres
      studios {
        nodes {
          name
        }
      }
    }
  }
`;

export const LIKE_ANIME = gql`
  mutation LikeAnime($mediaId: Int) {
    ToggleFavourite(animeId: $mediaId) {
      anime {
        pageInfo {
          total
        }
      }
    }
  }
`;
