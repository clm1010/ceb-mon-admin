import React from 'react'
import { Router, Route, Switch, Redirect } from 'dva/router'
import dynamic from "dva/dynamic";
import App from './routes/app'
import {commOutRoutes, commInRoutes} from './routesDef'
import {myCompanyName} from './utils/config'

let custORoutes=[],custIRoutes=[];
try {
  let {custOutRoutes, custInRoutes} = require('./customization/'+myCompanyName+'/routesDef');
  custORoutes = custOutRoutes || [];
  custIRoutes = custInRoutes || [];
} catch (e) {
  console.log(e)
}
//let {custOutRoutes, custInRoutes} = require('./customization/'+myCompanyName+'/routesDef')
//let {custOutRoutes, custInRoutes} = require('./customization/Ebank/routesDef')
console.log(custORoutes,custIRoutes)

const Routers = function ({ history, app }) {
  return <Router history={history}>
            <Switch>
              {commOutRoutes.map(({ path, exact, ...dynamics }, index) => (
                  <Route key={index} path={path} exact={exact} component={dynamic({app, ...dynamics})} />
              ))}

              {custORoutes.map(({ path, exact, ...dynamics }, index) => (
                  <Route key={index} path={path} exact={exact} component={dynamic({app, ...dynamics})} />
              ))}

              <App>
              {commInRoutes.map(({ path, exact, ...dynamics }, index) => (
                  <Route key={index} path={path} exact={exact} component={dynamic({app, ...dynamics})} />
              ))}

              {custIRoutes.map(({ path, exact, ...dynamics }, index) => (
                  <Route key={index} path={path} exact={exact} component={dynamic({app, ...dynamics})} />
              ))}
              </App>
            </Switch>
          </Router>
}
export default Routers
