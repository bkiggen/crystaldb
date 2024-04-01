import { useState } from "react"
import { defaultPaging, PagingT } from "../types/Paging"

export default function usePaging(): [PagingT, (paging: PagingT) => void] {
  const [paging, setPaging] = useState<PagingT>(defaultPaging)

  return [paging, setPaging]
}
