import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { CommonApi, ErrorContainer } from '@oryd/kratos-client'
import { IncomingMessage } from 'http'

const commonApi = new CommonApi(config.kratos.admin)

export default (req: Request, res: Response, next: NextFunction) => {
  const error = req.query.error

  if (!error) {
    // No error was send, redirecting back to home.
    res.redirect(config.baseUrl)
    return
  }

  commonApi
    .getSelfServiceError(error)
    .then(
      ({
        body,
        response,
      }: {
        body: ErrorContainer
        response: IncomingMessage
      }) => {
        if (response.statusCode == 404) {
          // The error could not be found, redirect back to home.
          res.redirect(config.baseUrl)
          return
        }

        return body
      }
    )
    .then((errorContainer = {}) => {
      if ('errors' in errorContainer) {
        res.status(500).render('error', {
          message: JSON.stringify(errorContainer.errors, null, 2),
        })
        return Promise.resolve()
      }

      return Promise.reject(
        `expected errorContainer to contain "errors" but got ${JSON.stringify(
          errorContainer
        )}`
      )
    })
    .catch(err => next(err))
}
