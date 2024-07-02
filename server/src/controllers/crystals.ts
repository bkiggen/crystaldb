import { Router, Request, Response } from 'express'
import { Crystal } from '../entity/Crystal'
import { Location } from '../entity/Location'
import { Category } from '../entity/Category'
import { Color } from '../entity/Color'
import { suggestCrystals } from '../services/crystalService'
import { authenticateToken } from './util/authenticateToken'
import { escapeSpecialCharacters } from './util/controllerHelpers'
import { addFilters } from '../services/crystalService'
import { parseCycleCSVToNumbersArray } from './util/parseStringToNumbersArray'

const router = Router()

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const {
    page = 1,
    pageSize = 1000,
    searchTerm,
    inventory,
    category,
    location,
    colorId,
  } = req.query

  const pageNumber = parseInt(page as string)
  const pageSizeNumber = parseInt(pageSize as string)

  const sortBy = (req.query.sortBy || 'name') as string
  const sortDirection = (
    (req.query.sortDirection as string) || 'asc'
  ).toUpperCase() as 'ASC' | 'DESC'

  const sanitizedSearchTerm = searchTerm
    ? escapeSpecialCharacters(searchTerm as string)
    : ''

  let query = Crystal.createQueryBuilder('crystal')

  if (sanitizedSearchTerm) {
    query = query.where('crystal.name ILIKE :searchTerm', {
      searchTerm: `%${sanitizedSearchTerm}%`,
    })
  }

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

  const [result, total] = await query
    .skip((pageNumber - 1) * pageSizeNumber)
    .take(pageSizeNumber)
    .orderBy(`crystal.${sortBy}`, sortDirection)
    .leftJoinAndSelect('crystal.color', 'color')
    .leftJoinAndSelect('crystal.category', 'category')
    .leftJoinAndSelect('crystal.location', 'location')
    .getManyAndCount()

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  }

  res.json({ data: result, paging })
})

router.get(
  '/unused-crystals',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const crystalsNotInShipments = await Crystal.createQueryBuilder('crystal')
        .leftJoin(
          'shipment_crystals_crystal',
          'scc',
          'scc.crystalId = crystal.id'
        )
        .where('scc.crystalId IS NULL')
        .getMany()

      res.json({ data: crystalsNotInShipments })
    } catch (error) {
      console.error('Error fetching unused crystals:', error)
      res.status(500).send('Internal Server Error')
    }
  }
)

router.get(
  '/suggested',
  authenticateToken,
  async (req: Request, res: Response) => {
    const {
      page = 1,
      pageSize = 1000,
      selectedCrystalIds,
      excludedCrystalIds,
      subscriptionId,
      month,
      year,
      cycleString,
      // rarity,
      // findAge,
      // size,
      inventory,
      category,
      location,
      colorId,
    } = req.query as {
      [key: string]: string
    }

    const cyclesArray = parseCycleCSVToNumbersArray(cycleString)

    const selectedCrystalIdsArray = selectedCrystalIds.length
      ? (selectedCrystalIds as string).split(',')
      : []
    const excludedCrystalIdsArray = excludedCrystalIds.length
      ? (excludedCrystalIds as string).split(',')
      : []

    const suggestions = await suggestCrystals({
      selectedCrystalIds: selectedCrystalIdsArray,
      excludedCrystalIds: excludedCrystalIdsArray,
      subscriptionId: parseInt((subscriptionId || 1) as string),
      month: parseInt(month as string),
      year: parseInt(year as string),
      cyclesArray: cyclesArray,
      // rarity: rarity ? rarity.split(",").map((item) => item.trim()) : [],
      // findAge: findAge as string,
      // size: size as string,
      inventory: inventory as string,
      category: category as string,
      location: location as string,
      colorId: colorId as string,
    })

    const total = 100
    const pageNumber = parseInt(page as string)
    const pageSizeNumber = parseInt(pageSize as string)

    const paging = {
      totalCount: total,
      totalPages: Math.ceil(total / pageSizeNumber),
      currentPage: pageNumber,
      pageSize: pageSizeNumber,
    }

    res.json({ data: suggestions, paging })
  }
)

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return res.status(400).send('Invalid crystal ID')
  }

  try {
    // Find the crystal and its associated shipments along with subscriptions
    const crystal = await Crystal.createQueryBuilder('crystal')
      .leftJoinAndSelect('crystal.shipments', 'shipment')
      .leftJoinAndSelect('shipment.subscription', 'subscription')
      .where('crystal.id = :id', { id })
      .getOne()

    if (!crystal) {
      return res.status(404).send('Crystal not found')
    }

    // Extract shipment details with subscription
    const shipments = crystal.shipments.map(shipment => ({
      id: shipment.id,
      month: shipment.month,
      year: shipment.year,
      cycle: shipment.cycle,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      subscription: shipment.subscription
        ? {
            id: shipment.subscription.id,
            shortName: shipment.subscription.shortName,
          }
        : null,
    }))

    // Structure the response
    const response = {
      ...crystal,
      shipments,
    }

    res.json({ data: response })
  } catch (error) {
    console.error('Error fetching crystal details:', error)
    res.status(500).send('Internal Server Error')
  }
})
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { colorId, locationId, categoryId, ...crystalData } = req.body

    let color = null
    let location = null
    let category = null

    if (colorId) {
      color = await Color.findOneBy({ id: colorId })
      if (!color) {
        return res.status(404).send('Color not found')
      }
    }

    if (locationId) {
      location = await Location.findOneBy({ id: locationId })
      if (!location) {
        return res.status(404).send('Location not found')
      }
    }

    if (categoryId) {
      category = await Category.findOneBy({ id: categoryId })
      if (!category) {
        return res.status(404).send('Category not found')
      }
    }

    const crystal = Crystal.create({
      ...crystalData,
      color,
      location,
      category,
    })
    await Crystal.save(crystal)
    res.status(201).json(crystal)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) })
  if (!crystal) {
    return res.status(404).send('Crystal not found')
  }

  if (req.body.colorId) {
    const newColor = await Color.findOneBy({
      id: req.body.colorId,
    })
    if (newColor) {
      crystal.color = newColor
    }
  }

  if (req.body.locationId) {
    const newLocation = await Location.findOneBy({
      id: req.body.locationId,
    })
    if (newLocation) {
      crystal.location = newLocation
    }
  }

  if (req.body.categoryId) {
    const newCategory = await Category.findOneBy({
      id: req.body.categoryId,
    })
    if (newCategory) {
      crystal.category = newCategory
    }
  }

  Crystal.merge(crystal, req.body)
  await Crystal.save(crystal)
  res.json(crystal)
})

router.delete(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) })
    if (!crystal) {
      return res.status(404).send('Crystal not found')
    }
    await Crystal.remove(crystal)
    res.json(crystal)
  }
)

export default router
