import axios from "../axios";

export const useMinorgan = {
  create: (state) =>
    axios.post("/user/create", state, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
  list: (params = {}) => {
    const defaultParams = {
      limit: 13,
      page: 1,
      role: "USER",
    };

    const finalParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(finalParams).toString();

    return axios.get(`/user/list?${queryString}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },
  remove: (id) =>
    axios.delete(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
  update: (state) =>
    axios.patch(`/user/update`, state, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      },
    }),
};
