import type { CrystalT } from "../types/Crystal"
import makeRequest from "./makeRequest"

export const createCrystal = async (newCrystal: Omit<CrystalT, "id">) => {
  const { name, colorId, category, rarity, description, image, findAge } = newCrystal

  const mutation = `
    mutation {
      createCrystal(input: {
        name: "${name}",
        colorId: ${colorId !== undefined ? colorId : null},
        category: "${category}",
        rarity: ${rarity !== undefined ? rarity : null},
        description: "${description}",
        image: "${image}",
        findAge: ${findAge !== undefined ? findAge : null},
      }) {
        id
        name
        color {
          id
          name
          hex
        }
        category
        description
        image
        rarity
        findAge
      }
    }
  `

  const response = await makeRequest<{ createCrystal: CrystalT }>(mutation)
  return response.createCrystal
}

export const getAllCrystals = async () => {
  const query = `
      query {
        getAllCrystals {
          id
          name
          description
          image
          rarity
          findAge
          category
          color {
            name
            hex
          }
        }
      }
    `

  const data = await makeRequest<{ getAllCrystals: CrystalT[] }>(query)
  return data.getAllCrystals
}
