export const EMAIL_CONTENT = {
  EPISODE: {
    SUBJECT: "Check out this episode",
    BODY: "Hey, I wanted you to see this episode.",
  },
  CHARACTER: {
    SUBJECT: "Check out this character",
    BODY: "Hey, I wanted you to see this character.",
  },
  PROJECT: {
    SUBJECT: "Check out this project",
    BODY: "Hey, I wanted you to see this project.",
  },
  FILE: {
    SUBJECT: (title) => `Check out this article: ${title || "File"}`,
    BODY: "Hey, check this out.",
  },
  USER: {
    SUBJECT: "Check out this user",
    BODY: "Hey, I wanted you to see this user profile.",
  },
};
