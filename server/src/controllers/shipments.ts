import { Router, Request, Response } from 'express'
import { Shipment } from '../entity/Shipment'
import { Subscription } from '../entity/Subscription'
import { In, ILike } from 'typeorm'
import { Crystal } from '../entity/Crystal'
import { authenticateToken } from './util/authenticateToken'
import { parseCycleCSVToNumbersArray } from './util/parseStringToNumbersArray'

const router = Router()

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const {
    page = 1,
    pageSize = 50,
    searchTerm,
    subscriptionId,
    month,
    year,
    cycle,
  } = req.query

  const pageNumber = parseInt(page as string)
  const pageSizeNumber = parseInt(pageSize as string)

  let whereCondition: any = {}

  whereCondition = {
    ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
    ...(month ? { month: parseInt(month as string) } : {}),
    ...(year ? { year: parseInt(year as string) } : {}),
    ...(cycle ? { cycle: parseInt(cycle as string) } : {}),
    ...(searchTerm ? { groupLabel: searchTerm } : {}),
  }

  const [result, total] = await Shipment.findAndCount({
    where: whereCondition,
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    order: {
      subscription: { id: 'ASC' }, // Correctly order by subscriptionId
      year: 'DESC', // Then by year in descending order
      month: 'DESC', // Then by month in descending order
      cycle: 'ASC', // Then by cycle in ascending order
    },
    relations: ['crystals', 'subscription'],
  })

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  }

  res.json({ data: result, paging })
})

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const shipment = await Shipment.findOne({
    where: { id: parseInt(req.params.id) },
    relations: { crystals: true },
  })
  if (!shipment) {
    return res.status(404).send('Shipment not found')
  }
  res.json(shipment)
})

// Helper function to create and save a shipment
const createAndSaveShipment = async (
  cycle: number,
  shipmentData,
  crystals,
  subscription
) => {
  const shipment = Shipment.create({
    ...shipmentData,
    cycle,
    crystals,
    subscription,
  })
  await Shipment.save(shipment)
  return shipment
}

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { crystalIds, subscriptionId, cycleString, ...shipmentData } =
      req.body
    const subscription = await Subscription.findOneBy({ id: subscriptionId })
    const crystals = await Crystal.findBy({ id: In(crystalIds) })

    if (!subscription) {
      return res.status(400).send('Subscription not found')
    }

    // parse out all the cycles from the cycleString
    const cyclesArray = parseCycleCSVToNumbersArray(cycleString)

    let newShipments = []

    if (cyclesArray.length > 0) {
      for (const cycle of cyclesArray) {
        const shipment = await createAndSaveShipment(
          cycle,
          shipmentData,
          crystals,
          subscription
        )
        newShipments.push(shipment)
      }
    } else {
      return res.status(400).send('Cycle must be provided')
    }

    res.json(newShipments)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  let shipment = await Shipment.findOneBy({ id: parseInt(req.params.id) })
  const { crystalIds } = req.body
  if (!shipment) {
    return res.status(404).send('Shipment not found')
  }
  if (crystalIds) {
    const crystals = await Crystal.findBy({ id: In(crystalIds) })
    shipment.crystals = crystals
  }
  if (req.body.subscriptionId) {
    const subscription = await Subscription.findOneBy({
      id: req.body.subscriptionId,
    })
    if (subscription) {
      shipment.subscription = subscription
    }
  }
  Shipment.merge(shipment, req.body)
  await Shipment.save(shipment)
  res.json(shipment)
})

router.delete(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    // id param will be comma separated ids. I need to delete all

    const ids = req.params.id.split(',').map(id => parseInt(id))
    const shipments = await Shipment.findBy({ id: In(ids) })
    if (shipments.length === 0) {
      return res.status(404).send('Shipment not found')
    }
    await Shipment.remove(shipments)
    res.json(shipments)
  }
)

export default router
