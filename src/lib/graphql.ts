const mediaInfoQuery = `
  query ($id: Int) {
    Media(id: $id) {
        id
        type
        format
        title {
            romaji
            english
            native
        }
        coverImage {
            extraLarge
            large
            color
        }
        bannerImage
        description
        episodes
        nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
        }
        averageScore
        popularity
        status
        genres
        season
        seasonYear
        duration
        relations {
            edges {
                id
                relationType(version: 2)
                node {
                  id
                  title {
                    userPreferred
                  }
                  format
                  type
                  status(version: 2)
                  bannerImage
                  coverImage {
                    extraLarge
                    color
                  }
                }
            }
        }
        recommendations {
                nodes {
                    mediaRecommendation {
                        id
                        title {
                            romaji
                        }
                        coverImage {
                            extraLarge
                            large
                        }
                    }
            }
        }
        characters {
          edges {
            role
            node {
              id
              image {
                large
                medium
              }
              name {
                full
                userPreferred
              }
            }
          }
        }
    }
}`

const profileQuery = `query ($username: String, $status: MediaListStatus) {
            MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
              user {
                id
                name
                about (asHtml: true)
                createdAt
                avatar {
                    large
                }
                statistics {
                  anime {
                      count
                      episodesWatched
                      meanScore
                      minutesWatched
                  }
              }
                bannerImage
                mediaListOptions {
                  animeList {
                      sectionOrder
                  }
                }
              }
              lists {
                status
                name
                entries {
                  id
                  mediaId
                  status
                  progress
                  score
                  media {
                    id
                    status
                    title {
                      english
                      romaji
                    }
                    episodes
                    coverImage {
                      large
                    }
                  }
                }
              }
            }
          }
        `

export { mediaInfoQuery, profileQuery }
