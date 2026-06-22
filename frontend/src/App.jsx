import { Navigate, Route, Routes } from "react-router"

import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import HomePage from "./pages/home/HomePage"
import ProfilePage from "./pages/profile/ProfilePage"
import NotificationPage from "./pages/notification/Notification"

import Sidebar from "./components/common/SideBar"
import RightPanel from "./components/common/RightPanel"
import LoadingSpinner from "./components/common/LoadingSpinner"

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"


function App() {
	const {data : authUser, isLoading} = useQuery({
		// we use querykey to give a unique name to our query and refer to it later 
		queryKey : ["authUser"],
		queryFn : async () => {
			try {
				const res = await fetch("/api/auth/getUser")
				const data = await res.json()

				if(data.error) return null // it helps in logging out the user

				if(!res.ok) throw new Error(data.error || "Something went wrong")
				// console.log("auth user:", data)
				return data
			} 
			catch (error) {
				console.error(error)
				throw error
			}
		},
		retry : false
	})

	if(isLoading){
		return <>
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size = "lg" />
			</div>
		</>
	}

  	return (
      	<div className='flex max-w-6xl mx-auto'>
			{/* common component */}
			{authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"}/>} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"}/>} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"}/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to={"/login"}/>} />
				<Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={"/login"}/>} />
			</Routes>
			{authUser && <RightPanel/>}
			<Toaster/>
		</div>
  )
}

export default App
