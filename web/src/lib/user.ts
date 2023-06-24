import { writable } from "svelte/store";

type User = {
  name: string;
  email: string;
};

export const userStore = writable<User>({ name: "guest", email: "guest" });
