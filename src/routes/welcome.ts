import { Request, Response } from "express"
import { Nav, Typography } from "@ory/themes"

import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession,
} from "../pkg"

export const createWelcomeRoute: RouteCreator =
  (createHelpers) => async (req, res) => {
    res.locals.projectName = "Welcome to Ory"

    const { sdk } = createHelpers(req)
    const session = req.session

    // Create a logout URL
    const logoutUrl =
      (
        await sdk
          .createSelfServiceLogoutFlowUrlForBrowsers(req.header("cookie"))
          .catch(() => ({ data: { logout_url: "" } }))
      ).data.logout_url || ""

    res.render("welcome", {
      session: session
        ? JSON.stringify(session, null, 2)
        : `No valid Ory Session was found.
Please sign in to receive one.`,
      hasSession: Boolean(session),
      nav: Nav({
        className: "welcome-nav",
        navTitle: "Project Name",
        navSections: [
          {
            links: [
              {
                name: "Overview",
                url: "/welcome",
                iconLeft: "house",
              },
            ],
          },
          {
            title: "Default User Interfaces",
            titleIcon: "circle-question",
            links: [
              {
                name: "Sign In",
                url: "/login",
                iconLeft: "arrow-right-to-bracket",
                iconRight: "up-right-from-square",
                disabled: Boolean(session),
              },
              {
                name: "Sign Up",
                url: "/registration",
                iconLeft: "arrow-right-to-bracket",
                iconRight: "up-right-from-square",
                disabled: Boolean(session),
              },
              {
                name: "Account Recovery",
                url: "/recovery",
                iconLeft: "user-check",
                iconRight: "up-right-from-square",
                disabled: Boolean(session),
              },
              {
                name: "Account Verification",
                url: "/verification",
                iconLeft: "user-check",
                iconRight: "up-right-from-square",
                disabled: !Boolean(session),
              },
              {
                name: "Account Settings",
                url: "/settings",
                iconLeft: "gear",
                iconRight: "up-right-from-square",
                disabled: !Boolean(session),
              },
              {
                name: "Logout",
                url: logoutUrl,
                iconLeft: "arrow-right-to-bracket",
                iconRight: "up-right-from-square",
                disabled: !Boolean(session),
              },
            ],
          },
        ],
      }),
      logoutUrl,
    })
  }

export const registerWelcomeRoute: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
  route = "/welcome",
) => {
  app.get(route, setSession(createHelpers), createWelcomeRoute(createHelpers))
}
