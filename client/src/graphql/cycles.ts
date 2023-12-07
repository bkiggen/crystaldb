import type { CycleT } from '../types/Cycle'
import makeRequest from './makeRequest'

export const createCycle = async (newCycle: Omit<CycleT, 'id'>) => {
  const { shippedOn, month, week, crystalIds } = newCycle

  const mutation = `
    mutation {
      createCycle(input: {
        shippedOn: "${shippedOn}",
        month: ${month},
        week: ${week},
        crystalIds: [${crystalIds}]
      }) {
        id
        shippedOn
        month
        week
        createdAt
      }
    }
  `

  const response = await makeRequest<{ createCycle: CycleT }>(mutation)
  return response.createCycle
}

export const getAllCycles = async () => {
  const query = `
    query {
      getAllCycles {
        id
        shippedOn
        month
        week
        updatedAt
        crystals {
          id
          name
          color {
            id
            name
            hex
          }
          category
          rarity
          description
          image
          findAge
        }
      }
    }
  `

  const data = await makeRequest<{ getAllCycles: CycleT[] }>(query)
  return data.getAllCycles
}
