import { useEffect } from "react"

import { MenuItem, TextField } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"
import { useSubscriptionStore } from "../../store/subscriptionStore"

type PaginationT = {
  setSelectedSubscriptionId: (arg: string) => void
  selectedSubscriptionId: string | null
}

const Pagination = ({ setSelectedSubscriptionId, selectedSubscriptionId }: PaginationT) => {
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()

  const filterOptions = subscriptions.map((s) => {
    return {
      label: s.shortName,
      value: s.id,
    }
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return (
    <TextField
      select
      id="filter"
      placeholder="Filter"
      defaultValue="All"
      value={selectedSubscriptionId || "All"}
      onChange={(event) => {
        setSelectedSubscriptionId(event.target.value)
      }}
      sx={{ ...textFieldStyles, minWidth: "200px" }}
    >
      <MenuItem key="All" value="All">
        All
      </MenuItem>
      {filterOptions.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default Pagination
