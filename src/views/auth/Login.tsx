import React, {useEffect, useState} from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../api/auth";
import {
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../../store/constants/actionTypes';
import { APP_NAME } from "config/appConfig";

const mapStateToProps = (state:any) => ({ auth: state.auth });

const mapDispatchToProps = (dispatch:any) => ({
  onSubmit: async (email: string, password: string) =>
    dispatch({ type: LOGIN, payload: login(email, password)})
});

function Login({auth, onSubmit}:any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(null);

  useEffect(()=>{
    setError(auth.errors)
  },[auth])

  const handleLogin = (e: any) => {
    e.preventDefault();
    onSubmit(email,password);
  }
  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
              <div className="rounded-t mb-0 px-6 py-6 pb-2">
                <div className="text-center mb-3">
                  <h1 className="text-gray-600 uppercase text-3xl font-bold">
                    {APP_NAME}
                  </h1>
                </div>
                <hr className="mt-6 border-b-1 border-gray-400" />
              </div>
              <div className="flex-auto px-4 lg:px-10 pb-10 pt-0">
                {error ?
                  <div className="text-red-500 text-center font-bold">
                    <small>{error}</small>
                  </div> :
                   null
                }
                
                <form onSubmit={handleLogin}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      onChange={(val) => setEmail(val.target.value)}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      onChange={(val)=>setPassword(val.target.value)}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-300"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/register" className="text-gray-300">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
