export const formatSelectMultiple = (
  array: { label: string; value: string }[] | undefined
) => {
  return array
    ? array.map(({ value }) => {
        return { id: Number(value) };
      })
    : [];
};

export const formatSelect = (
  object: { label: string; value: string } | undefined
) => {
  return object?.value ? { id: Number(object.value) } : null;
};

export const formatAssetValues = (values) => {
  values.primaryUser = formatSelect(values.primaryUser);
  values.location = formatSelect(values.location);
  values.parentAsset = formatSelect(values.parentAsset);
  values.customers = formatSelectMultiple(values.customers);
  values.vendors = formatSelectMultiple(values.vendors);
  values.assignedTo = formatSelectMultiple(values.assignedTo);
  values.teams = formatSelectMultiple(values.teams);
  values.parts = values.parts.map((part) => {
    return { id: part.id };
  });
  //TODO
  delete values.category;
  return values;
};
