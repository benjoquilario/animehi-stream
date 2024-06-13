"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Login from "./auth/login"
import Register from "./auth/register"
import { useAuthStore } from "@/store"

const AuthModal = () => {
  const [isAuthOpen, setIsAuthOpen] = useAuthStore((store) => [
    store.isAuthOpen,
    store.setIsAuthOpen,
  ])

  const [isLogin, setIsLogin] = useAuthStore((store) => [
    store.isLogin,
    store.setIsLogin,
  ])

  console.log(isAuthOpen)

  return (
    <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
      <DialogContent className="pb-12 md:pb-6">
        <DialogHeader>
          <DialogTitle>{!isLogin ? "Login" : "Create an account"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Create an account to enjoy more features"
              : "Enjoy your favourite anime in high quality for free!"}
          </DialogDescription>
        </DialogHeader>
        {!isLogin ? <Login /> : <Register />}
        <div className="absolute bottom-4 left-6">
          {isLogin ? (
            <>
              Don&apos;t have an account?
              <button
                className="ml-2 text-primary"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                className="ml-2 text-primary"
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
