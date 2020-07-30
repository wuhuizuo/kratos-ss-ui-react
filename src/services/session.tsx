import React, { createContext, useContext, useEffect, useState } from "react"
import { PublicApi, Session } from "@oryd/kratos-client"
import { isAuthenticated, unsetAuthenticated, useAuth } from "services/auth"
import config from "config/kratos"

const kratos = new PublicApi(config.kratos.public)

const SessionContext = createContext(
  new Session()
)

export const useSession = () => useContext(SessionContext)

export const SessionProvider: React.FunctionComponent = ({ children }) => {
  const { refresh, login } = useAuth()
  const [session, setSession] = useState(
    new Session()
  )

  useEffect(() => {
    isAuthenticated() && kratos.whoami()
      .then(({ body }) => {
        const now = new Date()
        const expiry = body.expiresAt
        console.log(now > expiry)
        // Expired sessions need to be refreshed.
        if (now > expiry) return refresh()
        else setSession(body)
      })
      .catch(error => {
        // Request may fail due to an expired token.
        unsetAuthenticated()
        console.log(error)
        login()
      })
  }, [login, refresh])

  return (
    <SessionContext.Provider value={ session }>
      { children }
    </SessionContext.Provider>
  )
}
