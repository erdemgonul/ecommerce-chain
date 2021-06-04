import axios from 'axios';
import React from "react";
import {Toast} from "./Toast";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const history = useHistory();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        let email = e.target.elements.email?.value;
        let password = e.target.elements.password?.value;
        let username = e.target.elements.username?.value;
        let firstname = e.target.elements.firstname?.value
        let lastname = e.target.elements.lastname?.value;

        axios.post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/auth/signup`, { userName: username, password: password, firstName: firstname, lastName: lastname, email: email },)
            .then(res => {
                if(res.data.error){
                    Toast(res.data.error);
                }
                else history.push({
                    pathname: "/",

                });
            }).catch(err => {
            if (err.response.data.message){
                Toast(err.response.data.message);
            }
            });
    };
    return (
        <div className='h-screen flex bg-gray-bg1'>
            <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
                <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                    Create New Account 🔐
                </h1>

                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                            id='username'
                            placeholder='Your username'
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                            id='email'
                            placeholder='Your Email'
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                            id='password'
                            placeholder='Your Password'
                        />
                    </div>
                    <div>
                        <label htmlFor='firstname'>Firstname</label>
                        <input
                            type='text'
                            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                            id='firstname'
                            placeholder='Your firstname'
                        />
                    </div>
                    <div>
                        <label htmlFor='lastname'>Lastname</label>
                        <input
                            type='text'
                            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                            id='lastname'
                            placeholder='Your lastname'
                        />
                    </div>
                    <div className='flex justify-center items-center mt-6'>
                        <button
                            className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
