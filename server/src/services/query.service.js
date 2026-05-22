const parsePositiveInt = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const buildListQuery = (reqQuery, allowedFilters = []) => {
  const page = parsePositiveInt(reqQuery.page, 1);
  const limit = Math.min(parsePositiveInt(reqQuery.limit, 20), 100);
  const sort = reqQuery.sort || "-createdAt";
  const filter = {};

  allowedFilters.forEach((key) => {
    if (reqQuery[key] !== undefined && reqQuery[key] !== "") {
      filter[key] = reqQuery[key];
    }
  });

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
    filter,
  };
};

module.exports = {
  buildListQuery,
};
