import axios from 'axios';

export const searchUsers = (username: string) => {
  return axios.get(`https://api.github.com/search/users?per_page=5&q=${username}`);
};

export const getUserRepos = (login: string) => {
  return axios.get(`https://api.github.com/users/${login}/repos`);
};