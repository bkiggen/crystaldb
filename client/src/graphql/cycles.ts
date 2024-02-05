import type { CycleT } from "../types/Cycle"
import makeRequest from "./makeRequest"

export const createCycle = async (newCycle: Omit<CycleT, "id">) => {
  const { month, year, cycle, cycleRangeStart, cycleRangeEnd, crystalIds } = newCycle

  const mutation = `
    mutation {
      createCycle(input: {
        month: ${month},
        year: ${year},
        cycle: ${cycle},
        cycleRangeStart: ${cycleRangeStart},
        cycleRangeEnd: ${cycleRangeEnd},
        crystalIds: [${crystalIds}]
      }) {
        id
        shippedOn
        month
        year
        cycle
        cycleRangeStart
        cycleRangeEnd
        crystalIds
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
        year
        cycle
        cycleRangeStart
        cycleRangeEnd
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
