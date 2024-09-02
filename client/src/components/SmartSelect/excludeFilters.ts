export const excludeFilters = (filters) =>
  Object.keys(filters).reduce((acc, categoryKey) => {
    const options = Object.keys(filters[categoryKey].options).reduce((acc, optionKey) => {
      const option = filters[categoryKey].options[optionKey]
      if (!option.selected) {
        acc.push(option.value)
      }
      return acc
    }, [])

    const newCategoryKey = categoryKey === "color" ? "colorId" : categoryKey
    return { ...acc, [newCategoryKey]: options }
  }, {})
