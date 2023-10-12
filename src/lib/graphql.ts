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

export { mediaInfoQuery }
