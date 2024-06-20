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

  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  const initialValues: {
    month: number
    year: number
    cycleString: string
    crystalIds: number[]
    subscriptionId: number
  } = {
    month: currentMonth,
    year: currentYear,
    cycleString: "1",
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
    cycleString: Yup.string().nullable().required("Cycle is required"),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  })

  const resetSubType = () => {
    formik.setFieldValue("subscriptionId", subscriptions[0]?.id)
  }

  useEffect(() => {
    resetSubType()
  }, [subscriptions])

  const handleSubmit = async (formData: typeof initialValues) => {
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
    formik.values.cycleString,
    formik.values.month,
    formik.values.year,
    formik.values.subscriptionId,
  ])

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewShipment allSubscriptions={subscriptions} formik={formik} />
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
