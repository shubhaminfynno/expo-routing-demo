export type RandomUser = {
  gender: string;
  name: { title: string; first: string; last: string };
  email: string;
  login: { uuid: string; username: string };
  picture: { large: string; medium: string; thumbnail: string };
  location?: { city?: string; state?: string; country?: string };
  nat?: string;
};

const BASE_URL = "https://randomuser.me/api/";

export const fetchPhotos = async (
  page = 1,
  limit = 10
): Promise<RandomUser[]> => {
  const url = `${BASE_URL}?page=${page}&results=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const json = await response.json();
  return json.results as RandomUser[];
};
