import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";

import privateKey from "../config/privateKey";

const cookies = new Cookies();

export function getToken() {
  const savedToken = jwt.verify(cookies.get("services"), privateKey);

  return `Bearer ${savedToken.accessToken}`;
}

export function getCompanyId() {
  const restaurant = jwt.verify(cookies.get("restaurant"), privateKey);

  return restaurant;
}
