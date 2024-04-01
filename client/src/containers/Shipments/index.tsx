import { useState, useEffect } from "react"

import { Container } from "@mui/material"
import { useFormik } from "formik"
import dayjs from "dayjs"
import * as Yup from "yup"

import { getAllShipments } from "../../api/shipments"
import { getAllSubscriptions } from "../../api/subscriptions"
import { createShipment } from "../../api/shipments"

import type { ShipmentT } from "../../types/Shipment"
import type { SubscriptionT } from "../../types/Subscription"
import type { CrystalT } from "../../types/Crystal"

import usePaging from "../../hooks/usePaging"

import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"
import NewShipment from "./NewShipment"
import Table from "./Table"

const Shipments = () => {
  const [shipments, setShipments] = useState<ShipmentT[] | null>(null)
  const [paging, setPaging] = usePaging()
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionT[]>([])
  const [selectedShipment, setSelectedShipment] = useState<ShipmentT>(null)

  const fetchShipments = async (args) => {
    const response = await getAllShipments(args)
    setShipments(response.data)
    setPaging(response.paging)
  }

  const fetchSubscriptionTypes = async () => {
    const response = await getAllSubscriptions()
    setAllSubscriptions(response || [])
  }

  useEffect(() => {
    fetchShipments({})
    fetchSubscriptionTypes()
  }, [])

  const handleClone = (e, crystals: CrystalT[]) => {
    e.stopPropagation()
    const selectedCrystalIds = crystals.map((crystal) => crystal.id)
    const out = [...selectedCrystalIds, ...formik.values.crystalIds]
    const uniqueIds = Array.from(new Set(out))
    formik.setFieldValue("crystalIds", uniqueIds)
  }

  const addShipment = (newShipment: ShipmentT) => {
    setShipments((prevShipments) => {
      if (prevShipments) {
        return [...prevShipments, newShipment]
      }
      return null
    })
  }

  const [cycleRangeMode, setCycleRangeMode] = useState(false)

  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  const initialValues: {
    month: number
    year: number
    cycle: number
    cycleRangeStart: number
    cycleRangeEnd: number
    crystalIds: number[]
    subscriptionId: number
  } = {
    month: currentMonth,
    year: currentYear,
    cycle: 1,
    cycleRangeStart: 1,
    cycleRangeEnd: 5,
    crystalIds: [],
    subscriptionId: allSubscriptions[0]?.id || 0,
  }

  const validationSchema = Yup.object({
    month: Yup.number().required("Month is required").integer().min(0).max(11),
    year: Yup.number()
      .required("Year is required")
      .integer()
      .min(2016)
      .max(currentYear + 1),
    cycle: Yup.number().nullable().integer().min(1),
    cycleRangeStart: Yup.number().nullable().integer().min(1),
    cycleRangeEnd: Yup.number().nullable().integer().min(1),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  }).test(
    "cycle-or-cycleRange",
    "Either cycle or cycle range (start and end) must be provided",
    (values) => {
      const { cycle, cycleRangeStart, cycleRangeEnd } = values
      const isCycleValid = cycle !== null
      const isCycleRangeValid = cycleRangeStart !== null && cycleRangeEnd !== null

      return isCycleValid || isCycleRangeValid
    },
  )

  const resetSubType = () => {
    formik.setFieldValue("subscriptionId", allSubscriptions[0]?.id)
  }

  useEffect(() => {
    resetSubType()
  }, [allSubscriptions]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (formData: typeof initialValues) => {
    if (cycleRangeMode) {
      formData.cycle = null
    }
    if (!cycleRangeMode) {
      formData.cycleRangeStart = null
      formData.cycleRangeEnd = null
    }
    const newShipment = await createShipment({ ...formData, userCount: 0, userCountIsNew: false })
    addShipment(newShipment)
    await formik.resetForm()
    resetSubType()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewShipment
        allSubscriptions={allSubscriptions}
        formik={formik}
        setCycleRangeMode={setCycleRangeMode}
        cycleRangeMode={cycleRangeMode}
      />
      {selectedShipment ? (
        <UpdateShipmentModal
          shipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
          fetchShipments={fetchShipments}
        />
      ) : null}
      <Table
        shipments={shipments}
        paging={paging}
        allSubscriptions={allSubscriptions}
        fetchShipments={fetchShipments}
        setSelectedShipment={setSelectedShipment}
        handleClone={handleClone}
      />
    </Container>
  )
}

export default Shipments
