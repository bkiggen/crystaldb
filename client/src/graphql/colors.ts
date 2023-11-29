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

export const createColor = async (newColor: ColorT) => {
  const { name, hex } = newColor;

  const mutation = `
    mutation {
      createColor(input: {
        name: "${name}",
        hex: "${hex}",
      }) {
        id
        name
        hex
      }
    }
  `;

  const response = await makeRequest<{ createColor: ColorT }>(mutation);
  return response.createColor;
};
