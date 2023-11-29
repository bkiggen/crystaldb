import type { ColorT } from "../types/Color";
import makeRequest from "./makeRequest";

export const getAllColors = async () => {
  const query = `
    query {
      getAllColors {
        id
        name
        hex
      }
    }
  `;

  const response = await makeRequest<{ getAllColors: ColorT[] }>(query);
  return response.getAllColors;
};
