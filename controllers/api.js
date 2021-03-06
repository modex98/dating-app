const { StatusCodes } = require("http-status-codes");
let countriesList = require("../helpers/data/countries.json");
let statesList = require("../helpers/data/states.json");
let citiesList = require("../helpers/data/cities.json");

const Controller = require("./controller");

class ApiController extends Controller {
      constructor() {
            super();
      }

      countries(req, res, next) {
            let { pattern } = req.query;

            if (!pattern) return res.end();

            let countries = countriesList.filter((c) => {
                  return (
                        c.name.toLowerCase().includes(pattern) ||
                        c.code.toLowerCase().includes(pattern)
                  );
            });

            super.json(req, res, next, countries);
      }

      states(req, res, next) {
            let { pattern } = req.query;
            let { country_code } = req.params;

            if (!pattern || !country_code) return res.end();

            let states = statesList.filter((state) => {
                  if (state.country_code != country_code) return false;

                  return (
                        state.name.toLowerCase().includes(pattern) ||
                        state.code.toLowerCase().includes(pattern)
                  );
            });

            super.json(req, res, next, states);
      }

      cities(req, res, next) {
            let { pattern } = req.query;
            let { country_code, state_code } = req.params;

            if (!pattern || !country_code || !state_code) return res.end();

            // @ts-ignore
            let cities = citiesList.filter((city) => {
                  if (city.country_code != country_code) return false;
                  if (city.state_code != state_code) return false;

                  return city.name.toLowerCase().includes(pattern);
            });

            super.json(req, res, next, cities);
      }

      location(req, res, next) {
            let { country_code, state_index, city_index } = req.query;

            if (!country_code)
                  return super.json(req, res, next, {}, StatusCodes.NOT_FOUND);

            let country = countriesList.find((c) => c.code == country_code);

            if (!country)
                  return super.json(req, res, next, {}, StatusCodes.NOT_FOUND);

            let payload = { country };

            if (state_index) {
                  payload.state = statesList.find(
                        (s) => s.index == state_index
                  );
            }

            if (city_index) {
                  // @ts-ignore
                  payload.city = citiesList.find(
                        (ct) => ct.index == city_index
                  );
            }

            super.json(req, res, next, payload);
      }
}

module.exports = ApiController;
