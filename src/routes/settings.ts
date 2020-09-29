import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { AdminApi, Configuration } from '@oryd/kratos-client';
import { isString, methodConfig, redirectOnSoftError } from '../helpers';

// Variable config has keys:
// kratos: {
//
//   // The browser config key is used to redirect the user. It reflects where ORY Kratos' Public API
//   // is accessible from. Here, we're assuming traffic going to `http://example.org/.ory/kratos/public/`
//   // will be forwarded to ORY Kratos' Public API.
//   browser: 'https://kratos.example.org',
//
//   // The location of the ORY Kratos Admin API
//   admin: 'https://ory-kratos-admin.example-org.vpc',
//
//   // The location of the ORY Kratos Public API within the cluster
//   public: 'https://ory-kratos-public.example-org.vpc',
// },

const kratos = new AdminApi(new Configuration({ basePath: config.kratos.admin }));

const settingsHandler = (req: Request, res: Response, next: NextFunction) => {
  const flow = req.query.flow;
  // The flow ID is used to identify the account settings flow and
  // return data like the csrf_token and so on.
  if (!flow || !isString(flow)) {
    console.log('No flow found in URL, initializing flow.');
    res.redirect(`${config.kratos.browser}/self-service/settings/browser`);
    return;
  }

  kratos
    .getSelfServiceSettingsFlow(flow)
    .then(({ status, data: flow }) => {
      if (status !== 200) {
        return Promise.reject(flow);
      }

      // Render the data using a view (e.g. Jade Template):
      res.render('settings', {
        ...flow,
        password: methodConfig(flow, 'oidc'),
        profile: methodConfig(flow, 'password'),
        oidc: methodConfig(flow, 'profile'),
      });
    })
    .catch(redirectOnSoftError(res, next, '/self-service/settings/browser'));
};

export default settingsHandler;
