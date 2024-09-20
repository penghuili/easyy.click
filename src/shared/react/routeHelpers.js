export function getQueryParams() {
  const obj = {};

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

export function objectToQueryString(obj) {
  const searchParams = new URLSearchParams();
  Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .forEach(key => {
      searchParams.set(key, obj[key]);
    });

  return searchParams.toString();
}
