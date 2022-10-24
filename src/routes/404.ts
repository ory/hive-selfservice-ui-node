import { UserErrorCard } from "@ory/elements-markup"
import { RouteRegistrator } from "../pkg"

export const register404Route: RouteRegistrator = (app, createHelpers) => {
  app.get("*", (req, res) => {
    res.status(404).render("error", {
      card: UserErrorCard({
        title: "404 - Page not found",
        cardImage: createHelpers?.(req).logo,
        backUrl: "sessions",
        error: {
          id: "404",
          error: {
            reason: "The requested page could not be found (404).",
            code: 404,
          },
        },
      }),
    })
  })
}
