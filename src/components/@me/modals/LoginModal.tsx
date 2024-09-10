"use client"
import { useCallback, useState } from "react";


import useRegisterModal from "@/hook/useRegisterModal";
import useLoginModal from "@/hook/useLoginModal"

import Input from "../layout/assets/Input";
import Modal from "../layout/assets/Modal";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = useCallback(() => {
        if (isLoading) {
            return;
        }
        
        loginModal.onClose();
        registerModal.onOpen();
    }, [isLoading, loginModal, registerModal])

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
    
            // Pass username and password as query parameters using 'params' key
            await axios.post(`${process.env.apiUrl}/apis/v1/auth/login`, {
                params: {
                    username: username,
                    password: password
                }
            });
            toast.success('Login Success.');
            await signIn('credentials', {
                username,
                password
            });
    
            loginModal.onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [loginModal, username, password]);
    

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input
                placeholder="Username"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
            />
            <Input
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
            />
        </div>
    )

    const footerContent = (
        <div className="text-neutral-400 text-center mt-4">
            <p className="">Don't have an account?&nbsp;
                <span onClick={onToggle} className="text-white cursor-pointer hover:underline">Sign up</span>
            </p>
        </div>
    )
    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Sign in"
            onClose={loginModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
            footer={footerContent}
            />
    )
}

export default LoginModal;