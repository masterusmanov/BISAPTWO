import axios from "../axios";

export const useModerator = {
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
    };

    const finalParams = { ...defaultParams, ...params };

    const queryParams = new URLSearchParams();
    for (const key in finalParams) {
      if (finalParams[key] !== undefined && finalParams[key] !== null) {
        if (Array.isArray(finalParams[key])) {
          finalParams[key].forEach((value) => queryParams.append(key, value));
        } else {
          queryParams.append(key, finalParams[key]);
        }
      }
    }

    return axios.get(`/user/list?${queryParams.toString()}`, {
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
  update: (id, state) =>
    axios.patch(`/user/${id}`, state, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
};
