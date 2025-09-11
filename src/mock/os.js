import mockjs from 'mockjs'
// import moment from 'moment';
//
// const random = mockjs.Random;

export default {
  'POST /api/v1/ost_q': {
    data: [
      {
        success: true,
        message: 'ok',
        query: 'select city_anme  max(month) from alerts.status group by city',
        resultset: [
          { city_name: 'cs', 'max(month)': 12 },
          { city_name: 'wh', 'max(month)': 8 },
          { city_name: 'qd', 'max(month)': 1 },
          { city_name: 'hh', 'max(month)': 2 },
          { city_name: 'zh', 'max(month)': 5 },
        ],
      },
      {
        success: true,
        message: 'ok',
        query: 'select prov_name, sum(population) from custom.cities group by province',
        resultset: [
        { prov_name: 'hn', 'sum(population)': 11111 },
        { prov_name: 'hlj', 'sum(population)': 2222 },
        { prov_name: 'wh', 'sum(population)': 33 },
        { prov_name: 'gz', 'sum(population)': 4444 },
      ],
      },
      {
        success: false,
        message: 'sql 不对',
        query: 'nosql is no sql',
      },
    ],
    os_uuid: '980825ab-Eeb5-C4b6-EcB4-6d41242c4e1f',

  },
}
