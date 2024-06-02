export const getApiURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  } else {
    return "https://great-notes.projects.bbdgrad.com"
  }
}