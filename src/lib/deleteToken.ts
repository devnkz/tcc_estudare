"use client";

import Cookies from "js-cookie";

export function deleteToken(cookieName = "token") {
  Cookies.remove(cookieName);
}
