import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Attractions from './pages/traveler/Attractions';
import Profile from './pages/traveler/Profile';
import AiGuide from './pages/traveler/AiGuide';
import Booking from './pages/traveler/Booking';
import UserRegister from './pages/UserRegister';
import AttractionsInfo from './pages/traveler/AttractionsInfo';
import AddAttractions from './pages/dashboard/AddAttractions';
import BookingInfo from './pages/traveler/BookingInfo';
import BookingList from './pages/traveler/BookingList';
import AddBusiness from './pages/business/AddBusiness';
import Reviews from './pages/business/Reviews';
import BusUpdate from './pages/business/Update';
import Login from './pages/login';
import BookingHistory from './pages/traveler/BookingHistory';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/user/register' element={<UserRegister />} />
          <Route path='/user/profile' element={<Profile />} />

          <Route path='/user/' element={<Attractions />} />
          <Route path='/user/location' element={<AttractionsInfo />} />
          <Route path='/dashboard/add-location' element={<AddAttractions />} />

          <Route path='/user/booking' element={<Booking />} /> {/*2 */}
          <Route path='/user/booking/info' element={<BookingInfo />} />{/* 3*/}
          <Route path='/user/booking/list' element={<BookingList />} />{/* 1*/}
          <Route path='/user/bookinghistory' element={<BookingHistory/>}/>{/*4 */}

          <Route path='/business/add' element={<AddBusiness />} />
          <Route path='/business/review' element={<Reviews />} />
          <Route path='/business/update' element={<BusUpdate />} />

          <Route path='/user/guide' element={<AiGuide />} />
          <Route path='/user/dashboard/rfid' element={<AiGuide />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}
