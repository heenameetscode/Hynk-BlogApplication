import api from "./api";

export async function fetchProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/users/profile", payload);
  return data;
}
