import React, { useEffect, useState } from 'react'
import { Header } from "components/Header"
import { ErrorContainer } from '@oryd/kratos-client'
import { getError } from 'services/kratos'
interface KratosError {
  code: number, status: string, reason?: string, message?: string
}

export const Error = () => {
  const [error, setError] = useState<ErrorContainer>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorId = params.get('error') || 'stub:500';
    console.error("errorId:", errorId)
    const request = getError(errorId) as Promise<ErrorContainer>;
    request
      .then(errors => setError(errors))
      .catch((err) => {
        console.error(err);
      });
  }, [setError]);

  const errors =   error?.errors as KratosError[];
  console.error(errors);

  return (
    <div className="content">
      <Header />
        <h4>Has a Error: { error?.id || ""}</h4>
        <div className="messages">
          { errors && errors.map(({code, status, reason, message}: KratosError) => 
            <div key={ status } className={ `message ${status}` }>
              <label>code: {code}</label>
              <br/>
              <label>status: {status}</label>
              <br/>
              <label>message: {message}</label>
              <br/>
              <label>reason: {reason}</label>
            </div>) 
          }
      </div>
    </div>
  );
};
