import { atom } from "recoil";

export namespace UserState {
  export const token = atom({
    key: "UserState.token",
    default: undefined as string | undefined,
  });
}