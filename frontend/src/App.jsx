import { Route, Routes } from "react-router"

import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/SideBar"
import RightPanel from "./components/common/RightPanel"


function App() {
  
  return (
      	<div className='flex max-w-6xl mx-auto'>
			{/* common component */}
			<Sidebar/>
			
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>

			<RightPanel/>
		</div>
  )
}

export default App
