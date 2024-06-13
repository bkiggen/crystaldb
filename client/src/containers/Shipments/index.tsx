import { useState, useEffect } from "react"

import { Container } from "@mui/material"
import { useFormik } from "formik"
import dayjs from "dayjs"
import * as Yup from "yup"

import { useShipmentStore } from "../../store/shipmentStore"
import { useSubscriptionStore } from "../../store/subscriptionStore"
import { useCrystalStore } from "../../store/crystalStore"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"
import NewShipment from "./NewShipment"
import Table from "./Table"

const Shipments = () => {
  const { createShipment, fetchShipments, shipments, loading, paging } = useShipmentStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()
  const { suggestedCrystals, setSuggestedCrystals } = useCrystalStore()

  const [selectedShipment, setSelectedShipment] = useState<ShipmentT>(null)

  useEffect(() => {
    fetchShipments({})
    fetchSubscriptions()
  }, [])

  const handleClone = (e, crystals: CrystalT[]) => {
    e.stopPropagation()
    const selectedCrystalIds = crystals.map((crystal) => crystal.id)
    const out = [...selectedCrystalIds, ...formik.values.crystalIds]
    const uniqueIds = Array.from(new Set(out))
    formik.setFieldValue("crystalIds", uniqueIds)
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
    subscriptionId: subscriptions[0]?.id || 0,
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
    formik.setFieldValue("subscriptionId", subscriptions[0]?.id)
  }

  useEffect(() => {
    resetSubType()
  }, [subscriptions]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (formData: typeof initialValues) => {
    if (cycleRangeMode) {
      formData.cycle = null
    }
    if (!cycleRangeMode) {
      formData.cycleRangeStart = null
      formData.cycleRangeEnd = null
    }
    createShipment({ ...formData, userCount: 0, userCountIsNew: false })

    await formik.resetForm()
    resetSubType()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (suggestedCrystals.length) {
      setSuggestedCrystals([])
    }
  }, [
    formik.values.cycle,
    formik.values.cycleRangeStart,
    formik.values.cycleRangeEnd,
    formik.values.month,
    formik.values.year,
    formik.values.subscriptionId,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewShipment
        allSubscriptions={subscriptions}
        formik={formik}
        setCycleRangeMode={setCycleRangeMode}
        cycleRangeMode={cycleRangeMode}
      />
      {selectedShipment ? (
        <UpdateShipmentModal
          selectedShipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
        />
      ) : null}
      <Table
        loading={loading}
        shipments={shipments}
        paging={paging}
        allSubscriptions={subscriptions}
        fetchShipments={fetchShipments}
        setSelectedShipment={setSelectedShipment}
        handleClone={handleClone}
      />
    </Container>
  )
}

export default Shipments
