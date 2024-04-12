import { getUrl } from "../utils/helpers";
import { user } from "../interfaces/common";

export const getUserByUsername = async ({ username }: { username: string }) => {
  try {
    const resp = await fetch(getUrl(`user/${username}`), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("user not found");
    }

    const user: user = await resp.json();
    return user;
  } catch (err) {
    console.error(err);
  }
};

export const createPrivateChat = async ({ id }: { id: string }) => {
  try {
    const resp = await fetch(getUrl(`chat/new/${id}`), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("user not found");
    }

    const chat = await resp.json();
    return chat;
  } catch (err) {
    console.error(err);
  }
};
