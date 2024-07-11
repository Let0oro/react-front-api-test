const dizznessObj = (obj) => {
  let globalKeys = [];
  let globalValues = [];
  let deep = 0;

  const dizznessSearch = (obj, id = 0) => {
    deep++;
    const currentKeys = Object.keys(obj);
    const currentValues = Object.values(obj);

    const newKeys = [];
    const newValues = [];

    for (let idx = 0; idx < currentKeys.length; idx++) {
      const value = currentValues[idx];
      const key = currentKeys[idx];

      if ((typeof value == "object" && value != null) || Array.isArray(value)) {
        const { keys, values } = dizznessSearch(value, idx);

          newKeys.push([key, keys]);
          newValues.push([values]);
      } else {
        newKeys.push(key);
        newValues.push(value);
      }
    }

    globalValues = [...newValues];
    globalKeys = [...newKeys];

    return { keys: newKeys, values: newValues };
  };
  dizznessSearch(obj);

  return { keys: globalKeys, values: globalValues };
};
export default dizznessObj;
