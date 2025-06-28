import React from "react"
import Navbar from "./Navbar"

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="px-5 md:px-[10%] mt-4 mb-10">{children}</main>
    </div>
  )
}

export default Wrapper
