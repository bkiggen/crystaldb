import { useState, useEffect } from "react"

import { Container } from "@mui/material"
import { useFormik } from "formik"
import dayjs from "dayjs"
import * as Yup from "yup"

import { useShipmentStore } from "../../store/shipmentStore"
import { useSubscriptionStore } from "../../store/subscriptionStore"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"
import ShipmentsTable from "./ShipmentsTable"

const Shipments = () => {
  const { createShipment, fetchShipments, shipments, loading, paging } = useShipmentStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()
  const [selectedShipment, setSelectedShipment] = useState<ShipmentT>(null)

  useEffect(() => {
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
    groupLabel: Yup.string().nullable(),
  })

  const resetSubType = () => {
    formik.setFieldValue("subscriptionId", subscriptions[0]?.id)
  }

  useEffect(() => {
    resetSubType()
  }, [subscriptions])

  const handleSubmit = async (formData: typeof initialValues) => {
    if (formData.crystalIds.length > 0) {
      createShipment({ ...formData, userCount: 0, userCountIsNew: false })

      await formik.resetForm()
      resetSubType()
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      {selectedShipment ? (
        <UpdateShipmentModal
          selectedShipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
        />
      ) : null}
      <ShipmentsTable
        loading={loading}
        shipments={shipments}
        paging={paging}
        fetchShipments={fetchShipments}
        setSelectedShipment={setSelectedShipment}
        handleClone={handleClone}
      />
    </Container>
  )
}

export default Shipments
