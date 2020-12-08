import React, { useEffect, useState } from "react"
import { VerificationFlow } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"
import { Header } from "components/Header"

export const Verify = () => {
  const [requestResponse, setRequestResponse] = useState<VerificationFlow>()

  useEffect(() => {
    const request = initialiseRequest({ type: "verify" }) as Promise<VerificationFlow>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const form = requestResponse?.methods?.password?.config;
  const messages = requestResponse?.messages;

  return (
    <div className="content">
      <Header />
      <div className="container">
        <h4>Resend verification code</h4>
        { messages && <KratosMessages messages={ messages } /> }
         { form
          && <React.Fragment>
            <KratosForm
              submitLabel="Resend verification code"
              action={ form.action }
              fields={ form.fields }
              messages={ form.messages } />
          </React.Fragment> }
      </div>
    </div>
  )
}
