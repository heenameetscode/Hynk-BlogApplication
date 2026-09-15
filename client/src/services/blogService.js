import api from "./api";

export async function fetchBlogs({ search = "", category = "", page = 1, limit = 9 } = {}) {
  const { data } = await api.get("/blogs", { params: { search, category, page, limit } });
  return data;
}

export async function fetchMyBlogs() {
  const { data } = await api.get("/blogs/mine");
  return data;
}

export async function fetchBlogById(id) {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
}

export async function createBlog(payload) {
  const { data } = await api.post("/blogs", payload);
  return data;
}

export async function updateBlog(id, payload) {
  const { data } = await api.put(`/blogs/${id}`, payload);
  return data;
}

export async function deleteBlog(id) {
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
}
