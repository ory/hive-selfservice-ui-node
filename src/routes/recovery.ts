import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { Configuration, PublicApi } from '@oryd/kratos-client';
import { isString, methodConfig, redirectOnSoftError } from '../helpers';

const kratos = new PublicApi(new Configuration({ basePath: config.kratos.public }));

export default (req: Request, res: Response, next: NextFunction) => {
  const flow = req.query.flow;

  // The flow is used to identify the account recovery flow and
  // return data like the csrf_token and so on.
  if (!flow || !isString(flow)) {
    console.log('No request found in URL, initializing recovery flow.');
    res.redirect(`${config.kratos.browser}/self-service/recovery/browser`);
    return;
  }

  kratos
    .getSelfServiceRecoveryFlow(flow)
    .then(({ status, data: flow }) => {
      if (status !== 200) {
        return Promise.reject(flow);
      }

      // Render the data using a view (e.g. Jade Template):
      res.render('recovery', {
        ...flow,
        link: methodConfig(flow, 'link')
      });
    })
    .catch(redirectOnSoftError(res, next, '/self-service/recovery/browser'));
}
