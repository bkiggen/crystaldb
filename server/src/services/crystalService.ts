import { Crystal, Inventory } from '../entity/Crystal'
import { Shipment } from '../entity/Shipment'
import { PreBuild } from '../entity/PreBuild'
import {
  In,
  Not,
  MoreThan,
  SelectQueryBuilder,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm'

const getPreviousShipmentCrystalIds = async (
  month: number,
  year: number,
  cycle: number,
  subscriptionId: number
) => {
  const previouslySentCrystals = []

  let currentCycle = cycle
  let currentMonth = month
  let currentYear = year

  while (currentCycle > 1) {
    currentCycle--

    // Adjust month and year as needed
    if (currentMonth === 0) {
      currentMonth = 11
      currentYear--
    } else {
      currentMonth--
    }

    // Fetch shipments for the previous cycle
    const specificCycleShipment = await Shipment.findOne({
      where: {
        month: currentMonth,
        year: currentYear,
        cycle: currentCycle,
        subscription: {
          id: subscriptionId,
        },
      },
      relations: ['crystals'],
    })

    if (specificCycleShipment) {
      const crystalIds = specificCycleShipment.crystals.map(
        crystal => crystal.id
      )
      previouslySentCrystals.push(...crystalIds)
    }

    // Fetch shipments where the current cycle falls within the range of cycleRangeStart and cycleRangeEnd
    const rangeShipments = await Shipment.find({
      where: {
        month: currentMonth,
        year: currentYear,
        subscription: {
          id: subscriptionId,
        },
      },
      relations: ['crystals'],
    })

    // Collect crystal IDs from shipments in the range
    for (const shipment of rangeShipments) {
      const crystalIds = shipment.crystals.map(crystal => crystal.id)
      previouslySentCrystals.push(...crystalIds)
    }
  }

  // Ensure unique crystal IDs
  const uniqueCrystals = [...new Set(previouslySentCrystals)]

  return uniqueCrystals
}

const getUpcomingPrebuildCrystalIds = async (
  cycle: number,
  subscriptionId: number
) => {
  const preBuilds = await PreBuild.find({
    where: {
      cycle: MoreThan(cycle),
      subscription: {
        id: subscriptionId,
      },
    },
    relations: {
      crystals: true,
    },
  })

  const crystalIds = new Set(
    preBuilds.flatMap(preBuild => preBuild.crystals.map(crystal => crystal.id))
  )

  const uniqueCrystalIds = Array.from(crystalIds)

  return uniqueCrystalIds
}

export const addFilters = (query: SelectQueryBuilder<any>, allFilters: any) => {
  Object.keys(allFilters).forEach(filterKey => {
    const filterValue = allFilters[filterKey]
    if (typeof filterValue === 'string' && filterValue.trim() !== '') {
      const filterArray = filterValue.split(',').map(item => item.trim())
      if (filterArray.length > 0) {
        if (filterKey === 'location') {
          query = query.andWhere(
            'location.id NOT IN (:...locationIds) OR location.id IS NULL',
            {
              locationIds: filterArray,
            }
          )
        } else if (filterKey === 'category') {
          query = query.andWhere(
            'category.id NOT IN (:...categoryIds) OR category.id IS NULL',
            {
              categoryIds: filterArray,
            }
          )
        } else if (filterKey === 'colorId') {
          query = query.andWhere(
            'color.id NOT IN (:...colorIds) OR color.id IS NULL',
            {
              colorIds: filterArray,
            }
          )
        } else {
          // Default filtering
          query = query.andWhere(
            `(crystal.${filterKey} NOT IN (:...${filterKey}) OR crystal.${filterKey} IS NULL)`,
            { [filterKey]: filterArray }
          )
        }
      }
    }
  })
  return query
}

export const suggestCrystals = async ({
  selectedCrystalIds = [],
  excludedCrystalIds = [],
  subscriptionId,
  month,
  year,
  cycle,
  // findAge,
  // size,
  inventory,
  category,
  location,
  colorId,
  // rarity,
}) => {
  const previousShipmentCrystalIds = await getPreviousShipmentCrystalIds(
    month,
    year,
    cycle,
    subscriptionId
  )
  const upcomingPrebuildCrystalIds = await getUpcomingPrebuildCrystalIds(
    cycle,
    subscriptionId
  )

  const barredCrystalIds = [
    ...previousShipmentCrystalIds,
    ...upcomingPrebuildCrystalIds,
    ...excludedCrystalIds,
    ...selectedCrystalIds,
  ]

  let query = Crystal.createQueryBuilder('crystal').where({
    id: Not(In(barredCrystalIds)),
  })

  const allFilters = {
    // ...(findAge && { findAge }),
    // ...(size && { size }),
    ...(inventory && { inventory }),
    ...(category && { category }),
    ...(location && { location }),
    ...(colorId && { colorId }),
    // ...(rarity && { rarity }),
  }

  query = addFilters(query, allFilters)

  const crystalsNotInIds = await query
    .orderBy(
      `
    CASE 
      WHEN crystal.inventory = '${Inventory.HIGH}' THEN 1
      WHEN crystal.inventory = '${Inventory.MEDIUM}' THEN 2
      WHEN crystal.inventory = '${Inventory.LOW}' THEN 3
      WHEN crystal.inventory = '${Inventory.OUT}' THEN 4
      ELSE 5
    END
    `,
      'ASC'
    )
    .addOrderBy('crystal.name', 'ASC')
    .leftJoinAndSelect('crystal.color', 'color')
    .leftJoinAndSelect('crystal.category', 'category')
    .leftJoinAndSelect('crystal.location', 'location')
    .getMany()

  // TODO:
  // Handle suggesting crystals they've gotten once or twice or whatever
  //
  // get all colors in existing shipment, prioritize crystals with colors that are not in the existing shipment
  //
  // get all sizes in existing shipment, prioritize crystals with sizes that are not in the existing shipment

  return crystalsNotInIds
}
